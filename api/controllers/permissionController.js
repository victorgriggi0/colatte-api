const { v4: uuidv4 } = require("uuid");

const database = require("../models");

class PermissionController {
  async getAll(_, res) {
    try {
      const permissions = await database.permissions.findAll({
        include: [
          {
            model: database.users,
            as: "usersWithPermission",
            attributes: ["id", "name"],
          },
          {
            model: database.roles,
            as: "rolesWithPermission",
            attributes: ["id", "name"],
          },
        ],
      });

      res.status(200).json({ permissions });
    } catch (error) {
      console.error("message error: ", error);
      res.status(400).send({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;

      const permission = await database.permissions.findOne({
        include: [
          {
            model: database.users,
            as: "usersWithPermission",
            attributes: ["id", "name"],
          },
          {
            model: database.roles,
            as: "rolesWithPermission",
            attributes: ["id", "name"],
          },
        ],
        where: {
          id,
        },
      });
      if (!permission) {
        return res.status(404).send({
          message: "Nenhum registro foi encontrado com a ID fornecida.",
        });
      }

      res.status(200).json({ permission });
    } catch (error) {
      console.error("message error: ", error);
      res.status(400).send({ message: error.message });
    }
  }

  async create(req, res) {
    try {
      const { name } = req.body;

      const permission = await database.permissions.findOne({
        where: {
          name,
        },
      });
      if (permission) {
        return res.status(409).send({
          message:
            "Já existe um registro com este nome. Por favor, escolha um nome diferente.",
        });
      }

      const newPermission = await database.permissions.create({
        id: uuidv4(),
        name,
      });

      res.status(201).json({ newPermission });
    } catch (error) {
      console.error("message error: ", error);
      res.status(400).send({ message: error.message });
    }
  }

  async deleteById(req, res) {
    try {
      const { id } = req.params;

      const permission = await database.permissions.findOne({
        where: {
          id,
        },
      });
      if (!permission) {
        return res.status(404).send({
          message: "Nenhum registro foi encontrado com a ID fornecida.",
        });
      }

      await database.permissions.destroy({
        where: {
          id,
        },
      });

      res.status(200).send({ message: "O registro foi excluído com sucesso." });
    } catch (error) {
      console.error("message error: ", error);
      res.status(400).send({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const permission = await database.permissions.findOne({
        where: {
          id,
        },
      });
      if (!permission) {
        return res.status(404).send({
          message: "Nenhum registro foi encontrado com a ID fornecida.",
        });
      }

      if (name) permission.name = name;
      await permission.save();
      const updatedPermission = await permission.reload();

      res.status(200).send({ updatedPermission });
    } catch (error) {
      console.error("message error: ", error);
      res.status(400).send({ message: error.message });
    }
  }
}

module.exports = PermissionController;
