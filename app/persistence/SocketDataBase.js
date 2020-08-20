const RedisWrapper = require("../redis/RedisWrapper");
module.exports={
    dataBaseNameCustomerOnline(){
        return "_CUSTOMERS_ONLINE"
    },
    dataBaseNameDriverOnline(){
        return "_DRIVERS_ONLINE"
    },
    async setSocket(dataBaseTable,primaryKey,value){
        try {
            await RedisWrapper.crud.hset(dataBaseTable, primaryKey, value);
        }catch (e){
            throw e;
        }
    },
    async getSocket(dataBaseTable,primaryKey){
        try {
            let data = await RedisWrapper.crud.hget(dataBaseTable, primaryKey);
            return data;
        }catch (e){
            throw e;
        }
    },
    async delSocket(dataBaseTable, primaryKey) {
        try {
            await RedisWrapper.crud.hdel(dataBaseTable, primaryKey);
        }catch (e){
            throw e;
        }
    }
}