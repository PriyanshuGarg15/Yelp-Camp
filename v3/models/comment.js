var mongoose=require("mongoose");
var Comment_schema=new mongoose.Schema({
    text:String,
    author:String,
});
module.exports=mongoose.model("Comment",Comment_schema);
