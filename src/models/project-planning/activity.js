import mongoose, { Types } from "mongoose";

const ActivityResource = new mongoose.Schema({
    type:{
        type:String,
        enum:["Labour","Material","Non Labour","Product"],
        required:true 
    },
    name:{
        type:String,
    },
    unit:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Unit" 
    },
    durationType:{
        type:String
    },
    duration:{
        type:Number 
    },
    startDate:{
        type:Date 
    },
    endDate:{
        type:Date 
    },
    budgetedUnit:{
        type:Number 
    },
    budgetedCost:{
        type:Number 
    },
    activityNo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ActivitySchema"
    }
})

const Relationship = new mongoose.Schema({
    type:{
        type:String,
        enum:["Predecessor","Successor"],
        required:true 
    },
    relationship:{
        type:String,
        enum:["Finish to Start","Start to Finish","Finish to Finish"]
    },
    wbs:{
        type:String 
    },
    activity:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ActivitySchema"
    },
    lead:{
        type:String
    }

});

const ActivityExpense = new mongoose.Schema({
    category:{
        type:String,
        enum:["Service","Material","other"],
        required:true 
    },
    item:{
        type:String 
    },
    accuralType:{
        type:String,
        enum:["Service","Material","Other"]
    },
    budgetedUnit:{
        type:Number 
    },
    price:{
        type:Number 
    }
});

const Risk =new mongoose.Schema({

});

const activitySchema = new mongoose.Schema({
    wbs:{
        type:String,
        required:true 
    }, 
    title:{
        type:String
    },
    startDate:{
        type:String
    },
    duration:{
        type:String
    },
    endDate:{
        type:String
    },
    priority:{
        type:String,
        enum:["low","high","medium"]
    },
    assignTo:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Member"
        }
    ],
    description:{
        type:String
    },
    attachment:{
        name:{type:String},
        path:{type:String}
    },
    projectId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Project"
    },
    status:{
        type:String,
    },
    completionStatus:{
        type:Number,
    }

},{timestamps:true});

export default mongoose.models.ActivitySchema || mongoose.model('ActivitySchema',activitySchema);

