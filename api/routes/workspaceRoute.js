const { Router } = require("express");

const WorkspaceController = require("../controllers/workspaceController");
const authenticated = require("../middleware/authenticated");

const workspaceController = new WorkspaceController();
const router = Router();

router
  .get("/workspaces", authenticated, workspaceController.getAll)
  .get("/workspace/:id", authenticated, workspaceController.getById)
  .post("/workspace", authenticated, workspaceController.create)
  .delete("/workspace/:id", authenticated, workspaceController.deleteById)
  .put("/workspace/:id", authenticated, workspaceController.update);

module.exports = router;
