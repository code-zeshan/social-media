import React, {useState, useEffect} from "react";
import axios from "axios";
import { response } from "express";

function home(){
   const [commentInput, setCommentInput] = useState("");
   const [posts,setPosts] = useState([]);

   useEffect(()=>{
      axios
            .get("http://localhost:5000/api/posts")
            .then((respsonse)=> setPosts(response.data))
            .catch((error)=> console.log("Error fetching posts:" ,error));
   }, []);

   const handleLike = (postId) =>{
      axios
            .post('http:localhost:5000/api/posts/like/${postId}')
            .then((response)=>{
               const updatedPosts = posts.map((post)=> post._id === postId ? response.data : post);
               setPosts(updatedPosts);
            })
            .catch((error) => console.log("Error Liking PostL", error));
   }

   const handleAddComment = (postId, commentText) =>{
      axios
            .post('http:localhost:5000/api/posts/comment/${postId}',    )
            .then((response)=>{
               const updatedPosts = posts.map((post)=> post._id === postId ? response.data : post);
               setPosts(updatedPosts);
            })
            .catch((error) => console.log("Error Liking PostL", error));
   }
}