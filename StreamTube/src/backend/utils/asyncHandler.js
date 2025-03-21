

const asyncHandler=(requestHandler)=>{
    return (req,res , next)=>{
    
        Promise.resolve(requestHandler(req,res,next)).catch(next)
     }
        
    }
    
    export {asyncHandler}
    
    
    
    
    // const asyncHandler = ()=>{}
    // // higher orer function-->a function accept function and return function
    // const asyncHandler=(func)=>{()=>{}}
    // const asyncHandler=(func)=>()=>{}
    // const asyncHandler=(func)=>async()=>{}
    
    // wrapper function to use everywhere using try catch
    // const asyncHandler=(fn)=>async(req, res, next)=>{
    //     try {
    //         await fn(req,res,next)
    //     } catch (error) {
    //         res.status(err.code || 500).json({
    //             success : false,
    //             message : err.message
    //         })
            
    //     }
    // }
    
    
    
    