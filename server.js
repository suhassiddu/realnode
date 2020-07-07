const express = require("express");
const _ = require('lodash');
const socket = require("socket.io");

const { calculateDistance, isexist } = require('./utils')

const CONNECTION = 'connection'
const NEW_USER = 'new user'
const EMIT_NEW_USER = 'new user'
const DISCONNECT = 'disconnect'
const EMIT_DISCONNECT = 'user disconnected'
const MESSAGE = 'chat message'
const EMIT_MESSAGE = 'chat message'
const TYPING = 'typing'
const EMIT_TYPING = 'typing'

// App setup
const PORT = 5000;
const app = express();
const server = app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});

// Static files
app.use(express.static("public"));

// Socket setup
const io = socket(server);

let activeUsers = [];

io.on(CONNECTION, function (socket) {
    console.log("Made socket connection");

    socket.on(NEW_USER, function (data) {
        socket.userId = data;
        activeUsers.push({ userId: data, data: {} });
        io.emit(EMIT_NEW_USER, _.map(activeUsers, e => e.userId));
    });

    socket.on(DISCONNECT, () => {
        _.remove(activeUsers, e => e.userId === socket.userId);
        io.emit(EMIT_DISCONNECT, socket.userId);
    });

    socket.on(MESSAGE, function (payload) {
        // console.log({ data })
        let user = _.find(activeUsers, e => e.userId == socket.userId)
        let distance = null;
        console.log(socket.userId)
        console.log({ user })
        if (user !== undefined) {
            let old_data = user.data
            let new_data = payload.message
            distance = calculateDistance(old_data.latitude, old_data.longitude, new_data.latitude, new_data.longitude)
        }
        activeUsers = _.map(activeUsers, e => e.userId === socket.userId ? { userId: socket.userId, data: payload.message } : e)
        console.log({ activeUsers })
        io.emit(EMIT_MESSAGE, { ...payload, distance });
    });

    /*socket.on(TYPING, function (data) {
        socket.broadcast.emit(EMIT_TYPING, data);
    });*/
});