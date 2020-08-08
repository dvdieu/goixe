const router = require("express").Router();
const operationController = require("../controllers/Operation.controller");
router.get("/list_driver_on",operationController.list_driver_on);
router.get("/list_driver_on_catch",operationController.list_driver_on_catch);
router.get("/list_driver_off",operationController.list_driver_off);
router.get("/list_driver_near_trip/long/:long/lat/:lat/km/:km",operationController.list_driver_near_trip);

module.exports=router;