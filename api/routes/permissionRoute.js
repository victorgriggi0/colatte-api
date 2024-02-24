const { Router } = require("express");

const PermissionController = require("../controllers/permissionController");
const authenticated = require("../middleware/authenticated");

const permissionController = new PermissionController();
const router = Router();

router
  .get("/permissions/all", authenticated, permissionController.getAll)
  .get("/permission/:id", authenticated, permissionController.getById)
  .post("/permission", authenticated, permissionController.create)
  .delete("/permission/:id", authenticated, permissionController.deleteById)
  .put("/permission/:id", authenticated, permissionController.update);

module.exports = router;
