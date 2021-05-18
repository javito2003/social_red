const { notificationCreate } = require("../utils/notification");

module.exports = function (io) {
  let users = {};
  io.on("connection", (socket) => {
    console.log("new connection");
    socket.on("new-user", (data) => {
      socket.userId = data._id;
      socket.userData = data;
      users[socket.userId] = socket;
      console.log(users);
      updateUsers(users);
    });
    socket.on("follow", async (data) => {
      console.log(data);
      if (data._id in users) {
        let description = `${socket.userData.name} is now following you`;
        const createNotif = await notificationCreate(
          socket.userData._id,
          data._id,
          description
        );
        if (createNotif) {
          users[data._id].emit("followyou", {
            message: description,
            user: socket.userData.name,
          });
          return;
        }
      }
    });
    socket.on("update", (data) => {
      console.log(data);
      io.sockets.emit("updateProfile", "updated");
    });
    socket.on("new-post", async (data) => {
      if (data) {
        console.log(data);
        data.forEach(async (element) => {
          users[element].emit("newpost", {
            message: "New post of " + socket.userData.name,
          });
          let description = "New post of " + socket.userData.name;
          const createNotif = await notificationCreate(
            socket.userData._id,
            element,
            description
          );
        });
      }
    });

    socket.on("disconnect", (data) => {
      console.log("disconnect");
      delete users[socket.userId];
      updateUsers(users);
    });

    function updateUsers(users) {
      io.sockets.emit("usernames", Object.keys(users));
    }
  });
};
