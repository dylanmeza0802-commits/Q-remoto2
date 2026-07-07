import { useSocket } from "./useSocket";
import { useQueueStore } from "../store/queueStore";
import socket from "../api/socket";

export function useQueue(queueId) {
  const { setActiveQueue, updateQueue, setDelay, clearDelay } = useQueueStore();

  useSocket({
    "queue:state":     setActiveQueue,
    "queue:update":    updateQueue,
    "delay:announced": ({ reason }) => setDelay(reason),
    "delay:cleared":   () => clearDelay(),
    "turn:called":     (turn) => console.log("Turno llamado:", turn),
    "turn:cancelled":  ({ turnId }) => console.log("Cancelado:", turnId),
  });

  const subscribe = () => {
    if (queueId) socket.emit("queue:subscribe", queueId);
  };

  return { subscribe };
}