import { useEffect } from "react";
import socket from "../api/socket";

export function useSocket(events = {}) {
  useEffect(() => {
    socket.connect();
    Object.entries(events).forEach(([evt, cb]) => socket.on(evt, cb));
    return () => {
      Object.keys(events).forEach((evt) => socket.off(evt));
      socket.disconnect();
    };
  }, []);
}