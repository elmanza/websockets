let {Server: SocketIO} = require("socket.io");

class Socket {
    static instancia;
    constructor(http){
        if(Socket.instancia){
            return Socket.instancia;
        }
        Socket.instancia = this;
        this.io = new SocketIO(http);
        this.mensajes = [];
        this.usuarios = [];
    }

    init(){
        try {
            this.io.on('connection', socket =>{
                console.log("Usuario conectado!");

                socket.emit("init", this.mensajes);

                socket.on("mensaje", data =>{
                    this.mensajes.push(data);
                    this.io.sockets.emit('listenserver', this.mensajes);
                });
                
                socket.on("addUser", data =>{
                    if(this.usuarios.length > 0){
                        let verifivation_user = false;
                        this.usuarios = this.usuarios.map(usuario =>{
                            if(usuario.email == data.email){
                                verifivation_user = true;
                                return {
                                    id: socket.id,
                                    ...data,
                                    active: true
                                };
                            }else{
                                return usuario;
                            }
                        });
                        if(!verifivation_user){
                            this.usuarios.push({
                                id : socket.id,
                                ...data,
                                active:true
                            });
                        }

                    }else{
                        this.usuarios.push({
                            id : socket.id,
                            ...data,
                            active:true
                        });
                    }                    
                    this.io.sockets.emit('loadUsers', this.usuarios);
                });

                socket.on("disconnect", data =>{
                    this.usuarios = this.usuarios.map(usuario =>{
                        if(usuario.id == socket.id){
                            delete usuario.active;
                            return {
                                ...usuario,
                                active: false
                            };
                        }else{
                            return usuario;
                        }
                    });
                    console.log("Alguien se desconectó", socket.id);
                    this.io.sockets.emit('loadUsers', this.usuarios);
                    // ...
                });
            });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = Socket;