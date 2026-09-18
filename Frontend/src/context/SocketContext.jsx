import { createContext, useCallback, useEffect } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

const socket = io(import.meta.env.VITE_BASE_URL);

const SocketProvider = ({ children }) => {
  useEffect(() => {
    const handleConnect = () => {
      console.log("connect to server ");
    };
    const handleDisconnect = () => {
      console.log("Disconnect from server ");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  const sendMessage = useCallback((eventName, message) => {
    // console.log(`Sending message to server: ${eventName}`, message);
    socket.emit(eventName, message);
  }, []);

  const receiveMessage = (eventName, callback) => {
    socket.on(eventName, callback);

    return () => socket.off(eventName, callback);
  };

  return (
    <SocketContext.Provider value={{ sendMessage, receiveMessage }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;

