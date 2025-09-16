require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); 
const bodyParser = require("body-parser");

const app = express();

connectDB();

app.use(cors());

app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  require("./controllers/webhook.controller").stripeWebhook
);

app.use(express.json());

app.use("/api/todos", require("./routes/todo.routes"));
app.use("/api/auth", require("./routes/user-login.route"));
app.use("/api/payment", require("./routes/payment.routes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
