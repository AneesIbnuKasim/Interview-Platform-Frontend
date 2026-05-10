import { useAppSelector } from "@/store/hooks";
import { ParticipantTile } from "./ParticipantTile";

export function VideoGrid() {
  const list = useAppSelector(s => s.participants.list);
  return (
    <div className="grid grid-cols-2 gap-2">
      {list.map(p => <ParticipantTile key={p.id} p={p} />)}
    </div>
  );
}
