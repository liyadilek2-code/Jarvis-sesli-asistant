/**
 * JarvisContext - Global State Management
 */

import React, { createContext, useEffect, useState } from 'react';
import { SocketService } from '../services/SocketService';

export const JarvisContext = createContext();

export const JarvisProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState({
    isRunning: false,
    isListening: false,
    connectedDevices: 0,
  });
  const [statistics, setStatistics] = useState({
    totalCommands: 0,
    successfulCommands: 0,
    failedCommands: 0,
  });

  useEffect(() => {
    // Socket bağlantısını kur
    const connectedSocket = SocketService.connect();
    setSocket(connectedSocket);

    // Socket events
    connectedSocket.on('JARVIS_LISTENING', () => {
      setStatus((prev) => ({ ...prev, isListening: true }));
    });

    connectedSocket.on('JARVIS_STOPPED_LISTENING', () => {
      setStatus((prev) => ({ ...prev, isListening: false }));
    });

    return () => {
      SocketService.disconnect();
    };
  }, []);

  return (
    <JarvisContext.Provider value={{ socket, status, statistics, setStatus, setStatistics }}>
      {children}
    </JarvisContext.Provider>
  );
};
