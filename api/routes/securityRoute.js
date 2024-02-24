const { Router } = require("express");

const SecurityController = require("../controllers/securityController");
const authenticated = require("../middleware/authenticated");

const securityController = new SecurityController();
const router = Router();

router
  .post(
    "/security/acl/:user_id",
    authenticated,
    securityController.createAclByUserId
  )
  .delete(
    "/security/acl/:user_id",
    authenticated,
    securityController.deleteAclByUserId
  )
  .post(
    "/security/privileges/:role_id",
    authenticated,
    securityController.createPrivilegeByRoleId
  )
  .delete(
    "/security/privileges/:role_id",
    authenticated,
    securityController.deletePrivilegeByRoleId
  );

module.exports = router;
