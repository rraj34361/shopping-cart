const isValid = (value)=>{
    if(typeof value === "undefined"|| value === null) return false
    if(typeof value === "string" && value.trim().length===0) return false
    return true
}

const unique = async (model, ...key)=>{
    try {
        const data = await  model.findOne({$or : [...key]})
    console.log(data)
    if(data){
        return false ;
    }else{
        return true;
    }
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = { isValid, unique}


