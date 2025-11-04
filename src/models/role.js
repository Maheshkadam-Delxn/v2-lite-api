
import mongoose from "mongoose";


const roleSchema = new mongoose.Schema({
    name:{
        type:String,
         enum:["contractor","site_manager","manager","approver","consultant","project_admin"],
        required:true
    },
    permissions:[permissionSchema]
});
delete mongoose.models.Role;

export default mongoose.models.Role || mongoose.model('Role',roleSchema);