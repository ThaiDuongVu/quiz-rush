const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server);

let users = {};
let userNames = [];

io.on("connection", (socket) => {
    socket.on("new-user", (name) => {
        users[socket.id] = name;
        userNames.push(name);

        if (userNames.length != 2) {
            socket.emit("wait");
        } else {
            io.sockets.emit("start", userNames);
        }
        
    });

    socket.on("question-answered", () => {
        io.sockets.emit("next-question");
    });

    socket.on("end-quiz", (score) => {
        socket.broadcast.emit("compare-score", score);
    });

    socket.on("disconnect", () => {
        socket.broadcast.emit("user-disconnect", users[socket.id]);

        delete users[socket.id];
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