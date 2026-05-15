import { useAppSelector } from "@/store/hooks";
import { ParticipantTile } from "./ParticipantTile";

export function VideoGrid({ localUserId, localStream, remoteStreams }) {
  const list = useAppSelector((s) => s.participants.list);

  return (
    <div className="grid grid-cols-2 gap-2">
      {list.map((p) => {
        const isLocal = p.id === localUserId;

        return (
          <ParticipantTile
            key={p.id}
            p={p}
            isLocal={isLocal}
            stream={isLocal ? localStream : remoteStreams[p.id]?.camera}
          />
        );
      })}
    </div>
  );
}
