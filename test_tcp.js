import net from 'net';

const hostname = 'ac-oz5blm0-shard-00-00.fyy2wom.mongodb.net';
const port = 27017;

console.log(`Testing TCP connection to ${hostname}:${port}...`);

const socket = new net.Socket();

socket.setTimeout(5000);

socket.on('connect', () => {
    console.log('TCP Connection established successfully!');
    socket.destroy();
});

socket.on('timeout', () => {
    console.log('TCP Connection timed out');
    socket.destroy();
});

socket.on('error', (err) => {
    console.log('TCP Connection error:', err.message);
});

socket.connect(port, hostname);
