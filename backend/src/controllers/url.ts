import { Request, response, Response } from 'express';
import catchAsyncError  from '../middlewares/catchAsync';
import url from '../models/url';
import user from '../models/user'
export const createUser = catchAsyncError(async (req: Request, res: Response) => {
   const newuser = await user.create({
    name:"ritesh",
    email:"rv",
    password:"123"
   })
   return res
   .status(201)
   .json({message:"hello",newuser})
});

export const createUrls = catchAsyncError(async (req: Request, res: Response) => {
   const newurl = await url.create({
    original:"riteshvish.vercel.app",
    short:"xmckdkdk",
    user:"6a7843899f5682a5485cec10"
   })
   const userfind = await user.findById("6a7843899f5682a5485cec10");
   if(userfind){
    userfind.urls.push(newurl._id);
    await userfind.save();
   }

   return res 
   .status(201)
   .json({message:"hello",userfind})
});
