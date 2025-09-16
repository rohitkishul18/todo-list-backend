const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Subscription = require("../models/subscription.model");
const User = require("../models/user.model");

exports.stripeWebhook = async (req, res) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        let customerEmail = session.customer_email;
        if (!customerEmail) {
          const customer = await stripe.customers.retrieve(session.customer);
          customerEmail = customer.email;
        }

        const user = await User.findOne({ email: customerEmail });
        if (user) {
          user.hasAccess = true;
          user.customerId = session.customer;
          user.subscriptionId = session.subscription;
          await user.save();

          await Subscription.create({
            userId: user._id,
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
           price_id: session.metadata?.price_id || process.env.STRIPE_PRICE_ID,
            plan: session.metadata?.plan || "monthly",
            status: "active",
            startDate: new Date()
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const subscription = await Subscription.findOne({
          stripeSubscriptionId: sub.id
        });
        if (subscription) {
          subscription.status = "canceled";
          await subscription.save();

          await User.findByIdAndUpdate(subscription.userId, {
            hasAccess: false,
            subscriptionId: null,
            customerId: null
          });
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error("⚠️ Webhook handler error:", err);
    res.status(500).send("Webhook handler failed");
  }
};
