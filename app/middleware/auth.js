const bcrypt=require('bcryptjs');
const statusCode=require('../config/status.code');
const checkpermission=require('../helper/permission');
const jwt=require('jsonwebtoken');
class authentication{

    async encryptPassword(password){
        try {
            const salt=10;
            const encrypt=await bcrypt.hash(password,salt);
            if(encrypt){
                return encrypt
            }
            return false
        } catch (error) {
            console.log(error); 
        }
    };

    async checkpassword(password,userpass){
        try {
             
            const validpass=await bcrypt.compare(password,userpass);
            if(!validpass){
                return false
            };
            return true
        } catch (error) {
            console.log(error);
            throw error
        }
    };

    async authcheck(req,res,next){
        const token= req.headers["authorization"]?.startsWith("Bearer ")?
         req.headers["authorization"].split(" ")[1] : req.headers["x-access-token"] ||
          req.body.token ||
          req.query.token;
            if(!token){
                return res.status(statusCode.forbidden).json({status:false,message:"token not found"})
            };

        try {
            const decoded= jwt.decode(token);
            const checkuser=(decoded.role==="admin")?process.env.ADMIN_TOKEN:(decoded.role==="manager")?process.env.MANAGER_TOKEN:process.env.EMPLOYEE_TOKEN
            const usertoken=jwt.verify(token,checkuser);
            req.user=usertoken;
            return next();

        } catch (error) {
            console.log(error);
            return res.status(statusCode.InternalServerError).json({status:"false",messaege:error.message})
        }
    };

    checkPermission(permission) {
    return async (req, res, next) => {
        try {
            const user = req.user;

            if (!user) {
                return res.status(statusCode.badRequres).json({ status: false, message: "Invalid user information" });
            }

            const role = user.role;
            const getpermission =await checkpermission.PermissionByRoleName(role);

            if (getpermission.includes(permission)) {
                return next();
            }

            return res.status(statusCode.forbidden).json({ status: false, message: "Access Denied" });

        } catch (error) {
            console.log(error);
            return res.status(statusCode.InternalServerError).json({ status: false, message: error.message });
        }
    };
}

};
module.exports=new authentication();