const mongoose = require("mongoose");
const express = require("express");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        validate(value){
            if(value.length < 3){
                throw new Error("Please input 3 or more characters");
            }
        }
    },

    email : {
        type : String,
        required : true,
        unique : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email");
            }
        }
    },

    password : {
        type : String,
        required : true,
        validate(value){
            if(value.length < 8){
                throw new Error("Please input 8 or more characters");
            }
        }
    },

    followers : {
        type : Array,
        default : []
    },

    followings : {
        type : Array,
        default : []
    },

    isAdmin : {
        type : Boolean,
        default : false
    },

    desc: {
        type: String,
        validate(value) {
            if (value.length > 50) {
                throw new Error("Please enter description less than 50 characters");
            }
        }
    },

    city: {
        type: String,
        validate(value) {
            if (value.length > 50) {
                throw new Error("Please enter city name less than 50 characters");
            }
        }
    },

    from: {
        type: String,
        validate(value) {
            if (value.length > 50) {
                throw new Error("Please enter from name less than 50 characters");
            }
        }
    },

    relationship: {
        type: Number,
        enum: [1, 2, 3],
        default : 1
    }

})

const model = mongoose.model("User",userSchema);

module.exports = model;