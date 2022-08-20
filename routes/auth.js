const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const User = require("../models/User");

const router = express.Router();

//Post A User
router.post("/",async (req,res) => {

    try {
        
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            username : req.body.username,
            email : req.body.email,
            password : hashedPassword
        })

        const createdUser = await user.save();
        
        console.log("Created User : " +createdUser);

        res.status(200).json({
            "msg" : "User created successfully",
            "User" : createdUser
        })
    }
    catch(error){
        console.log(error.message);
        res.status(500).json({
            "msg" : "There is an error while storing the data",
            "Error" : error
        })
    }
    
})

//Get All Users
router.get("/",async (req,res) => {
    try{
        const allUsers = await User.find({});

        const allUsersLength = allUsers.length;

        if(allUsersLength > 0){
            console.log("All Users Length : "+allUsersLength);
            console.log("All users : " +allUsers);

            res.status(200).json({
                "msg" : "All Users List",
                "All users" : allUsers
            })
        }
        else{
            res.status(404).json({
                "msg" : "No records found",
            })
        }
        
    }
    catch(err){
        console.log(error.message);
        res.status(500).json({
            "msg" : "There is an error while fetching the data",
            "Error" : error
        })
    }
    
})

//Get Particular User By Key
router.get("/particularUser",async (req,res) => {
    try{
        const allUsers = await User.find({"username" : "smithapani"});

        const allUsersLength = allUsers.length;

        if(allUsersLength > 0){
            console.log("All Users Length : "+allUsersLength);
            console.log("All users : " +allUsers);

            res.status(200).json({
                "msg" : "All Users List",
                "All users" : allUsers
            })
        }
        else{
            res.status(404).json({
                "msg" : `No records found for given username`,
            })
        }
        
    }
    catch(err){
        console.log(error.message);
        res.status(500).json({
            "msg" : "There is an error while fetching the data",
            "Error" : error
        })
    }
    
})

//Update A User
router.put("/:id", async (req, res) => {
    try{
        const id = req.params.id;
        console.log("Id : " + id);

        const found = await User.findById({ _id : id });
        console.log("Found : " + found);

        if (found) {
            let updatedUser = await User.findOneAndUpdate({ _id: id }, req.body, { new: true });

            console.log("Updated User : " + updatedUser);

            res.status(200).json({
                "msg": "User updated successfully",
                "Updated user : " : updatedUser
            })
        }
        else {
            res.status(404).json({
                "msg": `No records found for given id`,
            })
        }
        
    }
    catch(error){
        console.log(error.message);
        res.status(500).json({
            "msg" : "There is an error while updating the data",
            "Error" : error
        })
    }
    
   
})

//Delete A User
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        console.log("Id : " + id);

        const found = await User.findById({ _id: id });
        console.log("Found : " + found);

        if (found) {
            let deletedUser = await User.findByIdAndRemove({ _id: id });

            console.log("Deleted User : " + deletedUser);

            res.status(200).json({
                "msg": "User deleted successfully",
                "Deleted user : ": deletedUser
            })


        }
        else {
            res.status(404).json({
                "msg": `No records found for given id`,
            })
        }
    }
    catch (error) {
        console.log(error.message);

        res.status(500).json({
            "msg" : "There is an error while deleting the data"
        })
    }
    
})

//Login
router.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userObj = await User.findOne({ email : req.body.email });
        console.log("User Object : " +userObj);

        if (userObj) {
            const match = await bcrypt.compare(req.body.password, userObj.password);
            console.log("Inside userobj");
            console.log(match);

            if (match) {
                res.status(200).json({
                    "msg": "User logged in successfully"
                })
            }
            else {
                res.status(404).json({
                    "msg": "Password does not match"
                })
            }
        }
        else {
            res.status(404).json({
                "msg": "Email id not registered"
            })
        }
    }
    catch (error) {
        console.log(error.message);

        res.status(500).json({
            "msg": "There is an error while login"
        })
    }
    
})

//Follow
router.put("/:id/follow", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        console.log("User : " + user);
        
        const currentUser = await User.findById(req.body.userId);
        console.log("Current User : " + currentUser);

        //First check both should not be same user

        if (req.params.id !== req.body.userId) {

            //Then check not already follow

            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                res.send("User Followed");
            }
            else {
                res.status(403).json({
                    "msg": "You can't follow same user again"
                })
            }
        }

        else {
            res.status(403).json({
                "msg": "You can't follow yourself"
            })
        }
    }
    catch (error) {
        console.log(error.message);

        res.status(500).json({
            "msg": "There is an error while following an user"
        })
    }
    
})  

//Unfollow
router.put("/:id/unfollow", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        console.log("User : " + user);

        const currentUser = await User.findById(req.body.userId);
        console.log("Current User : " + currentUser);

        if (req.params.id !== req.body.userId) {
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                res.send("User unfollowed");
            }
            else {
                res.status(403).json({
                    "msg": "You are not following specified user"
                })
            }
        }

        else {
            res.status(403).json({
                "msg": "You can't unfollow yourself"
            })
        }
    }
    catch (error) {
        console.log(error.message);

        res.status(500).json({
            "msg": "There is an error while unfollowing an user"
        })
    }
    
})

module.exports = router;

