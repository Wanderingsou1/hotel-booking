import User from "../models/User.js";
import { Webhook } from "svix";

const clearWebhooks = async (req, res) => {
  try {
    // Create a sxiv instance with clerk webhook secret.
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Getting Headers
    const headers = {
      "svix-id": req.get("svix-id"),
      "svix-timestamp": req.get("svix-timestamp"),
      "svix-signature": req.get("svix-signature"),
    };

    // Verifying the webhook
    await whook.verify(JSON.stringify(req.body), headers);

    // Getting data from request body
    const { data, type } = req.body;

    // Switch Cases for different events
    switch (type) {
      case "user.created": {
        const userData = {
        _id: data.id,
        email: data.email_addresses?.[0]?.email_address || "", // optional chaining
        username: `${data.first_name || ""} ${data.last_name || ""}`,
        image: data.image_url || "",
        };
        await User.create(userData);
        break;
      }

      case "user.updated": {
        const userData = {
        _id: data.id,
        email: data.email_addresses?.[0]?.email_address || "", // optional chaining
        username: `${data.first_name || ""} ${data.last_name || ""}`,
        image: data.image_url || "",
        };
        await User.findByIdAndUpdate(data.id, userData);
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        break;
      }

      default:
        break;
    }


    res.json({ success: true, message: "Webhook Received" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export default clearWebhooks;
