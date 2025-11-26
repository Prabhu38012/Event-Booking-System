import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import io from 'socket.io-client';
import { updateEventSeats } from '../store/slices/eventSlice';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const useSocket = () => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true
    });

    socketRef.current.on('connect', () => {
      console.log('✅ Socket connected');
    });

    socketRef.current.on('seats:updated', ({ eventId, availableSeats }) => {
      dispatch(updateEventSeats({ eventId, availableSeats }));
    });

    socketRef.current.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [dispatch]);

  return socketRef.current;
};
