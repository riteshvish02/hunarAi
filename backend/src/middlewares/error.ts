import {Request,Response,NextFunction} from 'express';
const error = async (err:any,req:Request,res:Response)=>{
   return res.json({error:err})
}
export default error;