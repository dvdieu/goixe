const router = require("express").Router();
const BookingController = require("../controllers/Booking.controller");
const AuthMiddleWare = require("../controllers/filter/AuthToken")
router.use(AuthMiddleWare.isAuth);
router.get("/trip/catch/:tripId",BookingController.catchTrip);
router.get("/trip/cancel/:tripId",BookingController.cancelTrip);
router.get("/trip/go_cusmtomer/:tripId",BookingController.goCustomer);
router.get("/trip/go/:tripId",BookingController.go);
router.get("/trip/finish/:tripId",BookingController.finishTrip);
module.exports=router;