const mongoose=require('mongoose')

const jobSchema=new mongoose.Schema({
    title: { type: String, required: true },
    location:{
        type:String,
        required:true
    },
    jType:{
        type:String,
        required:true
    },
    salary:{
        type:String,
        required:true
    },
    qualification:{
        type:String,
        required:true
    },
    experience:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
})

const jobs=mongoose.model("jobs",jobSchema)
module.exports=jobs