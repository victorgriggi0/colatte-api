const { Router } = require("express");

const RoleController = require("../controllers/roleController");
const authenticated = require("../middleware/authenticated");

const roleController = new RoleController();
const router = Router();

router
  .get("/roles/all", authenticated, roleController.getAll)
  .get("/role/:id", authenticated, roleController.getById)
  .post("/role", authenticated, roleController.create)
  .delete("/role/:id", authenticated, roleController.deleteById)
  .put("/role/:id", authenticated, roleController.update);

module.exports = router;
