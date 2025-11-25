const mongoose=require('mongoose');
const MONGO_URL=`${process.env.DB_CONNECTION}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_DATABASE_NAME}`
class Db{
    async DbConnection(){
        try {
            const db=await mongoose.connect(MONGO_URL)
            if(db){
                console.log(`db connected with application successfully`);
            }else{
                console.log("Failed to connect with the Db");
            };
        } catch (error) {
            console.log(error); 
        }
    }
};
module.exports=new Db()