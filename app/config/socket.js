
const socketManagerBusiness = require("../socket/index");
const init=(io)=>{
   //Namespace driver
      socketManagerBusiness.driver(io,"/drivers");
}
module.exports=init;