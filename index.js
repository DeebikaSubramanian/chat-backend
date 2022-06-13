const express=require("express")
const cors=require("cors")
const mongoose=require("mongoose");
const UserRoutes=require("./routes/UserRoutes");
const socket=require("socket.io")
const messageRoute=require("./routes/MessageRoutes")
const app=express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", UserRoutes);
app.use("/api/messages",messageRoute)


mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
.then(()=>{console.log("Database connected")})
.catch((error)=>{console.log(error);})


const server=app.listen(process.env.PORT,()=>{
    console.log(`Server running on Port ${process.env.PORT}`);

    const io = socket(server, {
      cors: {
        origin: "*",
        credentials: true,
      },
    });
    
    global.onlineUsers = new Map();
    io.on("connection", (socket) => {
      global.chatSocket = socket;
      socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
      });
    
      socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
          socket.to(sendUserSocket).emit("msg-recieve", data.message);
        }
      });
    });
})
