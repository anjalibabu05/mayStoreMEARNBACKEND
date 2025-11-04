const appMiddleware=(req,res,next)=>{
    // logic

    console.log('Inside application specific midileware');
    next()
    
}
module.exports=appMiddleware