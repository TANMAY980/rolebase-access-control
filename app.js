const express=require('express');
const dotEnv=require('dotenv');
const bodyParser=require('body-parser');
const path=require('path');
const{resolve,join}=require('path');
const {swaggerui,swaggerSpec}=require("./app/helper/swagger")
dotEnv.config({quiet:true});

const appConfig=require(resolve(join(__dirname,"./app/config","index")));
const utils=require(resolve(join(__dirname,"./app/helper","utils")));

const app=express()
const namedRouter=require('route-label')(app);
const getProtocol=appConfig.appRoot.protocol;
const getHost=appConfig.appRoot.host;
const getPort=appConfig.appRoot.port;
const isProduction=appConfig.appRoot.isProd;
const getApiFolderName=appConfig.appRoot.getApiFolderName;


const adminroute=require('./app/routes/api/admin.routes');
const employeeroute=require('./app/routes/api/employee.routes');
const managerroute=require('./app/routes/api/manager.routes');

app.use("/api",[adminroute,employeeroute,managerroute]);
app.use("/api-docs",swaggerui.serve,swaggerui.setup(swaggerSpec));

app.use(bodyParser.urlencoded({limit: "50mb",extended:true,parameterLimit:50000}));
app.use(bodyParser.json({limit:"50mb"}));

(async()=>{
    try {
        const db=require('./app/config/db.config');
        await db.DbConnection();

        const apiFiles=await utils._readdir(`./app/routes/${getApiFolderName}`);
        apiFiles.forEach((file)=>{
            if(!file || file[0]=='.')return;
            namedRouter.use("/",require(join(__dirname,file)));
            
        });

        namedRouter.buildRouteTable();

         if (!isProduction && process.env.SHOW_NAMED_ROUTES === "true") {
            const apiRouteList = namedRouter.getRouteTable("/");
       
            console.log("Route Tables:");
            console.log("Api Folder Routes:", apiRouteList);
        };

        app.listen(getPort,()=>{
            console.log(`Application running on ${getProtocol}://${getHost}:${getPort}`);
            
        })

    } catch (error) {
        console.log(`something went wrong ${error}`);
    }
})();