const jobs = require('../model/jobModel');


exports.addJobController=async(req,res)=>{
    const {tittle,location,jType,salary,qualification,experience,description}=req.body
    console.log(tittle,location,jType,salary,qualification,experience,description);
    try{
        const existingJob=await jobs.findOne({tittle,location})
    if(existingJob){
        res.status(400).json("job Already Exists.....")
    }else{
        const newJob=new jobs({tittle,location,jType,salary,qualification,experience,description})
        await newJob.save()
        res.status(200).json(newJob)
    }
    }
    catch(err){
        res.status(500).json(err)
    }
    
}

// get all jobs 

exports.getAllJobController=async (req,res)=>{
    const searckKey=req.query.search
    try{
        const alljobs=await jobs.find({tittle:{$regex:searckKey,$options:'i'}})
        res.status(200).json(alljobs)
    }
    catch(err){
        res.status(500).json(err)
    }
}

// exports.getAllJobsController=async(req,res)=>{
//     const searchkey=req.query.searchkey
//     try{
//         const alljobs= await jobs.find({tittle:{$regex:searckKey,$options:'i'}})
//     }
//     catch(err){

//     }
// }

//  delete a job

 exports.deleteAJobController=async(req,res)=>{
     const{id}=req.params
     try{
        await jobs.findByIdAndDelete({_id:id})
        res.status(200).json("deleted successfully")
    }
    catch(err){
        res.status(500).json(err)
    }
}

