const router = require("express").Router();
const tripController = require("../controllers/Trip.controller");
const AuthMiddleWare = require("../controllers/filter/AuthToken")
// Sử dụng authMiddleware.isAuth trước những api cần xác thực
router.post("/create",tripController.insertTrip)
router.get("/:tripId",tripController.getTripById)
// router.post("/gettrip/withdate",tripController.insertTrip)

module.exports=router;