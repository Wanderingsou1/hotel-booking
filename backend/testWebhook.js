import express from "express";
import bodyParser from "body-parser";

const app = express();

app.post("/api/clerk", bodyParser.raw({ type: "application/json" }), (req, res) => {
  console.log("✅ Webhook route hit");
  console.log("Headers:", req.headers);
  console.log("req.body:", req.body);
  console.log("constructor:", req.body?.constructor?.name);
  console.log("Content-Type:", req.headers["content-type"]);

  res.json({ success: true });
});

app.listen(3000, () => console.log("🚀 Listening on :3000"));
