const router = require("express").Router();
const operationController = require("../controllers/Operation.controller");
router.get("/drivers/list_driver_on",operationController.list_driver_on);
router.get("/drivers/list_driver_on_catch",operationController.list_driver_on_catch);
router.get("/drivers/list_driver_off",operationController.list_driver_off);
router.get("/drivers/list_driver_near_trip/long/:long/lat/:lat/km/:km",operationController.list_driver_near_trip);
router.post("/trips/list_trips/page/:page/size/:size",operationController.list_trips);

module.exports=router;