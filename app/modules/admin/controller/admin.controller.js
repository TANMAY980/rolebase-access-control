const statusCode=require('../../../config/status.code');
const adminRepository = require('../repository/admin.repository');
const auth=require('../../../middleware/auth');
const jwt=require('jsonwebtoken');

class admin{

    async register(req,res){
        try {
            const{name,email,phone,address,role,password}=req.body;
            if(!name || !email || !phone || !address || !role || !password){
                return res.status(statusCode.forbidden).json({status:false,message:"Please fill all inputs field"});
            }
            const checkexist=await adminRepository.getByField({email});
            if(checkexist){
                return res.status(statusCode.notFound).json({status:false,message:"User already exist"})
            };
            const encryptpassword=await auth.encryptPassword(password);
            if(!encryptpassword){
                return res.status(statusCode.badRequres).json({status:false,message:"Something went wrong"})
            };
            const user={name,email,phone,address,role,password:encryptpassword}
            const saveuser=await adminRepository.save(user);
            if(saveuser){
                return res.status(statusCode.created).json({status:true,message:"user registered successfully",data:saveuser})
            };
            return res.status(statusCode.badRequres).json({Status:false,message:"Failed to register user"})
        } catch (error) {
            console.log(error);
            return res.status(statusCode.InternalServerError).json({status:true,message:error.message});  
        }
    };

    async login(req,res){
        try {
            const{email,password}=req.body;
            if(!email ||!password){
                return res.status(statusCode.forbidden).json({status:false,message:"Please fill all inputs field"});
            };
            const checkexist=await adminRepository.getByField({email});
            if(!checkexist){
                return res.status(statusCode.notFound).json({status:false,message:"User need to register first"})
            };
            const checkpassword=await auth.checkpassword(password,checkexist.password);
            
            if(!checkpassword){
                return res.status(statusCode.badRequres).json({status:false,message:"Password didn't matched"})
            };
            const token=jwt.sign({
                _id:checkexist._id,
                role:checkexist.role,
                email:checkexist.email
            },(checkexist.role==="admin")? process.env.ADMIN_TOKEN : (checkexist.role==="manager")?process.env.MANAGER_TOKEN:process.env.EMPLOYEE_TOKEN,{expiresIn:"15m"})

            if(!token){
                return res.status(statusCode.badRequres).json({status:false,message:"Failed TO login Please try again"})
            }
            (checkexist.role==="admin")? res.status(statusCode.created).json({status:true,message:"admin login successfully",token:token}): (checkexist.role==="manager")? res.status(statusCode.created).json({status:true,message:"manager login successfully",token:token}): res.status(statusCode.created).json({status:true,message:"employee login successfully",token:token})
        } catch (error) {
            console.log(error.message);
            
            return res.status(statusCode.InternalServerError).json({status:true,message:error.message});
        }
    };
};
module.exports= new admin()