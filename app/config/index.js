module.exports={
    appRoot:{
        env:process.env.NODE_ENV || "development",
        protocol:process.env.PROTOCOL || http,
        isProd:process.env.NODE_ENV ==="production",
        host:process.env.HOST || "localhost",
        port:process.env.PORT || "6000",
        appName:process.env.APP_NAME || "rolebase",
        getApiFolderName:process.env.API_FOLDER_NAME || 'api'
    }
}