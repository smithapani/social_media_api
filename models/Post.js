const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");

const postSchema = new mongoose.Schema({
    userId : {
        type : String,
        required : true
    },

    name: {
        type : String,
        required : true
    },

    description: {
        type: String,
        required : true
    },

    likes : {
        type : Array,
        default : []
    }

})

const model = mongoose.model("Post", postSchema);

module.exports = model;