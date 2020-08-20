
const db = require("../models");
const Customer = db.Customer;
const customerServices = require("../services/CustomerServices")
const ErrorApp = require("../ErrorCode")
module.exports = {
    register: async (req, res) => {
        // Validate request
        if (!req.body) {
            res.status(400).send({message: "Content can not be empty!"});
            return;
        }
        try {
            let customer = await customerServices.create(new Customer(req.body)).catch(err => {
                if (err.code === 11000) {
                    throw new Error("EXISTS")
                }
            });
            res.send({
                "status": "OK",
                "message": "successfull",
                "payload": customer
            });
        }catch (e){
            res.send({
                "status": "ERROR",
                "message": e.message
            });
        }
    },
    login: async (req, res) => {
        try {
            if (!req.body) {
                res.status(400).send({message: "Content can not be empty!"});
                return;
            }
            let userName = req.body.user_name;
            let passWord = req.body.password;
            if (userName == undefined || userName.length == 0 || passWord == undefined || passWord.length == 0) {
                res.status(400).send({message: "Content can not be empty!"});
                return;
            }
            let token = await customerServices.login(userName, passWord);
            if (token != null) {

                res.send({
                    "status": "OK",
                    "message": "Login successfull",
                    "token": token.toString()
                });
            } else {
                res.send({
                    "status": "ERROR",
                    "message": "Login Error"
                });
            }
        }catch (e){
            res.send({
                "status": "ERROR",
                "message": e.message
            });
        }
    },
    me: async (req, res) => {
        try {
            let user = await customerServices.get(req.auth_info.data._id);
            if (user) {
                res.send({
                    "status": "OK",
                    "message": "successfull",
                    "payload": user
                });
            } else {
                res.send({
                    "status": "ERROR",
                    "message": "Login Error"
                });
            }
        } catch (e) {
            res.send({
                "status": "ERROR",
                "message": "Login Error"
            });
        }
    },
}