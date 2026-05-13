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
} from "lucide-react";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { VideoGrid } from "@/components/video/VideoGrid";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { Button } from "@/components/common/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { joinRoom, leaveRoomSession } from "@/features/room/roomSlice";
import {
  setParticipants,
  updateParticipantMedia,
} from "@/features/participants/participantsSlice";
import { incUnread, markRead, receiveMessage } from "@/features/chat/chatSlice";
import { setChatOpen, setParticipantsOpen } from "@/features/ui/uiSlice";
import { useElapsed } from "@/hooks/useElapsed";
import { cn } from "@/lib/cn";
import { connectSocket, socketEvents } from "@/lib/socket";

function mapParticipants(participants) {
  return (participants || []).map((participant, index) => ({
    id: participant.id,
    name: participant.name,
    role: participant.role,
    muted: participant.media?.micOn !== true,
    cameraOn: participant.media?.cameraOn === true,
    screenSharing: Boolean(participant.media?.screenSharing),
    quality: participant.status === "active" ? "good" : "ok",
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
  const [localStream, setLocalStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const micRef = useRef(mic);
  const camRef = useRef(cam);

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
    if (roomParticipants) {
      dispatch(setParticipants(mapParticipants(roomParticipants)));
    }
  }, [dispatch, roomParticipants]);

  useEffect(() => {
    const socket = connectSocket();

    if (!socket || !roomId) return undefined;

    const joinRealtimeRoom = () => {
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
      if (!ui.chatOpen) {
        dispatch(incUnread());
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
      }
    };
    const handleParticipants = (payload) => {
      if (!payload?.participants) return;

      dispatch(
        setParticipants(
          payload.participants.map((participant, index) => ({
            id: participant.userId,
            name: participant.name,
            role: participant.role,
            muted: participant.media?.micOn === false,
            cameraOn: participant.media?.cameraOn !== false,
            speaking: Boolean(participant.media?.speaking),
            screenSharing: Boolean(participant.media?.screenSharing),
            quality: "good",
            color: ["#7c3aed", "#06b6d4", "#ec4899", "#22c55e"][index % 4],
          })),
        ),
      );
    };

    socket.on("connect", joinRealtimeRoom);
    socket.on(socketEvents.CHAT_MESSAGE_CREATED, handleMessage);
    socket.on(socketEvents.NOTIFICATION_NEW, handleNotification);
    socket.on(socketEvents.ROOM_STATE, handleParticipants);
    socket.on(socketEvents.PARTICIPANTS_STATE, handleParticipants);
    socket.on(socketEvents.PARTICIPANT_MEDIA_CHANGED, handleMedia);
    socket.on(socketEvents.MEDIA_SCREEN_SHARE_CHANGED, handleMedia);

    if (socket.connected) {
      joinRealtimeRoom();
    }

    return () => {
      socket.off("connect", joinRealtimeRoom);
      socket.off(socketEvents.CHAT_MESSAGE_CREATED, handleMessage);
      socket.off(socketEvents.NOTIFICATION_NEW, handleNotification);
      socket.off(socketEvents.ROOM_STATE, handleParticipants);
      socket.off(socketEvents.PARTICIPANTS_STATE, handleParticipants);
      socket.off(socketEvents.PARTICIPANT_MEDIA_CHANGED, handleMedia);
      socket.off(socketEvents.MEDIA_SCREEN_SHARE_CHANGED, handleMedia);
    };
  }, [dispatch, me?.id, roomId, ui.chatOpen]);

  useEffect(() => {
    if (!ui.chatOpen || !roomId) return;

    dispatch(markRead());
    const socket = connectSocket();
    socket?.emit(socketEvents.CHAT_READ, { roomId });
  }, [dispatch, roomId, ui.chatOpen]);

  useEffect(() => {
    return () => {
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      screenStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  async function leave() {
    try {
      await dispatch(leaveRoomSession(roomId)).unwrap();
      navigate("/dashboard");
    } catch {
      // Error is rendered from Redux state.
    }
  }

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

      emitMedia(socketEvents.MEDIA_MIC_TOGGLE, { micOn: nextMicState }, () =>
        setMic(nextMicState),
      );
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
        () => setCam(nextCameraState),
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

      emitMedia(socketEvents.MEDIA_SCREEN_SHARE_START, {}, () =>
        setScreen(true),
      );
    } catch {
      setScreenStream(null);
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
          <CodeEditor roomId={roomId} />
        </section>

        <AnimatePresence initial={false}>
          {!ui.fullscreenEditor && (ui.participantsOpen || ui.chatOpen) && (
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="hidden w-[340px] flex-col gap-3 lg:flex"
            >
              {ui.participantsOpen && (
                <div className="glass rounded-2xl p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Participants</h3>
                    <span className="text-xs text-muted-foreground">
                      {participants.length}
                    </span>
                  </div>
                  <VideoGrid
                    localUserId={me?.id}
                    localStream={localStream}
                    screenStream={screenStream}
                  />
                </div>
              )}
              {ui.chatOpen && (
                <div className="glass min-h-0 flex-1 overflow-hidden rounded-2xl">
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

function TopBar({ title, elapsed, status, error, onLeave }) {
  const dot =
    status === "connected"
      ? "bg-success"
      : status === "connecting"
        ? "bg-warning animate-pulse"
        : "bg-destructive";
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-sm font-bold">
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
        <span className="rounded-lg bg-secondary px-3 py-1.5 font-mono text-sm tabular-nums">
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
      <div className="glass mx-auto flex w-fit items-center gap-2 rounded-2xl p-2">
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
          className="grid h-11 w-11 place-items-center rounded-xl hover:bg-secondary"
          aria-label="People"
        >
          <Users size={18} />
        </button>
        <button
          onClick={props.onChat}
          className="relative grid h-11 w-11 place-items-center rounded-xl hover:bg-secondary"
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
          className="grid h-11 w-11 place-items-center rounded-xl bg-destructive text-destructive-foreground hover:brightness-110"
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
        "grid h-11 w-11 place-items-center rounded-xl transition",
        cls,
      )}
    >
      <Icon size={18} />
    </button>
  );
}
