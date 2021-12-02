const express = require("express");
let app = express();
let path = require("path");
let {Server: HttpServer} = require("http");
let Socket = require("./utils/sockets");
const { profile } = require("console");
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
let socket = new Socket(httpServer);
socket.init();



httpServer.listen(PORT, ()=>{
    console.log("Server on!");
})
