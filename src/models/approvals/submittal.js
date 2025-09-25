import mongoose from "mongoose";

const submittalPhase = new mongoose.Schema({
    title:{
        type:String,
        unique:true 
    }
});

const submittalSchema = new mongoose.Schema({
    submittalType:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubmittalType" 
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubmittalPhase"
    },
    title:{
        type:String 
    },
    requestedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Member"
    },
    requestedTo:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Member"
        }
    ],

})

const Submittal =  mongoose.models.Submittal || mongoose.model("Submittal",submittalSchema);
const SubmittalPhase = mongoose.models.submittalPhase || mongoose.model("SubmittalPhase",submittalPhase);

export {Submittal,SubmittalPhase};