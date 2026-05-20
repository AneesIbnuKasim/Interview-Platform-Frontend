import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  MessageSquare,
  Users,
  PhoneOff,
  Wifi,
  Copy,
  ShieldCheck,
  RefreshCw,
  UserCheck,
  UserX,
} from "lucide-react";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { VideoGrid } from "@/components/video/VideoGrid";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { Button } from "@/components/common/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  admitParticipant,
  denyParticipant,
  fetchRoom,
  joinRoom,
  leaveRoom as resetRoomState,
  leaveRoomSession,
  setRoom,
  updateRoomStatus,
} from "@/features/room/roomSlice";
import {
  setParticipants,
  updateParticipantMedia,
} from "@/features/participants/participantsSlice";
import { incUnread, markRead, receiveMessage } from "@/features/chat/chatSlice";
import {
  markRoomNotificationsRead,
  receiveNotification,
} from "@/features/notifications/notificationsSlice";
import { setChatOpen, setParticipantsOpen } from "@/features/ui/uiSlice";
import { useElapsed } from "@/hooks/useElapsed";
import { cn } from "@/lib/cn";
import { connectSocket, getSocket, socketEvents } from "@/lib/socket";

function mapParticipants(participants) {
  return (participants || []).map((participant, index) => ({
    id: participant.id,
    socketId: participant.socketId,
    name: participant.name,
    role: participant.role,
    status: participant.status,
    requestedAt: participant.requestedAt,
    muted: participant.media?.micOn !== true,
    cameraOn: participant.media?.cameraOn === true,
    screenSharing: Boolean(participant.media?.screenSharing),
    quality: participant.status === "active" ? "good" : "ok",
    color: ["#7c3aed", "#06b6d4", "#ec4899", "#22c55e"][index % 4],
  }));
}

function mapSocketParticipants(participants) {
  return (participants || []).map((participant, index) => ({
    id: participant.userId,
    socketId: participant.socketId,
    name: participant.name,
    role: participant.role,
    status: "active",
    muted: participant.media?.micOn === false,
    cameraOn: participant.media?.cameraOn !== false,
    speaking: Boolean(participant.media?.speaking),
    screenSharing: Boolean(participant.media?.screenSharing),
    quality: "good",
    color: ["#7c3aed", "#06b6d4", "#ec4899", "#22c55e"][index % 4],
  }));
}

