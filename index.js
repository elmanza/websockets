const express = require("express");
let app = express();
let path = require("path");
let {Server: HttpServer} = require("http");
let {Server: SocketIO} = require("socket.io");
const { Module } = require("module");
const PORT = 3000;

// Settings 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res, next)=>{
    res.render("index", {});
})

let mensajes = [];



let httpServer = new HttpServer(app);
let socketIOServer = new SocketIO(httpServer);

let backuoInfo = "";

socketIOServer.on('connection', socket =>{
    socket.on("fillP", data =>{
        let res = {
            id : socket.id,
            mensaje: data
        }
        mensajes.push(res);
        socketIOServer.sockets.emit('listenserver', mensajes);
    });
    socket.emit("init", mensajes);
    console.log(`Nuevo usuario conectado ${socket.id}`);
})

httpServer.listen(PORT, ()=>{
    console.log("Server on!");
})