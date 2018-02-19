var mongoose=require("mongoose");

var Campground_schema=new mongoose.Schema({
    name:String,
    image:String,
    description:String,
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});
module.exports=mongoose.model("Campground",Campground_schema);