export default function RoomPage() {
  const { roomId = "" } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const room = useAppSelector((s) => s.room);
  const roomParticipants = useAppSelector((s) => s.room.current?.participants);
  const ui = useAppSelector((s) => s.ui);
  const participants = useAppSelector((s) => s.participants.list);
  const chatUnread = useAppSelector((s) => s.chat.unread);
  const me = useAppSelector((s) => s.auth.user);
  const elapsed = useElapsed(room.startedAt);

  const [mic, setMic] = useState(false);
  const [cam, setCam] = useState(false);
  const [screen, setScreen] = useState(false);
  const [shareView, setShareView] = useState("editor");
  const [localStream, setLocalStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [checkingAdmission, setCheckingAdmission] = useState(false);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const peersRef = useRef(new Map());
  const participantsRef = useRef(new Map());
  const leavingRef = useRef(false);
  const micRef = useRef(mic);
  const camRef = useRef(cam);
  const isHost = Boolean(me?.id && room.current?.ownerId === me.id);
  const pendingRequests = (room.current?.participants || []).filter((item) => {
    return item.status === "pending";
  });

  // Socket/WebRTC handlers use refs for mutable peer and media state.
  useEffect(() => {
    micRef.current = mic;
    camRef.current = cam;
  }, [cam, mic]);

  useEffect(() => {
    if (roomId) {
      dispatch(joinRoom({ roomId }));
    }
  }, [roomId, dispatch]);

  useEffect(() => {
    if (!isHost || !roomId) return undefined;

    const interval = window.setInterval(() => {
      dispatch(fetchRoom(roomId));
    }, 5000);

    return () => window.clearInterval(interval);
  }, [dispatch, isHost, roomId]);

  useEffect(() => {
    if (roomParticipants && participantsRef.current.size === 0) {
      const activeParticipants = roomParticipants.filter((participant) => {
        return participant.status !== "pending";
      });
      dispatch(setParticipants(mapParticipants(activeParticipants)));
    }
  }, [dispatch, roomParticipants]);

  function getPeerKey(socketId, kind) {
    return `${socketId}:${kind}`;
  }

  function setRemoteStream(userId, kind, stream) {
    setRemoteStreams((current) => ({
      ...current,
      [userId]: {
        ...current[userId],
        [kind]: stream,
      },
    }));
  }

  function clearRemoteStream(userId, kind) {
    setRemoteStreams((current) => {
      const next = { ...current };
      if (!next[userId]) return current;

      next[userId] = {
        ...next[userId],
        [kind]: null,
      };

      return next;
    });
  }

  function addLocalTracks(peer, kind) {
    const stream =
      kind === "screen" ? screenStreamRef.current : localStreamRef.current;
    if (!stream) return;

    stream.getTracks().forEach((track) => {
      const alreadyAdded = peer.pc.getSenders().some((sender) => {
        return sender.track === track;
      });

      if (!alreadyAdded) {
        peer.pc.addTrack(track, stream);
      }
    });
  }

  function removeStaleLocalTracks(peer, kind) {
    const stream =
      kind === "screen" ? screenStreamRef.current : localStreamRef.current;
    const liveTracks = new Set(stream?.getTracks() || []);

    peer.pc.getSenders().forEach((sender) => {
      if (!sender.track || liveTracks.has(sender.track)) return;

      peer.pc.removeTrack(sender);
    });
  }

  async function negotiatePeer(peer) {
    const socket = connectSocket();
    if (!socket || peer.pc.signalingState !== "stable") return;

    const offer = await peer.pc.createOffer();
    await peer.pc.setLocalDescription(offer);
    socket.emit(socketEvents.SIGNAL_OFFER, {
      roomId,
      targetSocketId: peer.socketId,
      kind: peer.kind,
      offer,
    });
  }

  function createPeerConnection(participant, kind) {
    const key = getPeerKey(participant.socketId, kind);
    const existingPeer = peersRef.current.get(key);
    if (existingPeer) return existingPeer;

    const socket = connectSocket();
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    const peer = {
      pc,
      kind,
      socketId: participant.socketId,
      userId: participant.id || participant.userId,
    };

    pc.onicecandidate = (event) => {
      if (!event.candidate || !socket) return;

      socket.emit(socketEvents.SIGNAL_ICE_CANDIDATE, {
        roomId,
        targetSocketId: peer.socketId,
        kind,
        candidate: event.candidate,
      });
    };

    pc.ontrack = (event) => {
      const [stream] = event.streams;
      const remoteStream = stream || new MediaStream([event.track]);
      setRemoteStream(peer.userId, kind, remoteStream);

      event.track.addEventListener("ended", () => {
        clearRemoteStream(peer.userId, kind);
      });
    };

    if (kind === "camera") {
      pc.addTransceiver("audio", { direction: "recvonly" });
      pc.addTransceiver("video", { direction: "recvonly" });
    }

    addLocalTracks(peer, kind);
    peersRef.current.set(key, peer);
    return peer;
  }

  function closePeer(socketId, kind) {
    const key = getPeerKey(socketId, kind);
    const peer = peersRef.current.get(key);
    if (!peer) return;

    peer.pc.close();
    peersRef.current.delete(key);
    clearRemoteStream(peer.userId, kind);
  }

  async function ensureCameraPeers(participants) {
    const socket = connectSocket();
    if (!socket?.id) return;

    for (const participant of participants) {
      if (!participant.socketId || participant.socketId === socket.id) continue;

      const peer = createPeerConnection(participant, "camera");
      if (socket.id < participant.socketId) {
        await negotiatePeer(peer);
      }
    }
  }

  async function renegotiatePeers(kind) {
    for (const peer of peersRef.current.values()) {
      if (peer.kind === kind) {
        removeStaleLocalTracks(peer, kind);
        addLocalTracks(peer, kind);
        await negotiatePeer(peer);
      }
    }
  }

  async function startScreenPeers() {
    const socket = connectSocket();
    if (!socket?.id) return;

    for (const participant of participantsRef.current.values()) {
      if (!participant.socketId || participant.socketId === socket.id) continue;

      const peer = createPeerConnection(participant, "screen");
      await negotiatePeer(peer);
    }
  }

  function closeScreenPeers() {
    for (const peer of Array.from(peersRef.current.values())) {
      if (peer.kind === "screen") {
        closePeer(peer.socketId, "screen");
      }
    }
  }

  useEffect(() => {
    if (
      !roomId ||
      room.admissionRequired ||
      ![room.current?.id, room.current?._id].includes(roomId)
    ) {
      return undefined;
    }

    const socket = connectSocket();

    if (!socket) return undefined;

    const joinRealtimeRoom = () => {
      if (leavingRef.current) return;

      socket.emit(socketEvents.ROOM_JOIN, {
        roomId,
        micOn: micRef.current,
        cameraOn: camRef.current,
      });
    };

    const handleMessage = (payload) => {
      if (!ui.chatOpen) return;
      dispatch(receiveMessage(payload.message));
    };
    const handleNotification = (payload) => {
      const notification = payload?.notification;
      if (!notification || notification.data?.authorId === me?.id) return;
      dispatch(receiveNotification(notification));
      if (!ui.chatOpen) {
        dispatch(incUnread());
      }
    };
    const handleJoinRequested = (payload) => {
      if (payload?.room) {
        dispatch(setRoom(payload.room));
      }
    };
    const handleMedia = (payload) => {
      if (payload?.participant) {
        dispatch(updateParticipantMedia(payload.participant));

        if (payload.participant.userId === me?.id) {
          setMic(payload.participant.media?.micOn !== false);
          setCam(payload.participant.media?.cameraOn !== false);
          setScreen(Boolean(payload.participant.media?.screenSharing));
        }

        if (!payload.participant.media?.screenSharing) {
          clearRemoteStream(payload.participant.userId, "screen");
          closePeer(payload.participant.socketId, "screen");
        }
      }
    };
    const handleParticipants = (payload) => {
      if (!payload?.participants) return;
      const mappedParticipants = mapSocketParticipants(payload.participants);

      participantsRef.current = new Map(
        mappedParticipants
          .filter((participant) => participant.socketId)
          .map((participant) => [participant.socketId, participant]),
      );
      const activeSocketIds = new Set(participantsRef.current.keys());
      peersRef.current.forEach((peer) => {
        if (!activeSocketIds.has(peer.socketId)) {
          closePeer(peer.socketId, peer.kind);
        }
      });
      dispatch(setParticipants(mappedParticipants));
      ensureCameraPeers(mappedParticipants);
    };
    const handleOffer = async (payload) => {
      const kind = payload.kind || "camera";
      const participant = {
        id: payload.from?.userId,
        userId: payload.from?.userId,
        socketId: payload.from?.socketId,
        name: payload.from?.name,
      };
      if (!participant.socketId) return;

      const socket = connectSocket();
      const peer = createPeerConnection(participant, kind);
      addLocalTracks(peer, kind);

      await peer.pc.setRemoteDescription(
        new RTCSessionDescription(payload.offer),
      );
      const answer = await peer.pc.createAnswer();
      await peer.pc.setLocalDescription(answer);
      socket?.emit(socketEvents.SIGNAL_ANSWER, {
        roomId,
        targetSocketId: participant.socketId,
        kind,
        answer,
      });
    };
    const handleAnswer = async (payload) => {
      const kind = payload.kind || "camera";
      const key = getPeerKey(payload.from?.socketId, kind);
      const peer = peersRef.current.get(key);
      if (!peer || peer.pc.signalingState === "stable") return;

      await peer.pc.setRemoteDescription(
        new RTCSessionDescription(payload.answer),
      );
    };
    const handleIceCandidate = async (payload) => {
      const kind = payload.kind || "camera";
      const key = getPeerKey(payload.from?.socketId, kind);
      const peer = peersRef.current.get(key);
      if (!peer || !payload.candidate) return;

      await peer.pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
    };

    socket.on("connect", joinRealtimeRoom);
    socket.on(socketEvents.CHAT_MESSAGE_CREATED, handleMessage);
    socket.on(socketEvents.NOTIFICATION_NEW, handleNotification);
    socket.on(socketEvents.ROOM_JOIN_REQUESTED, handleJoinRequested);
    socket.on(socketEvents.ROOM_STATE, handleParticipants);
    socket.on(socketEvents.PARTICIPANTS_STATE, handleParticipants);
    socket.on(socketEvents.PARTICIPANT_MEDIA_CHANGED, handleMedia);
    socket.on(socketEvents.MEDIA_SCREEN_SHARE_CHANGED, handleMedia);
    socket.on(socketEvents.SIGNAL_OFFER, handleOffer);
    socket.on(socketEvents.SIGNAL_ANSWER, handleAnswer);
    socket.on(socketEvents.SIGNAL_ICE_CANDIDATE, handleIceCandidate);

    if (socket.connected) {
      joinRealtimeRoom();
    }

    return () => {
      socket.off("connect", joinRealtimeRoom);
      socket.off(socketEvents.CHAT_MESSAGE_CREATED, handleMessage);
      socket.off(socketEvents.NOTIFICATION_NEW, handleNotification);
      socket.off(socketEvents.ROOM_JOIN_REQUESTED, handleJoinRequested);
      socket.off(socketEvents.ROOM_STATE, handleParticipants);
      socket.off(socketEvents.PARTICIPANTS_STATE, handleParticipants);
      socket.off(socketEvents.PARTICIPANT_MEDIA_CHANGED, handleMedia);
      socket.off(socketEvents.MEDIA_SCREEN_SHARE_CHANGED, handleMedia);
      socket.off(socketEvents.SIGNAL_OFFER, handleOffer);
      socket.off(socketEvents.SIGNAL_ANSWER, handleAnswer);
      socket.off(socketEvents.SIGNAL_ICE_CANDIDATE, handleIceCandidate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    me?.id,
    room.admissionRequired,
    room.current?.id,
    room.current?._id,
    roomId,
    ui.chatOpen,
  ]);

  useEffect(() => {
    if (!ui.chatOpen || !roomId) return;

    dispatch(markRead());
    dispatch(markRoomNotificationsRead(roomId));
    const socket = connectSocket();
    socket?.emit(socketEvents.CHAT_READ, { roomId });
  }, [dispatch, roomId, ui.chatOpen]);

  useEffect(() => {
    const peers = peersRef.current;

    return () => {
      const socket = getSocket();

      if (socket.connected && roomId) {
        socket.emit(socketEvents.ROOM_LEAVE, { roomId, persist: false });
      }

      dispatch(setParticipants([]));
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      screenStreamRef.current?.getTracks().forEach((track) => track.stop());
      peers.forEach((peer) => peer.pc.close());
      peers.clear();
    };
  }, [dispatch, roomId]);

  function leaveRealtimeRoom() {
    const socket = getSocket();

    if (!socket.connected) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const timeout = window.setTimeout(resolve, 700);

      socket.emit(socketEvents.ROOM_LEAVE, { roomId, persist: false }, () => {
        window.clearTimeout(timeout);
        resolve();
      });
    });
  }

  async function leave() {
    leavingRef.current = true;

    try {
      await dispatch(leaveRoomSession(roomId)).unwrap();
      await leaveRealtimeRoom();
      dispatch(setParticipants([]));
      navigate("/dashboard");
    } catch {
      leavingRef.current = false;
    }
  }

  async function endInterview() {
    if (!isHost || !roomId) return;

    leavingRef.current = true;

    try {
      await dispatch(updateRoomStatus({ roomId, status: "ended" })).unwrap();
      await leaveRealtimeRoom();
      dispatch(setParticipants([]));
      navigate("/dashboard");
    } catch {
      leavingRef.current = false;
      // Error is rendered from Redux state.
    }
  }

  function copyRoomLink() {
    const value = window.location.href;
    navigator.clipboard?.writeText(value);
  }

  async function checkAdmission() {
    if (!roomId) return;

    setCheckingAdmission(true);
    try {
      await dispatch(joinRoom({ roomId })).unwrap();
    } finally {
      setCheckingAdmission(false);
    }
  }

  async function leaveWaitingRoom() {
    try {
      await dispatch(leaveRoomSession(roomId)).unwrap();
    } catch {
      dispatch(resetRoomState());
    } finally {
      dispatch(setParticipants([]));
      navigate("/dashboard");
    }
  }

  function admitRequest(participantId) {
    dispatch(admitParticipant({ roomId, participantId }));
  }

  function denyRequest(participantId) {
    dispatch(denyParticipant({ roomId, participantId }));
  }

  if (room.admissionRequired) {
    return (
      <WaitingForAdmission
        title={room.title}
        roomCode={roomId}
        status={room.connection}
        error={room.error}
        checking={checkingAdmission}
        onCheck={checkAdmission}
        onLeave={leaveWaitingRoom}
      />
    );
  }

  const screenPresenter = participants.find((participant) => {
    return participant.screenSharing;
  });
  const isLocalPresenter = screenPresenter?.id === me?.id;
  const showScreenStage = Boolean(
    screenPresenter && (!isLocalPresenter || shareView === "screen"),
  );
  const activeScreenStream = isLocalPresenter
    ? screenStream
    : remoteStreams[screenPresenter?.id]?.screen;

  async function ensureLocalStream(constraints) {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("Media devices are not available in this browser");
    }

    const existingStream = localStreamRef.current;
    const needsAudio =
      constraints.audio &&
      !existingStream
        ?.getAudioTracks()
        .some((track) => track.readyState === "live");
    const needsVideo =
      constraints.video &&
      !existingStream
        ?.getVideoTracks()
        .some((track) => track.readyState === "live");

    if (!needsAudio && !needsVideo) {
      return existingStream;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: Boolean(needsAudio),
      video: Boolean(needsVideo),
    });

    if (!localStreamRef.current) {
      localStreamRef.current = stream;
      setLocalStream(stream);
      return stream;
    }

    stream.getTracks().forEach((track) => {
      localStreamRef.current.addTrack(track);
    });
    setLocalStream(localStreamRef.current);

    return localStreamRef.current;
  }

  function stopLocalTracks(kind) {
    const stream = localStreamRef.current;
    if (!stream) return;

    const tracks =
      kind === "audio" ? stream.getAudioTracks() : stream.getVideoTracks();

    tracks.forEach((track) => {
      track.stop();
      stream.removeTrack(track);
    });

    if (!stream.getTracks().length) {
      localStreamRef.current = null;
      setLocalStream(null);
      return;
    }

    setLocalStream(stream);
  }

  function emitMedia(eventName, payload, onSuccess) {
    const socket = connectSocket();

    if (!socket) return;

    socket.emit(eventName, { roomId, ...payload }, (response) => {
      if (response?.success === false) return;

      if (response?.participant) {
        dispatch(updateParticipantMedia(response.participant));
      }

      onSuccess?.(response);
    });
  }

  async function toggleMic() {
    const nextMicState = !mic;

    try {
      if (nextMicState) {
        await ensureLocalStream({ audio: true });
      } else {
        stopLocalTracks("audio");
      }

      emitMedia(socketEvents.MEDIA_MIC_TOGGLE, { micOn: nextMicState }, () => {
        setMic(nextMicState);
        renegotiatePeers("camera");
      });
    } catch {
      emitMedia(socketEvents.MEDIA_MIC_TOGGLE, { micOn: false }, () =>
        setMic(false),
      );
    }
  }

  async function toggleCamera() {
    const nextCameraState = !cam;

    try {
      if (nextCameraState) {
        await ensureLocalStream({ video: true });
      } else {
        stopLocalTracks("video");
      }

      emitMedia(
        socketEvents.MEDIA_CAMERA_TOGGLE,
        { cameraOn: nextCameraState },
        () => {
          setCam(nextCameraState);
          renegotiatePeers("camera");
        },
      );
    } catch {
      emitMedia(socketEvents.MEDIA_CAMERA_TOGGLE, { cameraOn: false }, () =>
        setCam(false),
      );
    }
  }

  async function toggleScreenShare() {
    const nextScreenState = !screen;

    if (nextScreenState && !navigator.mediaDevices?.getDisplayMedia) {
      return;
    }

    if (!nextScreenState) {
      screenStreamRef.current?.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
      setScreenStream(null);
      closeScreenPeers();
      emitMedia(socketEvents.MEDIA_SCREEN_SHARE_STOP, {}, () =>
        setScreen(false),
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      screenStreamRef.current = stream;
      setScreenStream(stream);

      stream.getVideoTracks().forEach((track) => {
        track.addEventListener("ended", () => {
          screenStreamRef.current = null;
          setScreenStream(null);
          emitMedia(socketEvents.MEDIA_SCREEN_SHARE_STOP, {}, () =>
            setScreen(false),
          );
        });
      });

      emitMedia(socketEvents.MEDIA_SCREEN_SHARE_START, {}, () => {
        setScreen(true);
        setShareView("editor");
        startScreenPeers();
      });
    } catch {
      setScreenStream(null);
      closeScreenPeers();
      emitMedia(socketEvents.MEDIA_SCREEN_SHARE_STOP, {}, () =>
        setScreen(false),
      );
    }
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <TopBar
        title={room.title}
        elapsed={elapsed}
        status={room.connection}
        error={room.error}
        onLeave={leave}
      />
      <div className="flex min-h-0 flex-1 gap-3 p-3">
        <section
          className={cn(
            "flex min-w-0 flex-1 flex-col",
            ui.fullscreenEditor && "w-full",
          )}
        >
          {showScreenStage ? (
            <ScreenShareStage
              presenter={screenPresenter}
              stream={activeScreenStream}
              isLocal={isLocalPresenter}
              onShowEditor={() => setShareView("editor")}
            />
          ) : (
            <div className="flex h-full min-h-0 flex-col gap-2">
              {isLocalPresenter && (
                <SharingEditorBar onShowScreen={() => setShareView("screen")} />
              )}
              <CodeEditor roomId={roomId} />
            </div>
          )}
        </section>

        <AnimatePresence initial={false}>
          {!ui.fullscreenEditor && (ui.participantsOpen || ui.chatOpen) && (
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="fixed inset-x-3 bottom-20 top-20 z-20 flex w-auto flex-col gap-3 overflow-hidden lg:static lg:inset-auto lg:w-[340px] lg:overflow-visible"
            >
              {ui.participantsOpen && (
                <div className="flex flex-col gap-3">
                  {isHost && (
                    <HostControls
                      roomCode={roomId}
                      status={room.current?.status}
                      pendingRequests={pendingRequests}
                      onCopy={copyRoomLink}
                      onEnd={endInterview}
                      onAdmit={admitRequest}
                      onDeny={denyRequest}
                    />
                  )}
                  <div className="glass rounded-xl p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-sm font-semibold">Participants</h3>
                      <span className="text-xs text-muted-foreground">
                        {
                          participants.filter((participant) => {
                            return participant.status !== "pending";
                          }).length
                        }
                      </span>
                    </div>
                    <VideoGrid
                      localUserId={me?.id}
                      localStream={localStream}
                      remoteStreams={remoteStreams}
                    />
                  </div>
                </div>
              )}
              {ui.chatOpen && (
                <div className="glass min-h-0 flex-1 overflow-hidden rounded-xl">
                  <ChatPanel roomId={roomId} />
                </div>
              )}
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      <BottomBar
        mic={mic}
        cam={cam}
        screen={screen}
        onMic={toggleMic}
        onCam={toggleCamera}
        onScreen={toggleScreenShare}
        onChat={() => dispatch(setChatOpen(!ui.chatOpen))}
        chatUnread={chatUnread}
        onPeople={() => dispatch(setParticipantsOpen(!ui.participantsOpen))}
        onLeave={leave}
      />
    </div>
  );
}

function WaitingForAdmission({
  title,
  roomCode,
  status,
  error,
  checking,
  onCheck,
  onLeave,
}) {
  return (
    <div className="flex h-screen flex-col bg-background">
      <TopBar
        title={title}
        elapsed="00:00"
        status={status}
        error={error || "Waiting for host admission"}
        onLeave={onLeave}
      />
      <main className="grid min-h-0 flex-1 place-items-center px-4">
        <div className="glass w-full max-w-md rounded-xl p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck size={20} />
            </span>
            <div>
              <h1 className="text-base font-semibold">Admission requested</h1>
              <p className="text-sm text-muted-foreground">
                The room host needs to admit you before the interview opens.
              </p>
            </div>
          </div>
          <div className="mb-4 rounded-lg border border-border/70 bg-background/40 px-3 py-2 text-xs text-muted-foreground">
            Room {roomCode}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onCheck}
              disabled={checking}
            >
              <RefreshCw size={14} className={checking ? "animate-spin" : ""} />
              Check status
            </Button>
            <Button size="sm" variant="danger" onClick={onLeave}>
              <PhoneOff size={14} />
              Leave
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function SharingEditorBar({ onShowScreen }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-primary/25 bg-primary/10 px-3 py-2 text-xs">
      <span className="inline-flex items-center gap-2 text-primary">
        <ScreenShare size={14} />
        Your screen is visible to the interviewer
      </span>
      <Button size="sm" variant="outline" onClick={onShowScreen}>
        Preview share
      </Button>
    </div>
  );
}

function ScreenShareStage({ presenter, stream, isLocal, onShowEditor }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    video.srcObject = stream || null;

    return () => {
      video.srcObject = null;
    };
  }, [stream]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-black">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-sm text-white">
        <span className="inline-flex items-center gap-2">
          <ScreenShare size={16} />
          {isLocal
            ? "You are sharing your screen"
            : `${presenter.name} is sharing`}
        </span>
        {isLocal && (
          <Button size="sm" variant="outline" onClick={onShowEditor}>
            Code editor
          </Button>
        )}
      </div>
      <div className="grid min-h-0 flex-1 place-items-center bg-black">
        {stream ? (
          <video
            ref={videoRef}
            autoPlay
            muted={isLocal}
            playsInline
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="text-sm text-white/70">
            Connecting screen share...
          </div>
        )}
      </div>
    </div>
  );
}

