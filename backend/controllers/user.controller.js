import User from '../models/user.js';
import Profile from '../models/profile.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import PDFdocument from 'pdfkit';
import fs from 'fs';
import ConnectionRequest from '../models/connection.js';

const convertUserDataToPDF = async(userData)=>{

    const doc = new PDFdocument();
    const outputPath = crypto.randomBytes(16).toString('hex') + '.pdf';

    const stream = fs.createWriteStream("./uploads/"+outputPath);
    doc.pipe(stream);

    doc.image(`./uploads/${userData.userId.profilePicture}` , {align:'center',width:100,height:100});
    doc.fontSize(14).text(`name: ${userData.userId.name}`);
    doc.fontSize(14).text(`username: ${userData.userId.username}`);
    doc.fontSize(14).text(`email: ${userData.userId.email}`);
    doc.fontSize(14).text(`bio: ${userData.bio}`);
    doc.fontSize(14).text(`currentPosition: ${userData.currentPost}`);
    
    doc.fontSize(14).text("Past work:")
    userData.pastWork.forEach((work,index)=>{
        doc.fontSize(14).text(`comapny: ${work.company}`);
        doc.fontSize(14).text(`Position: ${work.position}`);
        doc.fontSize(14).text(`workDuration: ${work.years}`);
    })
    doc.end();
    return outputPath
}

export const register = async (req,res)=>{
   try{
         const {name , email ,username,password} = req.body;
         if(!name || !email || !username || !password){
            return res.status(400).json({message:"All fields are required"});
         }
         const user = await User.findOne({email});
         if(user){
            return res.status(400).json({message:"User already exists"});
         }
         
         const hashedPassword = await bcrypt.hash(password,10);
         const newUser = new User({name,email,username,password:hashedPassword});
         await newUser.save();
         const profile = new Profile({userId:newUser._id});
         await profile.save();

         return res.json({message:"User registered successfully"});
   }catch(err){
      return res.status(500).json({message:err.message});
   }
}

export const login = async (req,res)=>{
   try{
      const {email,password} = req.body;
      if(!email || !password){
         return res.status(400).json({message:"All fields are required"});
      }
      const user = await User.findOne({email});
      if(!user){
         return res.status(404).json({message:"User does not exist"});
      }
      const isMatch = await bcrypt.compare(password,user.password);
      if(!isMatch){
         return res.status(400).json({message:"Invalid credentials"});
      }
      const token = crypto.randomBytes(32).toString('hex');
      await User.updateOne({_id:user._id},{token});

      return res.json({message:"User logged in successfully" , token});
   }catch(err){
      return res.status(500).json({message:err.message});
   }
}

export const uploadProfilePicture = async (req,res)=>{
   const {token} = req.body;
    try{
        const user = await User.findOne({token});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        user.profilePicture = req.file.filename;
        await user.save();
        return res.json({message:"Profile picture uploaded successfully", profilePicture: req.file.filename});
   }catch(err){
      return res.status(500).json({message:err.message});
   }
}

export const updateUserProfile = async (req,res)=>{

    try{
        const {token , ...newUserData} = req.body;
        const user = await User.findOne({token});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const {username , email} = newUserData;
        const existingUser= await User.findOne({$or:[{username},{email}]});
        if(existingUser){
            if(existingUser || String(existingUser._id) !== String(user._id)){
                        //existingUser._id = id of the user we found in DB.
                        //user._id = id of the current logged-in user we’re updating.
                        //If these two IDs are different, it means another person already has that username/email → not allowed.
               return res.status(400).json({message:"Username or email already taken"});
            }
        }
        Object.assign(user,newUserData);
        await user.save();
        return res.json({message:"User updated successfully", user});
    }catch(err){
      return res.status(500).json({message:err.message});
    }
}

export const getUserAndProfile = async (req,res)=>{
   try{
      const {token} = req.query;
      const user = await User.findOne({token});
        if(!user){  
            return res.status(404).json({message:"User not found"});
        }
        const userProfile = await Profile.findOne({userId:user._id}).populate('userId','name email username profilePicture');
        return res.json({message:"User and profile fetched successfully", userProfile});
   }catch(err){
      return res.status(500).json({message:err.message});
   }
}

