const express = require('express');
const http = require("http");
const { Server } = require("socket.io");
const PORT = process.env.PORT || 3000;
const app = express();

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
  next(); 
})


const server = app.listen(PORT, () => {
    console.log(`server started on port:' ${PORT}`);
});


app.get('/', (req, res) => {
    res.write(`<h1>Your Ports is ${PORT}</h1>`);
    res.end();
})

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});


io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
    // socket.disconnect()
    socket.on("join_room", (data) => {
      socket.join(data);
      console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });
  
    socket.on("send_message", (data) => {
      console.log(data)
      socket.to(data.room).emit("receive_message", data);
    });
  
  
    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
  });

