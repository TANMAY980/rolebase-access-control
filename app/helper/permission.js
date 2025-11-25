const statusCode=require('../../app/config/status.code');
const roles=require('../config/roles.json');
class Permission{

    async PermissionByRoleName(roleName){
        try {
            const role=roles.roles.find((role)=>role.name === roleName);
            return  role ? role.permissions : [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }
};
module.exports=new Permission();