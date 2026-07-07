import { io } from "socket.io-client";

const socket = io(
  (import.meta.env.VITE_API_URL || "http://localhost:4000/v1").replace("/v1", ""),
  { autoConnect: false, withCredentials: true }
);

export default socket;