const socketManager = {};
socketManager.driver = require("./SocketDrivers");
socketManager.client = require("./SocketClients");
module.exports = socketManager;