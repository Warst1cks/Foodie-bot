# foodie-bot
A Real-time chatbot application.

---

## Getting Started
---
### Prerequisite
- The ChatBot interface should be designed to resemble a chat interface.
- The interface should not require authentication, but user sessions should be stored based on devices.
- Upon landing on the chatbot page, the bot should present the following options to the customer
   - Select 1 to Place an order
   - Select 99 to checkout order
   - Select 98 to see order history
   - Select 97 to see current order
   - Select 0 to cancel order 
- When a customer selects "1", the bot should return a list of items from the restaurant. The customer should be able to select their preferred items from the list using a number selection system and place an order.
- When a customer selects "99" to check out an order, the bot should respond with "Order placed". If there are no orders to place, the bot should respond with "No order to place". The customer should also be provided with the option to place a new order.
- When a customer selects "98", the bot should be able to return all placed orders.
- When a customer selects "97", the bot should be able to return the current order.
- When a customer selects "0", the bot should cancel the order if one exists.
### Setup
Follow the following instructions to kickstart this application.
- Step 1. Open up your Code Editor,preferably Vscode.
- Step 2. Use the ALT key + ` to open your terminal.
- Step 3. Run this command on your terminal
  `git clone https://github.com/Warst1cks/foodie-bot.git`
- Step 4. Install all dependencies.
  `npm i`
- Step 5. Start the server.
  `npm run start`
- Step 6. Open the url displayed on your terminal
  `http://localhost:3500`
  
  Check live application here 👉🏽 **[foodie-bot](https://sambot-u23j.onrender.com)**