function HostControls({
  roomCode,
  status,
  pendingRequests,
  onCopy,
  onEnd,
  onAdmit,
  onDeny,
}) {
  const isEnded = status === "ended" || status === "archived";

  return (
    <div className="glass rounded-xl p-3">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="inline-flex items-center gap-2 text-sm font-semibold">
          <ShieldCheck size={15} />
          Host controls
        </h3>
        <span className="rounded-md bg-secondary px-2 py-1 text-[11px] text-muted-foreground">
          {status || "active"}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={onCopy}>
          <Copy size={14} />
          Copy link
        </Button>
        <Button size="sm" variant="danger" onClick={onEnd} disabled={isEnded}>
          <PhoneOff size={14} />
          End interview
        </Button>
      </div>
      <div className="mt-3 rounded-xl border border-border/70 bg-background/40 px-3 py-2 text-xs text-muted-foreground">
        Room {roomCode}
      </div>
      {pendingRequests.length > 0 && (
        <div className="mt-3 space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground">
            Waiting for admission
          </h4>
          {pendingRequests.map((participant) => (
            <div
              key={participant.id}
              className="rounded-lg border border-border/70 bg-background/40 p-2"
            >
              <div className="mb-2 min-w-0">
                <div className="truncate text-sm font-medium">
                  {participant.name}
                </div>
                <div className="text-xs capitalize text-muted-foreground">
                  {participant.role}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onAdmit(participant.id)}
                >
                  <UserCheck size={14} />
                  Admit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDeny(participant.id)}
                >
                  <UserX size={14} />
                  Deny
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TopBar({ title, elapsed, status, error, onLeave }) {
  const dot =
    status === "connected"
      ? "bg-success"
      : status === "connecting" || status === "waiting"
        ? "bg-warning animate-pulse"
        : "bg-destructive";
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <span className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-sm font-bold">
          P
        </span>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{title}</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />{" "}
            {error || status}
            <span>·</span>
            <Wifi size={12} /> stable
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="rounded-md border border-border bg-secondary px-3 py-1.5 font-mono text-sm tabular-nums">
          {elapsed}
        </span>
        <Button variant="danger" size="sm" onClick={onLeave}>
          <PhoneOff size={14} /> Leave
        </Button>
      </div>
    </header>
  );
}

function BottomBar(props) {
  return (
    <div className="border-t border-border/60 p-3">
      <div className="glass mx-auto flex w-fit items-center gap-1.5 rounded-xl p-1.5">
        <Ctrl
          on={props.mic}
          onClick={props.onMic}
          OnIcon={Mic}
          OffIcon={MicOff}
          label="Mic"
        />
        <Ctrl
          on={props.cam}
          onClick={props.onCam}
          OnIcon={Video}
          OffIcon={VideoOff}
          label="Camera"
        />
        <Ctrl
          on={props.screen}
          onClick={props.onScreen}
          OnIcon={ScreenShare}
          OffIcon={ScreenShare}
          label="Share"
          tone={props.screen ? "primary" : "ghost"}
        />
        <span className="mx-1 h-6 w-px bg-border" />
        <button
          onClick={props.onPeople}
          className="grid h-10 w-10 place-items-center rounded-lg hover:bg-secondary"
          aria-label="People"
        >
          <Users size={18} />
        </button>
        <button
          onClick={props.onChat}
          className="relative grid h-10 w-10 place-items-center rounded-lg hover:bg-secondary"
          aria-label="Chat"
        >
          <MessageSquare size={18} />
          {props.chatUnread > 0 && (
            <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
              {props.chatUnread > 9 ? "9+" : props.chatUnread}
            </span>
          )}
        </button>
        <span className="mx-1 h-6 w-px bg-border" />
        <button
          onClick={props.onLeave}
          className="grid h-10 w-10 place-items-center rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90"
          aria-label="Leave"
        >
          <PhoneOff size={18} />
        </button>
      </div>
    </div>
  );
}

function Ctrl({ on, onClick, OnIcon, OffIcon, label, tone = "default" }) {
  const Icon = on ? OnIcon : OffIcon;
  const cls = !on
    ? "bg-destructive/15 text-destructive"
    : tone === "primary"
      ? "bg-primary/20 text-primary"
      : "hover:bg-secondary";
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "grid h-10 w-10 place-items-center rounded-lg transition-colors",
        cls,
      )}
    >
      <Icon size={18} />
    </button>
  );
}
