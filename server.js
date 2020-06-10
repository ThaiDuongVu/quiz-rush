const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server);

io.on("connection", () => {

});

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});