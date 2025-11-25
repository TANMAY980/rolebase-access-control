const mongoose=require('mongoose');
const {Schema,model}=mongoose;

const UserSchema=new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    phone:{type:String,required:true},
    address:{type:String,required:true},
    password:{type:String,required:true},
    role:{type:String,enum:["admin","manager","employee"]},
    isDeleted:{type:Boolean,default:false}
},{timestamps:true,versionKey:false});
const usermodel= model ("user",UserSchema);
module.exports=usermodel;