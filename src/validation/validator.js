const isValid = (value)=>{
    if(typeof value === "undefined"|| value === null) return false
    if(typeof value === "string" && value.trim().length===0) return false
    return true
}

const unique = async (model, ...key)=>{
    const data = await  model.findOne({$or : [...key]})
    if(data){

        return "duplicate" ;
    }else{
        return ;
    }
}

module.exports = { isValid, unique}


