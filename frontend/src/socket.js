import { io } from 'socket.io-client';

let token = null;

const auth = localStorage.getItem('auth');
if (auth) {
    try {
        const parsedAuth = JSON.parse(auth);
        token = parsedAuth.token;
    } catch (error) {
        console.error('Failed to parse auth token:', error);
    }
}

const socket = io('http://localhost:3000', {
    auth: {
        token: token || '',
    },
});

export default socket;
