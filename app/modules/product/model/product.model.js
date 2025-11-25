const mongoose=require('mongoose');
const {Schema,model}=mongoose;

const ProductSchema=new Schema({
    name:{type:String},
    price:{type:Number},
    isDeleted:{type:Boolean,default:false}
},{timestamps:true,versionKey:false});
const productmodel=model("product",ProductSchema);
module.exports=productmodel;