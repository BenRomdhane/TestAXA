import api from '../api'
const express = require("express");

module.exports = () => {
  const app = new express.Router();

  app.get("/", function(req, res) {
    console.log("test")
    res.render("index");
  });
  app.get("/api",(req,res)=>{
   res.json(api())
  })

  return app;
};
