const BaseRepository=require('../../../helper/base.Repository');
const productmodel=require('../model/product.model');
class productRepository extends BaseRepository{
    constructor(){
        super(productmodel)
    };

    async getdetails(filter){
        try {
            const data= await productmodel.aggregate([
                {
                    $match:filter
                },
                {
                    $project:{
                        _id:0,
                        name:1,
                        price:1
                    }
                }
            ])
            
            return data.length ? data[0] : null ;
        } catch (error) {
            throw error
        }
    };

    async getall(filter){
        try {
            const data= await productmodel.aggregate([
                {
                    $match:filter,
                },
                {
                    $project:{
                        _id:0,
                        name:1,
                        price:1
                    },
                }
        ]);
        return data.length ? data : null
        } catch (error) {
            console.log(error);
            throw error
        }
    }
};
module.exports=new productRepository();