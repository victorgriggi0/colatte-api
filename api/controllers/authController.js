const { compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");

const database = require("../models");
const jsonSecret = require("../config/jsonSecret");

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).send({
          message:
            "Erro de login: É necessário inserir um e-mail e uma senha válidos.",
        });
      }

      const emailLowerCase = email.toLowerCase();

      const user = await database.users.findOne({
        where: {
          email: emailLowerCase,
        },
      });
      if (!user) {
        return res
          .status(404)
          .send({ message: "Não há uma conta com esse endereço de email." });
      }

      const passwordMatch = await compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).send({
          message: "Endereço de email ou senha inválidos! Tente novamente.",
        });
      }

      const accessToken = sign(
        {
          id: user.id,
          email: user.email,
        },
        jsonSecret.secret,
        {
          expiresIn: 3600,
        }
      );

      res.status(200).json({ accessToken });
    } catch (error) {
      console.error("message error: ", error);
      res.status(400).send({ message: error.message });
    }
  }
}

module.exports = AuthController;
