const Sequelize = require("sequelize");

const database = require("../models");

class securityController {
  async createAclByUserId(req, res) {
    try {
      const { user_id } = req.params;
      const { role_id, permission_id } = req.body;

      const user = await database.users.findOne({
        include: [
          {
            model: database.roles,
            as: "rolesOfUser",
            attributes: ["id", "name"],
          },
          {
            model: database.permissions,
            as: "permissionsOfUser",
            attributes: ["id", "name"],
          },
        ],
        where: {
          id: user_id,
        },
      });
      if (!user) {
        return res.status(404).send({
          message: "Nenhum registro foi encontrado com a ID fornecida.",
        });
      }

      if (role_id) {
        const userRoles = await user.getRolesOfUser();

        const roleIdsToAdd = role_id.filter(
          (id) => !userRoles.some((userRole) => userRole.id === id)
        );

        if (roleIdsToAdd.length) {
          const rolesToAdd = await database.roles.findAll({
            where: { id: { [Sequelize.Op.in]: roleIdsToAdd } },
          });

          await user.addRolesOfUser(rolesToAdd);
        } else {
          return res.status(409).send({
            message: "Todos os cargos especificados já estão atribuídos.",
          });
        }
      }

      if (permission_id) {
        const userPermissions = await user.getPermissionsOfUser();

        const permissionIdsToAdd = permission_id.filter(
          (id) =>
            !userPermissions.some((userPermission) => userPermission.id === id)
        );

        if (permissionIdsToAdd.length) {
          const permissionsToAdd = await database.permissions.findAll({
            where: { id: { [Sequelize.Op.in]: permissionIdsToAdd } },
          });

          await user.addPermissionsOfUser(permissionsToAdd);
        } else {
          return res.status(409).send({
            message: "Todas as permissões especificadas já estão atribuídas.",
          });
        }
      }

      const userWithNewAcl = await user.reload();

      return res.status(200).send({ userWithNewAcl });
    } catch (error) {
      console.error("error:", error);
      res.status(400).send({ message: error.message });
    }
  }

  async deleteAclByUserId(req, res) {
    try {
      const { user_id } = req.params;
      const { role_id, permission_id } = req.body;

      const user = await database.users.findOne({
        include: [
          {
            model: database.roles,
            as: "rolesOfUser",
            attributes: ["id", "name"],
          },
          {
            model: database.permissions,
            as: "permissionsOfUser",
            attributes: ["id", "name"],
          },
        ],
        where: {
          id: user_id,
        },
      });
      if (!user) {
        return res.status(404).send({
          message: "Nenhum registro foi encontrado com a ID fornecida.",
        });
      }

      if (role_id) {
        const userRoles = await user.getRolesOfUser();

        const roleIdsToRemove = userRoles
          .filter((role) => role_id.includes(role.id))
          .map((role) => role.id);

        if (roleIdsToRemove.length) {
          await user.removeRolesOfUser(roleIdsToRemove);
        } else {
          return res.status(404).send({
            message: "Nenhum registro válido encontrado para remover.",
          });
        }
      }

      if (permission_id) {
        const userPermissions = await user.getPermissionsOfUser();

        const permissionsIdsToRemove = userPermissions
          .filter((permission) => permission_id.includes(permission.id))
          .map((permission) => permission.id);

        if (permissionsIdsToRemove.length) {
          await user.removePermissionsOfUser(permissionsIdsToRemove);
        } else {
          return res.status(404).send({
            message: "Nenhum registro válido encontrado para remover.",
          });
        }
      }

      const userWithNewAcl = await user.reload();

      return res.status(200).send({ userWithNewAcl });
    } catch (error) {
      console.error("error:", error);
      res.status(400).send({ message: error.message });
    }
  }

  async createPrivilegeByRoleId(req, res) {
    try {
      const { role_id } = req.params;
      const { permission_id } = req.body;

      const role = await database.roles.findOne({
        include: [
          {
            model: database.permissions,
            as: "permissionsOfRole",
            attributes: ["id", "name"],
          },
        ],
        where: {
          id: role_id,
        },
      });
      if (!role) {
        return res.status(404).send({
          message: "Nenhum registro foi encontrado com a ID fornecida.",
        });
      }

      if (permission_id) {
        const rolePermissions = await role.getPermissionsOfRole();

        const permissionIdsToAdd = permission_id.filter(
          (id) =>
            !rolePermissions.some((rolePermission) => rolePermission.id === id)
        );

        if (permissionIdsToAdd.length) {
          const permissionsToAdd = await database.permissions.findAll({
            where: { id: { [Sequelize.Op.in]: permissionIdsToAdd } },
          });

          await role.addPermissionsOfRole(permissionsToAdd);
        } else {
          return res.status(409).send({
            message: "Todas as permissões especificadas já estão atribuídas.",
          });
        }
      }

      const roleWithNewPermissions = await role.reload();

      return res.status(200).send({ roleWithNewPermissions });
    } catch (error) {
      console.error("error:", error);
      res.status(400).send({ message: error.message });
    }
  }

  async deletePrivilegeByRoleId(req, res) {
    try {
      const { role_id } = req.params;
      const { permission_id } = req.body;

      const role = await database.roles.findOne({
        include: [
          {
            model: database.permissions,
            as: "permissionsOfRole",
            attributes: ["id", "name"],
          },
        ],
        where: {
          id: role_id,
        },
      });
      if (!role) {
        return res.status(404).send({
          message: "Nenhum registro foi encontrado com a ID fornecida.",
        });
      }

      if (permission_id) {
        const rolePermissions = await role.getPermissionsOfRole();

        const permissionsIdsToRemove = rolePermissions
          .filter((permission) => permission_id.includes(permission.id))
          .map((permission) => permission.id);

        if (permissionsIdsToRemove.length) {
          await role.removePermissionsOfRole(permissionsIdsToRemove);
        } else {
          return res.status(404).send({
            message: "Nenhum registro válido encontrado para remover.",
          });
        }
      }

      const roleWithNewPermissions = await role.reload();

      return res.status(200).send({ roleWithNewPermissions });
    } catch (error) {
      console.error("error:", error);
      res.status(400).send({ message: error.message });
    }
  }
}

module.exports = securityController;
