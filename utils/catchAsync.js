module.exports = func => {
    return (req,res,next)=>{
        func(req,res,next).catch(next);
    }
}
//accept function
//return that function with catch