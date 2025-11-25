const statusCode=require('../../../config/status.code');
const productRepository=require('../repository/product.repository');
const mongoose=require('mongoose');

class Product{

    async create(req,res){
        try {
            const{name,price}=req.body;
            if(!name || !price){
                return res.status(statusCode.badRequres).json({status:false,message:"Require all the input fields"})
            }
            const chceckproduct=await productRepository.getByField({name});
            if(chceckproduct){
                return res.status(statusCode.conflictwithSource).json({status:false,message:"Product with same name already exsist"});
            }
            const product={name,price}
            const saveproduct=await productRepository.save(product);
            if(!saveproduct){
              return res.status(statusCode.badRequres).json({status:false,message:"Failed to create product"});  
            };
            return res.status(statusCode.created).json({status:true,message:"Product created Successfully",data:saveproduct})
        } catch (error) {
           return res.status(statusCode.InternalServerError).json({status:false,message:error.message}); 
        }
    };

    async getDetails(req,res){
        try {
            const productId=new mongoose.Types.ObjectId(req.params.id);
            if(!productId){
                return res.status(statusCode.badRequres).json({status:false,message:"Product Id not found"})
            }
            const getinfo=await productRepository.getdetails({_id:productId});
            if(!getinfo){
                return res.status(statusCode.badRequres).json({status:false,message:"Failed to Retrieve product details"});
            };
            return res.status(statusCode.success).json({status:true,message:"product details retrieved successfully",data:getinfo});
        } catch (error) {
            console.log(error);
            return res.status(statusCode.InternalServerError).json({status:true,message:error.message}); 
        }
    };

    async update(req,res){
        try {
            const productId=req.params.id;
            if(!productId){
                return res.status(statusCode.badRequres).json({status:false,message:"Product Id not found"});
            };
            const update=await productRepository.updateById(req.body,{_id:new mongoose.Types.ObjectId(productId)});
            if(!update){
                return res.status(statusCode.badRequres).json({status:false,message:"Failed To update Product Details"})
            };
            return res.status(statusCode.created).json({status:true,message:"Successfully updated Product Details"})
        } catch (error) {
           return res.status(statusCode.InternalServerError).json({status:true,message:error.message});  
        }
    };

    async getalldetails(req,res){
        try {
            const data=await productRepository.getall({isDeleted:false})
            if(!data){
                return res.status(statusCode.badRequres).json({status:false,message:"Failed To retrieve all Products not found"});
            };
            return res.status(statusCode.success).json({status:true,message:"all products retrieved successfully",data:data})
        } catch (error) {
            console.log(error);
            return res.status(statusCode.InternalServerError).json({status:true,message:error.message})
        }
    };

    async delete(req,res){
        try {
           const productId= new mongoose.Types.ObjectId(req.params.id);
            if(!productId){
                return res.status(statusCode.badRequres).json({status:false,message:"Product Id not found"})
            }
            const deleteproduct=await productRepository.deleteById({_id:productId});
            if(!deleteproduct){
                return res.status(statusCode.badRequres).json({status:false,message:"Failed to delete product details"});
            };
            return res.status(statusCode.success).json({status:true,message:"product details deleted successfully"}) 
        } catch (error) {
             return res.status(statusCode.InternalServerError).json({status:true,message:error.message});
        }
    };

};
module.exports=new Product();