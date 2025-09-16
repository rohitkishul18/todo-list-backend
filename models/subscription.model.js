const mongoose = require("mongoose");


const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  stripeCustomerId: { type: String, required: true },
  stripeSubscriptionId: { type: String },
  plan: { type: String, default: "monthly" },
  price_id: { type: String, required: true }, 
  status: {
      type: String,
      enum: ["active", "canceled", "incomplete", "past_due", "trialing", "unpaid"],
      default: "incomplete",
    },
  startDate: { type: Date },
  endDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);