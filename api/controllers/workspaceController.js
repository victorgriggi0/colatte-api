const { v4: uuidv4 } = require("uuid");

const database = require("../models");

class WorkspaceController {
  async getAll(_, res) {
    try {
      const workspaces = await database.workspaces.findAll();

      res.status(200).json({ workspaces });
    } catch (error) {
      console.error("message error: ", error);
      res.status(400).send({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;

      const workspace = await database.workspaces.findOne({
        where: {
          id,
        },
      });
      if (!workspace) {
        return res.status(404).send({
          message: "Nenhum registro foi encontrado com a ID fornecida.",
        });
      }

      res.status(200).json({ workspace });
    } catch (error) {
      console.error("message error: ", error);
      res.status(400).send({ message: error.message });
    }
  }

  async create(req, res) {
    try {
      const { name, imageUrl, description } = req.body;

      const workspace = await database.workspaces.findOne({
        where: {
          name,
        },
      });
      if (workspace) {
        return res.status(409).send({
          message:
            "Já existe um registro com este nome. Por favor, escolha um nome diferente.",
        });
      }

      const newWorkspace = await database.workspaces.create({
        id: uuidv4(),
        name,
        imageUrl,
        description,
      });

      res.status(201).json({ newWorkspace });
    } catch (error) {
      console.error("message error: ", error);
      res.status(400).send({ message: error.message });
    }
  }

  async deleteById(req, res) {
    try {
      const { id } = req.params;

      const workspace = await database.workspaces.findOne({
        where: {
          id,
        },
      });
      if (!workspace) {
        return res.status(404).send({
          message: "Nenhum registro foi encontrado com a ID fornecida.",
        });
      }

      await database.workspaces.destroy({
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
      const { name, imageUrl, description } = req.body;

      const workspace = await database.workspaces.findOne({
        where: {
          id,
        },
      });
      if (!workspace) {
        return res.status(404).send({
          message: "Nenhum registro foi encontrado com a ID fornecida.",
        });
      }

      workspace.name = name;
      workspace.imageUrl = imageUrl;
      workspace.description = description;
      await workspace.save();
      const updatedWorkspace = await workspace.reload();

      res.status(200).send({ updatedWorkspace });
    } catch (error) {
      console.error("message error: ", error);
      res.status(400).send({ message: error.message });
    }
  }
}

module.exports = WorkspaceController;
