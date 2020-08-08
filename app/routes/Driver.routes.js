const router = require("express").Router();
const AuthMiddleWare = require("../controllers/filter/AuthToken")
const driverController = require("../controllers/Drivers.controller");
router.post("/register",driverController.register);
router.post("/login",driverController.login);
router.use(AuthMiddleWare.isAuth);
router.get("/me",driverController.me);
router.post("/gps",driverController.gps);
router.get("/on",driverController.on);
router.get("/off",driverController.off);
module.exports=router;