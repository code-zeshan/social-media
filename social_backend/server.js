import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import cors from "cors"
import multer from "multer"
import path from "path"
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 5000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
   destination: function (req, file, cb){
      cb(null, 'uploads/');
   },
   filename: function (req, file, cb){
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
   }
});

const upload = multer({storage: storage});

mongoose.connect('mongodb+srv://zeshancode:zeshancode@zeshancode.1u1ir.mongodb.net/Social-Media', {useNewUrlParser: true, useUnifiedTopology: true})
console.log("database connected!");


const postSchema = new mongoose.Schema({
   title: String,
   content: String,
   file: String,
   likes: { type: Number, default: 0 },
   comments: [{ text: String }],
})

const Post = mongoose.model('Post', postSchema);

app.use(bodyParser.json());

app.get("/api/posts", async(req,res)=>{
   try{
      const posts = await Post.find();
      res.json(posts);
   }
   catch(err){
      res.status(500).json({err: "Internal Server Error!"})
   }
})

app.post('/api/posts', upload.single('file'), async(req,res)=>{
   try{
      const {title, content} = req.body;
      const file = req.file ?req.file.filename :undefined; 
   
      if(!title || !content){
         return res.status(400).json({error: "Title and Content are required fields!"})
      }

      const post = new Post({title, content, file});
      await post.save();
      res.status(201).json(post);

   } catch(err){
      console.log("Error Creating Post", err);
      res.status(500).json({err: "Internal Server Error!"})
   }
});

app.post('/api/posts/like/:postId', async(req,res)=>{
   try{
      const postId = req.params.postId;
      const post = await Post.findById(postId);

      if(!post){
         return res.status(404).json({err: "Post not Found!"})
      }

      post.likes += 1;
      await post.save();

      res.json(post);
   }catch(err){
      console.log("Error liking post", err);
      res.status(500).json({err: "Internal Server Error!"})
   }
});

app.post('/api/posts/comment/:postId', async(req,res)=>{
   try{
      const postId = req.params.postId;
      const {text} = req.body;
      const post = await Post.findById(postId);

      if(!post){
         return res.status(400).json({msg: "Post not found!"})
      }

      post.comments.push({text});
      await post.save();
      res.json(post);

   }catch(err){
      console.log("Error adding comment", err);
      res.status(500).json({msg: "Internal Server Error!"})
   }
})

app.listen(PORT,()=>{
   console.log("Server is running!");
})