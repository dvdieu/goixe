const socketManagerBusiness = require("../socket/index");
const ROUTERCONST = require("../RouterConst");
const init=(io)=>{
   //Namespace driver
      socketManagerBusiness.driver(io,ROUTERCONST.DRIVERS.base_url);
      socketManagerBusiness.client(io,ROUTERCONST.AGENTS.base_url);
      socketManagerBusiness.manager(io,"/managers");
}
module.exports=init;