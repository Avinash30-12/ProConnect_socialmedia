import { getAboutUser } from '@/config/redux/action/authAction';
import DashboardLayout from '@/layout/dashboardLayout'
import UserLayout from '@/layout/userLayout'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Styles from './indes.module.css'
import { BASE_URL, clientServer } from '@/config';
import { getAllPosts } from '@/config/redux/action/postAction';

export default function ProfilePage() {

    const dispatch = useDispatch();
    const authstate =useSelector((state)=> state.auth);
    const postReducer = useSelector((state)=> state.posts);

    const [userProfile , setUserProfile] =useState({})
    const [userPosts , setUserPosts] = useState([])
    const [isModalOpen , setIsModalOpen] = useState(false);

    const[inputData , setInputData] = useState({company:'' , position:'' , years:''});

    const handleWorkInputChange = (e)=>{
       
      const {name , value} = e.target;
      setInputData({...inputData, [name]:value})
    }

    useEffect(()=>{
        dispatch(getAboutUser({token : localStorage.getItem("token")}))
        dispatch(getAllPosts())
    },[])

    useEffect(()=>{

        if(authstate.user != undefined){
            setUserProfile(authstate.user)
        let post = postReducer.posts.filter((post) => {
            return post.userId.username === authstate.user.userId.username;
        });
        setUserPosts(post);
    }
    } , [authstate.user , postReducer.posts])

    const updateProfilePicture = async (file)=>{

        const formData = new FormData();
        formData.append('profile_picture' , file);
        formData.append('token' , localStorage.getItem("token"));

        const response = await clientServer.post("/update_profile_picture" , formData, {
            headers:{
                'Content-Type':'multipart/form-data',
            }
        });

        dispatch(getAboutUser({token: localStorage.getItem("token")}))

    }

    const updateProfileData = async()=>{
      const request = await clientServer.post("/user_update" , {
        token: localStorage.getItem("token"),
        name: userProfile.userId.name
      });

      const response = await clientServer.post("/update_profile_data" , {
        token: localStorage.getItem("token"),
        bio: userProfile.bio,
        currentPost: userProfile.currentPost,
        pastWork:userProfile.pastWork,
        education:userProfile.education
      });

      dispatch(getAboutUser({token: localStorage.getItem("token")}))
    }
    

  return (
    <UserLayout>
      <DashboardLayout>
        {authstate.user && userProfile?.userId &&(
        <div className={Styles.container}>
          <div className={Styles.backDropContainer}>
             <label htmlFor='profilePictureUpload' className={Styles.backdrop_overlay}>
                <p>Edit</p>
             </label>
             <input onChange={(e)=>{
                updateProfilePicture(e.target.files[0])
             }} hidden type="file" id='profilePictureUpload' />
                <img src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="" />
          </div>

          <div className={Styles.profileContainer_details}>

            <div style={{display:"flex" , gap:"0.7rem"}}>

               <div style={{flex:"0.8"}}>

                    <div style={{display:"flex" , width:"fit-content" , alignItems:"center" , gap:"1.2rem"}}>
                      
                      <input className={Styles.nameEdit} type="text" value={userProfile.userId.name}
                        onChange={(e)=>{
                            setUserProfile({...userProfile ,userId:{...userProfile.userId , name:e.target.value}})
                        }}
                      />

                      <p style={{color:"grey"}}>@{userProfile.userId.username}</p>
                    </div>

                    <div style={{marginTop:"1rem"}}>
                      <h4 style={{marginLeft:"0.5rem"}}>Bio</h4>
                      <textarea value={userProfile.bio}
                      onChange={(e)=>{
                            setUserProfile({...userProfile , bio:e.target.value})
                        }}
                        rows={Math.max(3 , Math.ceil(userProfile.bio.length / 80))} //adjust as needed
                        style={{width:"100%"}}
                      />
                    </div>


               </div>
               <div style={{flex:"0.2"}}>
                     <h4>Recent activities</h4>

                     {userPosts.map((post)=>{
                      return(
                        <div key={post._id} className={Styles.postCard}>
                             <div className={Styles.card}>
                              <div className={Styles.card_profileContainer}>
                                  {post.media ?
                                    <img src={`${BASE_URL}/${post.media}`}/>   : 
                                    <div style={{width:"3.4rem" , height:"3.4rem"}}></div>                                    
                                }
                              </div>     
                              <p>{post.body}</p>               
                             </div>
                        </div>
                      )
                     })}
               </div>
            </div>

          </div>

          <div className={Styles.workHistory}>
            <h4>Work History</h4>
            <div className={Styles.workHistory_container}>
              {
                userProfile.pastWork.map((work , index)=>{
                  return(
                    <div key={index} className={Styles.workHistory_card}>
                      <p style={{fontWeight:"bold", display:"flex" ,alignItems:"center" , gap:"0.8rem"}}>{work.company}-{work.position}</p>
                      <p>{work.years}</p>
                    </div>
                  )
                })
              }

              <button className={Styles.addWorkBtn} onClick={()=>{
                 setIsModalOpen(true)
              }}>Add work</button>

            </div>
          </div>
          {userProfile != authstate.user &&
           <div onClick={()=>{
            updateProfileData();
           }} className={Styles.updateBtn}>Update Profile</div>
          }
        </div>
      )}

      { isModalOpen &&
         
         <div onClick={()=>{
          setIsModalOpen(false);
         }} className={Styles.commentsContainer}>
              <div onClick={(e)=>{
                e.stopPropagation()
              }} className={Styles.allCommentsContainer}>
                 <input type="text" placeholder='Enter Comapny name' onChange={handleWorkInputChange} name='company' className={Styles.inputField} />
                 <input type="text" placeholder='Enter Positions' onChange={handleWorkInputChange} name='position' className={Styles.inputField} />
                 <input type="number" placeholder='Enter durations' onChange={handleWorkInputChange} name='years' className={Styles.inputField} />

                 <div onClick={()=>{
                  setUserProfile({...userProfile , pastWork:[...userProfile.pastWork , inputData]})
                  setIsModalOpen(false)
                 }} className={Styles.updateBtn}>Add work</div>
              </div>
         </div>
 
      }

      </DashboardLayout>
    </UserLayout>
  )
}
