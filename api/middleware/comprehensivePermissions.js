const database = require("../models");

const comprehensivePermissions = (requiredPermissions) => {
  return async (req, res, next) => {
    const { userId } = req;

    const user = await database.users.findOne({
      include: [
        {
          model: database.permissions,
          as: "permissionsOfUser",
          attributes: ["id", "name"],
        },
        {
          model: database.roles,
          as: "rolesOfUser",
          attributes: ["id", "name"],
          include: [
            {
              model: database.permissions,
              as: "permissionsOfRole",
              attributes: ["id", "name"],
            },
          ],
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

    const userPermissions = new Set([
      ...user.permissionsOfUser.map((p) => p.name),
      ...user.rolesOfUser.flatMap((role) =>
        role.permissionsOfRole.map((p) => p.name)
      ),
    ]);

    const hasPermission = requiredPermissions.some((p) =>
      userPermissions.has(p)
    );
    if (!hasPermission) {
      return res.status(403).send({
        message: "O usuário não é autorizado para acessar esta rota.",
      });
    }

    return next();
  };
};

module.exports = comprehensivePermissions;
