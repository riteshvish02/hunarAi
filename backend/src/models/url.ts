import mongoose  from 'mongoose';

const urlSchema = new mongoose.Schema({
    original:String,
    short:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
})

const url = mongoose.model("url",urlSchema);
export default url;