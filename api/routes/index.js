const cors = require("cors");
const bodyParser = require("body-parser");

const auth = require("./authRoute");
const user = require("./userRoute");
const role = require("./roleRoute");
const permission = require("./permissionRoute");
const security = require("./securityRoute");
const workspace = require("./workspaceRoute");

module.exports = (app) => {
  app.use(cors());

  app.use(bodyParser.json());

  app.use(auth);
  app.use(user);
  app.use(role);
  app.use(permission);
  app.use(security);
  app.use(workspace);
};
