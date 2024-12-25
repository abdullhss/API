import userModel from "../../../DB/model/User.model.js";
import * as socketService from "../real-time/chat.service.js";
import { getUserById, addChat } from "../user/user.controller.js";

function configSocket(io) {
  io.on("connection", (socket) => {
    console.log("connected");
    console.log(socket.id);

    socket.on("updateSocketId", async (token) => {
      try {
        console.log("updatedSocketID");

        const user = await socketService.checkToken(token);
        console.log("updatedSocketID: ", user.name);

        await socketService.setNewSocketId(user._id, socket.id);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("addMessage", async (data) => {
      try {
        console.log("addMsg");
        const user = await socketService.checkToken(data.token);

        // console.log("addMsg: ", user.name, " data: ", data);

        const userReciver = await getUserById(data.to);

        await socketService.addMsg(user, data);

        io.to([userReciver.socketId, user.socketId]).emit("newMessage", {
          from: user._id,
          to: data.to,
          message: data.message,
        });
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("getMessages", async (data) => {
      try {
        console.log("getMessages");
        console.log(data);
        const user = await socketService.checkToken(data.token);

        const msgs = await socketService.getAllMsgs(user._id, data.id);
        console.log("getMessages: ", user.name);
        console.log("getMessages: ", msgs);

        const user2 = await userModel.findById(data.id);

        // console.log(msgs);
        // const res = {
        //   name: user2.name,
        //   toId: data.to,
        //   messages: msgs.map((ele) => {
        //     if (user._id.toString() == ele.from.toString()) {
        //       return {
        //         senderId: ele.from._id,
        //         sender: "Me",
        //         content: ele.content,
        //       };
        //     } else {
        //       return {
        //         senderId: ele.to._id,
        //         sender: ele.to.name,
        //         content: ele.content,
        //       };
        //     }
        //   }),
        // };

        // console.log(msgs);

        // console.log("getmessages: ", msgs);

        // const chats = [
        //   {
        //     name: "User 1",
        //     toId: "675e06db0c8ac258e24cf86a",
        //     messages: [
        //       { sender: "User 1", content: "Good morning Youssef." },
        //       { sender: "Me", content: "Don't worry about it." },
        //       { sender: "User 1", content: "Thank you." },
        //       { sender: "Me", content: "Good Luck." },
        //     ],
        //   },
        // ];
        socket.emit("retrieveMessages", msgs);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("getChats", async (token) => {
      console.log("get chats");

      const user = await socketService.checkToken(token);

      const chats = user.chats.map((ele) => {
        return {
          name: ele.name,
          id: ele._id,
          messages: [],
        };
      });

      socket.emit("retrieveChats", chats);
    });

    socket.on("addChat", async (data) => {
      console.log("addchat");

      const user = await socketService.checkToken(data.token);

      addChat(user._id, data.id);
    });
  });
}

export default configSocket;
