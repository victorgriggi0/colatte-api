const database = require("../models");

const roles = (rolesList) => {
  return async (req, res, next) => {
    const { userId } = req;

    const user = await database.users.findOne({
      include: [
        {
          model: database.roles,
          as: "rolesOfUser",
          attributes: ["id", "name"],
        },
      ],
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(404).send({
        message: "O usuário informado não foi encontrado em nosso sistema.",
      });
    }

    const registeredRoles = user.rolesOfUser
      .map((role) => role.name)
      .some((role) => rolesList.includes(role));
    if (!registeredRoles) {
      return res.status(403).send({
        message: "O usuário não é autorizado para acessar esta rota.",
      });
    }

    return next();
  };
};

module.exports = roles;
