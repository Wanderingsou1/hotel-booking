import User from "../models/User.js";

// Middleware to check if user is authenticated

export const protect = async (req, res, next) => {
  const userId = req.auth()?.userId;
  console.log(req.auth());

  if(!userId) {
    return res.status(401).json({success: false, message: "User is not authenticated"});
  } else {
    const user = await User.findById(userId);

    if(!user) {
      return res.status(401).json({success: false, message: "User not found"});
    }

    req.user = user;
    next();


  }
}