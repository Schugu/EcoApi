import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class AuthController {
  constructor({ adminModel, workerModel }) {
    this.adminModel = adminModel;
    this.workerModel = workerModel;
  }

  login = async (req, res) => {
    const { email, password } = req.body;

    try {
      let user;
      let userType;

      user = await this.adminModel.findOne({ email });
      if (user) {
        userType = 'admin';
      } else {
        user = await this.workerModel.findOneAsigned({ email });
        if (user) {
          userType = 'workerAssigned';
        } else {
          return res.status(404).json({ message: 'User not found' });
        }
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const { password: _, ...publicUser } = user;
      const token = jwt.sign({
        ...publicUser,
        userType
      },
        process.env.SECRET_JWT_KEY,
        {
          expiresIn: "1h"
        });

      res
        .cookie('access_token', token, {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60 // 1 hora
        })
        .json(user = { ...publicUser, userType });
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  };

  protected = async (req, res) => {
    const { user } = req.session;

    if (!user) {
      return res.status(403).send('Acceso no autorizado.')
    }

    res.json(user);
  };

  logout = async (req, res) => {
    res
      .clearCookie('access_token')
      .json({ message: 'Sesión cerrada.' });
  };

  verifyToken = async (req, res) => {
    const { access_token } = req.cookies;
  
    if (!access_token) return res.status(401).json({ message: "Unauthorized" });
  
    jwt.verify(access_token,  process.env.SECRET_JWT_KEY, async (err, decodedToken) => {
      if (err) return res.status(401).json({ message: "Unauthorized" });
  
      const { email } = decodedToken; 
  
      let user;
      let userType;
  
      try {
        user = await this.adminModel.findOne({ email });
        if (user) {
          userType = 'admin';
        } else {
          user = await this.workerModel.findOneAsigned({ email });
          if (user) {
            userType = 'workerAssigned';
          } else {
            return res.status(404).json({ message: 'User not found' });
          }
        }
  
        const { password: _, ...publicUser } = user; 
  
        return res.status(200).json({ ...publicUser, userType });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
      }
    });
  };
  
}
