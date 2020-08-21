const db = require("../models");
const Agents = db.Agents;
const Auth = require("../helps/jwt.helper")
const ROUTERCONST = require("../RouterConst");
module.exports = {
    async create(payload) {
        try {
            return await Agents.create(new Agents(payload));
        } catch (e) {
            throw e
        }
    },
    async get(id) {
        try {
            return Agents.findById(id);
        } catch (e) {
            throw e
        }
    },
    async login(userName, passWord) {
        try {
            let customer = await Agents.findOne({"user_name": userName.toLocaleLowerCase(), "password": passWord});
            if(!customer){
                throw new Error("Not Exsists");
            }
            return Auth.generateToken(customer,ROUTERCONST.AGENTS.token_type);
        }
        catch (e){
            throw e;
        }
    }
}