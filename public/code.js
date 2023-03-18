const chatForm = document.getElementById("chat-form");
const chatMessage = document.querySelector(".chat-messages");

const socket = io();

const displayOptions = (options) => {
  const message = `<ul> ${options
    .map((option) => `<li>${option}</li>`)
    .join("")} </ul>`;
  displayMessage(message, true);
};

const displayMessage = (message, isBotMessage) => {
  const div = document.createElement("div");
  div.className = `message message-${isBotMessage ? "bot" : "user"}`;
  div.innerHTML = message;

  document.querySelector(".chat-messages").append(div);
  chatMessage.scrollTop = chatMessage.scrollHeight;
};

const displayMenu = (menus) => {
  const message = `<ol start=2> ${menus
    .map((menu) => `<li>${menu.name}</li>`)
    .join("")} </ol>`;
  displayMessage(message, true);
};

const displayOrder = (orders) => {
  if (orders.includes(null)) {
    const newOrder = orders.filter((value) => value !== null);
    const message = `There is an invalid order, You ordered for : \n <ul> ${newOrder
      .map((order) => `<li>${order.name}</li>`)
      .join("")} </ul> \n\n <br> Select 1 so you can place an order! `;

    console.log(newOrder);

    displayMessage(message, true);
  } else {
    const options = [
      "Want to order more,type 1 to view our menu!",
      "Type 99 to checkout order",
      "Type 98 to see order history",
      "Type 97 to see current order",
      "Type 0 to cancel order",
    ];

    const message = `You just ordered for : \n <ul> ${orders
      .map((order) => `<li>${order.name}</li>`)
      .join("")} </ul>`;
    console.log("message", message);
    displayMessage(message, true);
    displayOptions(options); 
  }
};

const orderHistory = (orders) => {
  console.log(orders);
  const message = `Your Order History : \n <ul> ${orders
    .map((order) => `<li>${order.name}</li>`)
    .join("")} </ul> \n
    type 1 to place another order or 0 to cancel order!.`;
  displayMessage(message, true);
};
//When a user connects
socket.on("connect", () => {
  console.log("You are connected:", socket.id);
});
const displayCheckout = (orders) => {
  const message = `Checkout : \n <ul> ${orders
    .map((order) => `<li>${order.name}</li>`)
    .join("")} </ul> type 1 if you wish to place another order!`;
  displayMessage(message, true);
};


socket.on("welcome", ({ options }) => {
  displayOptions(options);
});

socket.on("botResponse", ({ type, data }) => {
  switch (type) {
    case "menu":
      displayMenu(data);
      break;
    case "pattern":
      displayOrder(data);
      break;
    case "no-checkout":
      displayMessage(data.message, true);
      break;
    case "checkout":
      displayCheckout(data.message);
      break;
    case "no-order":
      displayMessage(data.message, true);
      break;
    case "currentOrder":
      displayOrder(data);
      break;
    case "no-cancel":
      displayMessage(data.message, true);
      break;
    case "wrong-input":
      displayMessage(data.message, true);
      break;
    case "order-history":
      orderHistory(data);

      break;
    case "no-order-history":
      displayMessage(data.message,true);
      break;
    default:
      displayMessage(data.message, true);
      break;
  }
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value.trim();

  displayMessage(msg, false);
  //emit message to the server
  socket.emit("chatMessage", msg);

  //clear the message
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//output message to DOM
function outputMessage(message) {}

