const BaseRepository=require('../../../helper/base.Repository');
const usermodel=require('../model/user.model');

class adminRepository extends BaseRepository{
    constructor(){
        super(usermodel)
    };

    
};
module.exports=new adminRepository();