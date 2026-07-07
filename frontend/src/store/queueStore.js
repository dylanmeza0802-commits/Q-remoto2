import { create } from "zustand";

export const useQueueStore = create((set) => ({
  queues:      [],
  activeQueue: null,
  myTurn:      null,
  isDelayed:   false,
  delayReason: "",

  setQueues:      (queues)  => set({ queues }),
  setActiveQueue: (queue)   => set({ activeQueue: queue }),
  setMyTurn:      (turn)    => set({ myTurn: turn }),
  clearMyTurn:    ()        => set({ myTurn: null }),
  setDelay:       (reason)  => set({ isDelayed: true, delayReason: reason }),
  clearDelay:     ()        => set({ isDelayed: false, delayReason: "" }),
  updateQueue:    (updated) =>
    set((state) => ({
      activeQueue:
        state.activeQueue?.id === updated.id ? updated : state.activeQueue,
    })),
}));