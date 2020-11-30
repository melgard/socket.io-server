import express from 'express';
import {Socket} from 'socket.io';
import {json, urlencoded} from "body-parser";
import { v4 as uuidv4 } from 'uuid';

const notifications: Array<any> = [];

const app = express();
const port = 80;

app.use(urlencoded({ extended: false }));
app.use(json());

// Send Notification API
app.post('/send-notification', (req, res) => {
  const id = uuidv4();
  const notification = {...req.body, read: false, id};
  notifications.push(notification)
  io.emit('notification', {data: notification}); // Updates Live Notification
  return res.send('Mensaje enviado' + JSON.stringify(notification.id)).end();
});

const server = app.listen(port, () => {
  console.log(`Server connection on  http://localhost:${port}`);  // Server Connnected
});
// Socket Layer over Http Server
const io = require('socket.io')();

io.attach(server, {
  cors: {
    origin: '*',
  }
});
// cada conexión
io.on('connection', (socket: Socket) => {
  io.emit('notifications', {data: notifications});

  // marcar como leída
  socket.on('event:mark-as-read', (data: any) => {
    const noti = notifications.find(n => n.id === data);
    if (!noti) {
      return;
    }
    noti.read = true;
  })

  console.log('Nuevo cliente conectado');


});



