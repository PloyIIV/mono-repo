import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({
      message: "Access denied. No token.",
    });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedToken)
    req.user = {
      user: { _id: decodedToken.userId }
    };
    next();
  } catch (error) {
    next(error);
  }
};
