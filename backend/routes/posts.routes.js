import { Router } from "express";
import { activeCheck ,
         createPost, getAllPosts ,deletePost,
         commentPost,
         likePost,
         getAllComments_by_posts,
         deleteComment
} from "../controllers/posts.controller.js";

const router = Router();
import multer from "multer";



const storage = multer.diskStorage({
   destination: (req,file,cb)=>{
      cb(null,'./uploads/')
   },
   filename:(req,file,cb)=>{
      cb(null,Date.now() + file.originalname)
   }
})  
const upload = multer({storage:storage});

router.route('/').get(activeCheck)

router.route('/post').post(upload.single('media'), createPost);
router.route('/posts').get( getAllPosts);
router.route('/delete_post').delete( deletePost);
router.route('/comment').post(commentPost);
router.route('/get_comments').get(getAllComments_by_posts);
router.route('/delete_comment').post(deleteComment);
router.route('/increment_post_like').post(likePost);

export default router;