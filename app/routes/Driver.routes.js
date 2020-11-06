const router = require("express").Router();
const AuthMiddleWare = require("../controllers/filter/AuthToken")
const driverController = require("../controllers/Drivers.controller");
const AgentController = require("../controllers/Drivers.controller");
router.post("/register",driverController.register);
router.post("/login",driverController.login);

router.get("/trips/payment/:km",driverController.charge);
router.use(AuthMiddleWare.isAuth);
router.get("/me",driverController.me);
router.post("/me/update",driverController.meUpdate);
router.post("/me/history/finish/page/:page/size/:size",driverController.historyTripsFinish);
router.post("/me/history/cancel/page/:page/size/:size",driverController.historyTripsCancel);
router.post("/gps",driverController.gps);
router.get("/on",driverController.on);
router.get("/off",driverController.off);
router.get("/in_charge",driverController.inCharge);


router.get("/trips/catch/:tripId",AgentController.catchTrip);
router.get("/trips/cancel/:tripId",AgentController.cancelTrip);
router.get("/trips/go_cusmtomer/:tripId",AgentController.goAgents);
router.get("/trips/go/:tripId",AgentController.go);
router.get("/trips/finish/:tripId",AgentController.finishTrip);

module.exports=router;