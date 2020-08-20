const db = require("../models");
const Customer = db.Customer;
const Auth = require("../helps/jwt.helper")
const ROUTERCONST = require("../RouterConst");
module.exports = {
    async create(payload) {
        try {
            return await Customer.create(new Customer(payload));
        } catch (e) {
            throw e
        }
    },
    async get(id) {
        try {
            return Customer.findById(id);
        } catch (e) {
            throw e
        }
    },
    async login(userName, passWord) {
        try {
            let customer = await Customer.findOne({"user_name": userName.toLocaleLowerCase(), "password": passWord});
            if(!customer){
                throw new Error("Not Exsists");
            }
            return Auth.generateToken(customer,ROUTERCONST.CUSTOMERS.token_type);
        }
        catch (e){
            throw e;
        }
    }
}