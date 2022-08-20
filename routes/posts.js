const express = require("express");
const mongoose = require("mongoose");
const Post = require("../models/Post");
const User = require("../models/User");

const router = express.Router();

//Post A Post
router.post("/",async (req,res) => {

    try {

        const post = new Post({
            userId : req.body.userId,
            name : req.body.name,
            description : req.body.description
        })

        const createdPost = await post.save();
        
        console.log("Created Post : " +createdPost);

        res.status(200).json({
            "msg" : "Post created successfully",
            "Post" : createdPost
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

//Get A Post
router.get("/",async (req,res) => {
    try{
        const allPosts = await Post.find({});

        const allPostsLength = allPosts.length;

        if(allPostsLength > 0){
            console.log("All Posts Length : "+allPostsLength);
            console.log("All Posts : " +allPosts);

            res.status(200).json({
                "msg" : "All Posts List",
                "All posts" : allPosts
            })
        }
        else{
            res.status(404).json({
                "msg" : "No records found",
            })
        }
        
    }
    catch(error){
        console.log(error.message);
        res.status(500).json({
            "msg" : "There is an error while fetching the data",
            "Error" : error
        })
    }
    
})

//Update A Post
router.put("/:id", async (req, res) => {
    try{
        const id = req.params.id;
        console.log("Id : " + id);

        const found = await Post.findById({ _id : id });
        console.log("Found : " + found);

        if (found) {
            let updatedPost = await Post.findOneAndUpdate({ _id: id }, req.body, { new: true });

            console.log("Updated Note : " + updatedPost);

            res.status(200).json({
                "msg": "Post updated successfully",
                "Updated post : " : updatedPost
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

//Delete A Post
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        console.log("Id : " + id);

        const found = await Post.findById({ _id: id });
        console.log("Found : " + found);

        if (found) {
            let deletedPost = await Post.findByIdAndRemove({ _id: id });

            console.log("Deleted post : " + deletedPost);

            res.status(200).json({
                "msg": "Post deleted successfully",
                "Deleted post : ": deletedPost
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

//Get My Posts, My Following's post
router.get("/timeline",async (req,res) => {
    const currentUser = await User.findOne({_id : req.body.userId });
    console.log(currentUser);
    console.log(currentUser._id);

    console.log("-----");

    const currentUsersPosts = await Post.find({ userId : currentUser._id });
    console.log(currentUsersPosts);

     console.log("-----");

     console.log(currentUser.followings);

    /* 
    const friendsPosts = await Promise.all(currentUser.followings.map((friendId) => {
       return Post.find({ userId: friendId });
    }));

    console.log(friendsPosts);

    res.send(currentUsersPosts.concat(friendsPosts));
    */

    const myFollowings = currentUser.followings.map((friendId) => {
        return friendId
    })

    const myFollowingsPosts = await Post.find({userId : friendId});

    console.log(myFollowingsPosts);

    res.send(currentUsersPosts.concat(myFollowingsPosts));

})

module.exports = router;