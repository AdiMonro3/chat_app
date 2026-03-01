import jwt from "jsonwebtoken";

export const protectedRoute = async (req, res, next) => {
  try {
    
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized in try" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    req.user = decoded;

    next();
  } catch (error) {
    console.log("JWT ERROR:", error.message);
    res.status(401).json({ message: error.message });
  }
};