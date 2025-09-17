const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require('../models/user.model');


exports.createCheckoutSession = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "userId is required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID || !process.env.FRONTEND_URL) {
      console.error("Missing env variables:", {
        STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
        STRIPE_PRICE_ID: !!process.env.STRIPE_PRICE_ID,
        FRONTEND_URL: !!process.env.FRONTEND_URL,
      });
      return res.status(500).json({ message: "Server misconfigured" });
    }

    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      customer_email: user.email,
      metadata: {
        userId: user._id.toString(),
        plan: "monthly",
      },
      success_url: `${process.env.FRONTEND_URL}/todos?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/login`,
    });

    res.status(201).json({ message: "redirect successfully", url: session.url });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

