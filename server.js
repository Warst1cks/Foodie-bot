const express = require("express");
const session = require("express-session");
var MongoDBStore = require("connect-mongodb-session")(session);
const Order = require("./orderModel");

const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const db = require("./db");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

db.connectToMongoDB();

var store = new MongoDBStore({
  uri: process.env.MONGODB_CONNECTION_URI,
  collection: "userSessions",
});

const sessionMiddleware = session({
  secret: "keyboard cat",
  resave: false,
  store: store,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 2629056000 }, //
});

app.use(sessionMiddleware);

io.use((socket, next) => sessionMiddleware(socket.request, {}, next));

const PORT = 5000 || process.env.PORT;

//Setting the static path
app.use(express.static("public"));
app.use((err, req, res, next) => {
  console.log(err.stack);
})

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const botName = "SamBot";

const options = [
  "Welcome to SamBot!",
  "Type 1 to Place an order",
  "Type 99 to checkout order",
  "Type 98 to see order history",
  "Type 97 to see current order",
  "Type 0 to cancel order",
];

const menus = [
  { id: 2, name: "Catfish pepper soup" },
  { id: 3, name: "Pounded yam and ogbono soup" },
  { id: 4, name: "Jollof rice and chiken with Salad" },
  { id: 5, name: "White rice and stew" },
  { id: 6, name: "French fries with crispy chicken" },
  { id: 7, name: "Bread and beans" },
  { id: 8, name: "Amala and Ewedu" },
  { id: 9, name: "Pounded yam and Edikaikong soup" },
];

const orders = [];

//When a client connects
io.on("connection", (socket) => {
  const session = socket.request.session;

  if (!session.orders) {
    session.orders = [];
    session.save();
  }

  console.log("someone connected!..", session.id);

  socket.emit("welcome", { options });

  socket.on("chatMessage", (msg) => {
    //Regex for 2-11, to pick a menu
    const pattern = /^[2-9]|1[0-1]$/;
    // console.log(pattern)

    switch (true) {
      //Places an order
      case msg === "1":
        socket.emit("botResponse", { type: "menu", data: menus });
        break;

      //to checkout order
      case msg === "99":
        if (session.orders.length == 0) {
          socket.emit("botResponse", {
            type: "no-checkout",
            data: { message: "You have no order to checkout" },
          });
        } else {
          socket.emit("botResponse", {
            type: "checkout",
            data: session.orders,
          });
          session.orders = [];
          session.save();
        }
      break;
      //order history
      case msg === "98":
        if (session.orders.length == 0) {
          socket.emit("botResponse", {
            type: "no-order-history",
            data: {
              message: "You have no order history after checkout! \n type 1 to place an order!",
            },
          });
        } else {
          socket.emit("botResponse", {
            type: "order-history",
            data: session.orders,
          });
          session.orders = [];
          session.save();
        }

        break;
      // check current order
      case msg === "97":
        if (session.orders.length == 0) {
          socket.emit("botResponse", {
            type: "no-order",
            data: {
              message:
                "You have not made any order yet! \n Type 1 to Place an order!",
            },
          });
        } else {
          socket.emit("botResponse", {
            type: "currentOrder",
            data: session.orders,
          });
        }
        break;
      //cancel order
      case msg === "0":
        if (session.orders.length == 0) {
          socket.emit("botResponse", {
            type: "no-cancel",
            data: {
              message:
                "No order to cancel! \n type 1 to place an order or 0 to cancel order",
            },
          });
        } else {
          socket.emit("botResponse", {
            type: "cancel",
            data: {
              message: `You just cancelled your order of ${session.orders.length} item(s) \n type : 1.To place a new order`,
            },
          });
          session.orders = [];
          session.save();
        }
        break;
      case pattern.test(msg):
        const order = menus.find((item) => item.id == +msg);
        session.orders.push(order);

        const newOrder = new Order({
          sessionId: session.id,
          orders: session.orders,
        });

        newOrder.save();

        session.save();
        socket.emit("botResponse", { type: "pattern", data: session.orders });
        break;
      default:
        socket.emit("botResponse", {
          type: "wrong-input" || "null",
          data: {
            message: `Your input is wrong  \n  Type 1 to place order!`,
          },
        });
        break;
    }
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

