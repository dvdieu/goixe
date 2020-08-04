
const socketManagerBusiness = require("../socket/index");
const init=(io)=>{
   //Namespace driver
      socketManagerBusiness.driver(io,"/drivers");
      socketManagerBusiness.client(io,"/clients");
}
module.exports=init;