const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server);

let users = {};
let numberOfUsers = 0;

io.on("connection", (socket) => {
    socket.on("new-user", (name) => {
        users[socket.id] = name;
        numberOfUsers++;

        if (numberOfUsers < 2) {
            socket.emit("wait");
        } else {
            io.sockets.emit("start", users);
        }
    });
});

app.use(express.static("public"));
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});