import express from "express";
import { getUserByEmail, createUser } from "../db/users";
import { authentication, random } from "../helpers";


export const login = async(req: express.Request, res: express.Response) =>{
    try{
        const { email, password} = req.body;

        if(!email || !password){
            return res.status(400).send({message:"invalid credintials."})
        }
        const user = await getUserByEmail(email).select('+Authentication.salt +Authentication.password');

        if(!user){
            return res.status(400).send({message:"please signIn before login"})
        }

        const expectedHash = authentication(user.Authentication.salt, password);

        if(user.Authentication.password != expectedHash){
            res.status(403).send({message:"invalid credintials"})
        }
        const salt = random();
        user.Authentication.sessiontoken = authentication(salt, user._id.toString())
        await user.save();

        res.cookie('EDDY-AUTH', user.Authentication.sessiontoken, {domain:'localhost', path:'/'});
        return res.status(200).json(user).end()
        

    }catch(error){
        console.log(error);
        return res.sendStatus(400)
    }
}

//////logout part 
export const logout = async (req: express.Request, res: express.Response) => {
    try {
      res.clearCookie('EDDY-AUTH', { domain: 'localhost', path: '/' });
      console.log('User logged out:');
      return res.status(200).send({message:"Logged out successfully."});
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
  }

////sign in part 

export const register = async(req:express.Request, res:express.Response)=>{
    try{
        const{email, password, username}= req.body
        console.log(req.body)
        if(!email || !password || !username){
            return res.status(400).send({message:"forbidden."})
        }

        const existingUser = await getUserByEmail(email);
        if (existingUser){
            console.log('existing')
            return res.status(400).send({message:"user already exist."})
        }
        const salt = random();
        const user = await createUser({
            email,
            username,
            Authentication:{
                salt,
                password: authentication(salt, password )
            }
        }) 

        return res.status(200).send({message:"user successfully registered."});

    }catch(error){
        console.log(error)
        return res.sendStatus(400)
    }
}