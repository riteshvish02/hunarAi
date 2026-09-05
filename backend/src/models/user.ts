import mongoose ,{Document,Schema} from 'mongoose';

interface User extends Document {
    name:String,
    email:String,
    password:String,
    age:Number,
    urls:mongoose.Types.ObjectId[]

}

const userSchema = new Schema<User>({
   name:String,
   email:String,
   password:String,
   urls:[
    {
      type:Schema.Types.ObjectId,
      ref:'url'
    }
   ]
})

const user = mongoose.model("user",userSchema);
export default user;