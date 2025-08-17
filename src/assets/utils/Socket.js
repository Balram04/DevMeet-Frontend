import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const socketConnection =()=>{
    return io(SOCKET_URL, {
        transports: ['websocket'],
        withCredentials: true,
        autoConnect: true
    });
};