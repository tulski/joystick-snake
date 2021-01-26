const {Board, Joystick} = require('johnny-five')
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

const config = require("./config");

const board = new Board();

app.disable('x-powered-by')
app.get("/", (req, res) => res.sendFile(path.resolve(__dirname,"../static/index.html")))

const start = async () => {
    try {
        board.on("ready", () => {
            const joystick = new Joystick({
                //   [ x, y ]
                pins: ["A0", "A1"]
            });
            io.on('connection', (socket) => {
                joystick.on("change", function () {
                    if (this.x <= -0.9 && !(this.x > 0)) socket.emit('left');
                    if (this.x >= 0.9 && !(this.x < 0)) socket.emit('right');
                    if (this.y <= -0.9 && !(this.y > 0)) socket.emit('up');
                    if (this.y >= 0.9 && !(this.y < 0)) socket.emit('down');
                });
            })
            http.listen(config.port, () => {
                console.log(`app listening at http://localhost:${config.port}`)
            })
        })
    } catch (e) {
        console.error(e)
    }
}

module.exports = {
    start
}
