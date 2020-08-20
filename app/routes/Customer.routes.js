const router = require("express").Router();
const AuthMiddleWare = require("../controllers/filter/AuthToken")
const customer = require("../controllers/Customer.controller");
router.post("/register",customer.register);
router.post("/login",customer.login);
router.use(AuthMiddleWare.isAuth);
router.get("/me",customer.me);
module.exports=router;