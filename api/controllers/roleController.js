const { v4: uuidv4 } = require("uuid");

const database = require("../models");

class RoleController {
  async getAll(_, res) {
    try {
      const roles = await database.roles.findAll({
        include: [
          {
            model: database.users,
            as: "usersInRole",
            attributes: ["id", "name"],
          },
          {
            model: database.permissions,
            as: "permissionsOfRole",
            attributes: ["id", "name"],
          },
        ],
      });

      res.status(200).json({ roles });
    } catch (error) {
      console.error("message error: ", error);
      res.status(400).send({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;

      const role = await database.roles.findOne({
        include: [
          {
            model: database.roles,
            as: "usersInRole",
            attributes: ["id", "name"],
          },
          {
            model: database.permissions,
            as: "permissionsOfRole",
            attributes: ["id", "name"],
          },
        ],
        where: {
          id,
        },
      });
      if (!role) {
        return res.status(404).send({
          message: "Nenhum registro foi encontrado com a ID fornecida.",
        });
      }

      res.status(200).json({ role });
    } catch (error) {
      console.error("message error: ", error);
      res.status(400).send({ message: error.message });
    }
  }

  async create(req, res) {
    try {
      const { name } = req.body;

      const role = await database.roles.findOne({
        where: {
          name,
        },
      });
      if (role) {
        return res.status(409).send({
          message:
            "Já existe um registro com este nome. Por favor, escolha um nome diferente.",
        });
      }

      const newRole = await database.roles.create({
        id: uuidv4(),
        name,
      });

      res.status(201).json({ newRole });
    } catch (error) {
      console.error("message error: ", error);
      res.status(400).send({ message: error.message });
    }
  }

  async deleteById(req, res) {
    try {
      const { id } = req.params;

      const role = await database.roles.findOne({
        where: {
          id,
        },
      });
      if (!role) {
        return res.status(404).send({
          message: "Nenhum registro foi encontrado com a ID fornecida.",
        });
      }

      await database.roles.destroy({
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

      const role = await database.roles.findOne({
        where: {
          id,
        },
      });
      if (!role) {
        return res.status(404).send({
          message: "Nenhum registro foi encontrado com a ID fornecida.",
        });
      }

      if (name) role.name = name;
      await role.save();
      const updatedRole = await role.reload();

      res.status(200).send({ updatedRole });
    } catch (error) {
      console.error("message error: ", error);
      res.status(400).send({ message: error.message });
    }
  }
}

module.exports = RoleController;
