const express = require("express");
const {User} = require("../../../models/");
const { json } = require("express");

const userData = {}

userData.transfer = async(req,res) => {
    try{
        let amount = req.body.nTokens;
        let id = req.body.sUserId;
        console.log(amount);
        console.log(id);
        const oData = new User({
            sUserId:id,
            nTokens:amount
        })

        const result = await oData.save();

        if(!result){
            return res.status(400).send("Error in Transaction..");
        }
        else{
            return res.status(200).send("Transaction is Done");
        }
    }
    catch(error){
        console.log(error);
    }
}

module.exports = {userData};