export const updateProfile = async (req,res)=>{
   try{
      const {token , ...newProfileData} = req.body;
      const userProfile = await User.findOne({token});
      if(!userProfile){
         return res.status(404).json({message:"User not found"});
      }
      const profile_to_update = await Profile.findOne({userId:userProfile._id});

      Object.assign(profile_to_update,newProfileData);
      await profile_to_update.save();
      return res.json({message:"Profile updated successfully", profile_to_update}); 
    }catch(err){
      return res.status(500).json({message:err.message});
   }
}   

export const getAlluserProfiles = async (req,res)=>{
   try{
      const allProfiles = await Profile.find().populate('userId','name email username profilePicture');
      return res.json({message:"All profiles fetched successfully", allProfiles});
   }catch(err){
      return res.status(500).json({message:err.message});
   }
}

export const downloadProfile = async (req,res)=>{
    try{
        const user_Id = req.query.id;
        const userProfile = await Profile.findOne({userId : user_Id}).populate('userId','name email username profilePicture');

        let outputPath= await convertUserDataToPDF(userProfile);
        res.json({message: outputPath});
    }catch(err){
        return res.status(500).json({message:err.message});
    }
}

export const sendConnectionRequest = async (req,res)=>{
   
    const {token , connectionId} = req.body;
    try{
      const user = await User.findOne({token});
      if(!user){
         return res.status(404).json({message:"User not found"});
      } 
      const connectionUser = await User.findOne({_id:connectionId});
      if(!connectionUser){
         return res.status(404).json({message:"Connection user not found"});
      }

      const existingRequest = await ConnectionRequest.findOne(
        {
           userId:user._id, 
           connectionId: connectionUser._id
       }
    );
      if(existingRequest){
         return res.status(400).json({message:"Connection request already sent"});
      }
     
      const newConnectionRequest = new ConnectionRequest({
         userId: user._id,
         connectionId: connectionUser._id
      });
      await newConnectionRequest.save();
      return res.json({message:"Connection request sent successfully"});
   }catch(err){
      return res.status(500).json({message:err.message});
   }
}

export const getMyConnectionRequests = async (req,res)=>{
   const {token} = req.query;
   try{
      const user = await User.findOne({token});
      if(!user){
         return res.status(404).json({message:"User not found"});
      }
      const connections = await ConnectionRequest.find({userId:user._id})
      .populate('connectionId','name email username profilePicture');

       return res.json({message:"Connection requests fetched successfully", connections});
    }catch(err){        
        return res.status(500).json({message:err.message});
    }
}

export const whatAreMyConnections = async (req,res)=>{
   const {token} = req.query;
   try{
      const user = await User.findOne({token});
      if(!user){
         return res.status(404).json({message:"User not found"});
      }
      const connections = await ConnectionRequest.find({connectionId:user._id})
      .populate('userId','name email username profilePicture');

       return res.json(connections);
    }catch(err){        
        return res.status(500).json({message:err.message});
    }
}   

export const acceptConnectionRequest = async (req,res)=>{
   const {token , requestId , action_type }  = req.body;
   try{
      const user = await User.findOne({token});
      if(!user){
         return res.status(404).json({message:"User not found"});
      }
    const connection = await ConnectionRequest.findOne({_id:requestId});
    if(!connection){
            return res.status(404).json({message:"Connection request not found"});
        }

    if(action_type === 'accept'){
         connection.status_accepted = true;
    }else{
         connection.status_accepted = false;
    }
    await connection.save();
    return res.json({message:"Connection request updated successfully", connection});

   }catch(err){
      return res.status(500).json({message:err.message});
   }
}

export const getUserProfileAndUserBasedOnUsername = async(req ,res)=>{
   const {username }= req.query;

   try{
      const user = await User.findOne({username});
      if(!user){
         return res.status(404).json({message:"User not found"});
      }

      const userProfile = await Profile.findOne({userId : user._id}).populate("userId" , "name username email profilePicture")
      return res.json({"profile": userProfile})
   }catch(err){
      return res.status(500).json({message:err.message})
   }
}