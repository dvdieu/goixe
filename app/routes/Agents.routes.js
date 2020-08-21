const router = require("express").Router();
const AuthMiddleWare = require("../controllers/filter/AuthToken")
const agent = require("../controllers/Agents.controller");
router.post("/register",agent.register);
router.post("/login",agent.login);
router.use(AuthMiddleWare.isAuth);
router.get("/me",agent.me);
router.post("/trips/create",agent.insertTrip)
<<<<<<< HEAD
=======
router.post("/trips/create/schedule",agent.insertTripSchedule);
>>>>>>> update
module.exports=router;