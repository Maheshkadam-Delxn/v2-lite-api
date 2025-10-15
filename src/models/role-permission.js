import mongoose, { Schema } from "mongoose";

const rolePermissionSchema = new Schema({
    roleID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Role"
    },
    moduleID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Module"
    },
    create:{
        type:Boolean,
        default:false 
    },
    update:{
        type:Boolean,
        default:false 
    },
    delete:{
        type:Boolean,
        default:false 
    },
    view:{
        type:Boolean,
        default:false 
    }
})

rolePermissionSchema.index({roleID:1,moduleID:1},{unique:true});

export default mongoose.models.RolePermission || mongoose.model("RolePermission",rolePermissionSchema);