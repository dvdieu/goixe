const router = require("express").Router();
const AuthMiddleWare = require("../controllers/filter/AuthToken")
const driverController = require("../controllers/Drivers.controller");
const AgentController = require("../controllers/Drivers.controller");
router.post("/register",driverController.register);
router.post("/login",driverController.login);


router.use(AuthMiddleWare.isAuth);
router.get("/me",driverController.me);
router.post("/gps",driverController.gps);
router.get("/on",driverController.on);
router.get("/off",driverController.off);
router.get("/in_charge",driverController.inCharge);


router.get("/trips/catch/:tripId",AgentController.catchTrip);
router.get("/trips/cancel/:tripId",AgentController.cancelTrip);
<<<<<<< HEAD
router.get("/trips/go_cusmtomer/:tripId",AgentController.goCustomer);
=======
router.get("/trips/go_cusmtomer/:tripId",AgentController.goAgents);
>>>>>>> update
router.get("/trips/go/:tripId",AgentController.go);
router.get("/trips/finish/:tripId",AgentController.finishTrip);

module.exports=router;