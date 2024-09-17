import jwt from "jsonwebtoken";

export const authRequire = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return res.status(403).send('No Token');

  req.session = { user: null };

  jwt.verify(token, process.env.SECRET_JWT_KEY, (err, user) => {
    if (err) return res.status(401).json({ message: 'Invalid Token' });

    req.session.user = user;
    next();
  });
}