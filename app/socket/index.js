const socketManager = {};
socketManager.driver = require("./SocketDrivers");
socketManager.client = require("./SocketClients");
socketManager.manager = require("./SocketManagers");
module.exports = socketManager;