const taskRoutes = require("./task.route");
const userRoutes = require("./user.route");

const authMiddelware = require("../middlewares/auth.middleware");

module.exports = (app) => {

    const version = "/api/v1";

    app.use(version + "/tasks", authMiddelware.requireAuth, taskRoutes);

    app.use(version + "/users", userRoutes);
};