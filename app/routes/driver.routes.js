const router = require("express").Router();
const AuthMiddleWare = require("../controllers/filter/AuthToken")
const driverController = require("../controllers/drivers.controller");
router.post("/register",driverController.register);
router.post("/login",driverController.login);
router.get("/details/:id",driverController.details);
router.use(AuthMiddleWare.isAuth);
router.get("/me",driverController.me);
router.post("/gps",driverController.gps);
module.exports=router;