const router = require("express").Router();
const BookingController = require("../controllers/Booking.controller");
const AuthMiddleWare = require("../controllers/filter/AuthToken")
router.use(AuthMiddleWare.isAuth);
router.get("/trip/catch/:tripId",BookingController.catchTrip);
// router.post("/trip/cancel/:tripId",BookingController.catchTrip);
module.exports=router;