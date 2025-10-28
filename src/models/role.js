import mongoose from "mongoose";


const roleSchema = new mongoose.Schema({
    roleName:{
        type:String,
        required:true
    },
    roleNameKey:{type:String},
    isCopy:{
        status:{type:Boolean},
        ParentRole:{type:String}
    },
    status:{type:String,default:"Active"},
     Permissions:{
        type:Object,
    }
});

delete mongoose.models.Role
export default mongoose.models.Role || mongoose.model('Role',roleSchema);