import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
   title:String,
   content: String,
   likes:{
      type:Number,
      default: 0
   },
   comments: [{text:String}],
});

const Post = mongoose.model('Post', postSchema)

export default Post;

