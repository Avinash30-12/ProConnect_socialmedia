import { BASE_URL, clientServer } from '@/config';
import DashboardLayout from '@/layout/dashboardLayout';
import UserLayout from '@/layout/userLayout';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Styles from './index.module.css'
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import { getConnectionRequest, getMyConnectionRequest, sendConnectionRequest } from '@/config/redux/action/authAction';

export default function ViewProfile({userProfile}) {


    const router = useRouter();
    const postReducer = useSelector((state)=> state.posts);
    const dispatch = useDispatch();

    const authState = useSelector((state)=> state.auth);

    const [userPosts , setUserPosts] = useState([]);
    const [isCurrentUserInConnection , setIsCurrentUserInConnection] = useState(false);
    const [isConnectionNull , setIsConnectionNull] = useState(true);

    const getUserPost= async()=>{
      await dispatch(getAllPosts());
      await dispatch(getConnectionRequest({token: localStorage.getItem("token")}));
      await dispatch(getMyConnectionRequest({token: localStorage.getItem("token")}))
    }
    
    useEffect(() => {
  
             let post = postReducer.posts.filter((post) => {
               return post.userId.username === router.query.username;
             });
           
             setUserPosts(post);
    },  [postReducer.posts]);

    useEffect(()=>{
      if(authState.connections.some(user=> user.connectionId._id === userProfile.userId._id)){
        setIsCurrentUserInConnection(true);
      if(authState.connections.find(user=> user.connectionId._id === userProfile.userId._id).status_accepted ===true){
        setIsConnectionNull(false);
      }
    }

    if(authState.connectionRequest.some(user=> user.userId._id === userProfile.userId._id)){
        setIsCurrentUserInConnection(true);
      if(authState.connectionRequest.find(user=> user.userId._id === userProfile.userId._id).status_accepted ===true){
        setIsConnectionNull(false);
      }
    }
    },[authState.connections , authState.connectionRequest])


    useEffect(()=>{
      getUserPost();
    },[])


    const searchParams = useSearchParams(); 

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={Styles.container}>
          <div className={Styles.backDropContainer}>
                <img className={Styles.backDrop} src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="" />
          </div>

          <div className={Styles.profileContainer_details}>

            <div className={Styles.profileContainer_div}>

               <div style={{flex:"0.8"}}>

                    <div style={{display:"flex" , width:"fit-content" , alignItems:"center" , gap:"1.2rem"}}>
                      <h2>{userProfile.userId.name}</h2>
                      <p style={{color:"grey"}}>@{userProfile.userId.username}</p>
                    </div>
                    <div style={{display:"flex" , alignItems:"center" , gap:"1.2rem"}}>
                      {isCurrentUserInConnection ?
                           <button className={Styles.connectedBtn}>{isConnectionNull ? "Pending":"Connected"}</button>
                          :
                          <button className={Styles.connectBtn} onClick={()=>{
                            dispatch(sendConnectionRequest({token: localStorage.getItem("token") , user_id: userProfile.userId._id}))
                          }}>Connect</button>
                      }
                      <div onClick={async ()=>{
                        const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`) 
                        window.open(`${BASE_URL}/${response.data.message}` , "_blank")
                      }} style={{cursor:"pointer"}}>
                         <svg style={{width:"1.3em"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                         </svg>
                      </div>
                    </div>
                    <div>
                      <p>{userProfile.bio}</p>
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

            </div>

          </div>


        </div>
      </DashboardLayout>
    </UserLayout>
  )
}

export async function getServerSideProps(context){

  const request = await clientServer.get("/user/get_profile_based_on_username", {
    params:{
        username:context.query.username
    }
  })

  return{
    props:{userProfile : request.data.profile}
  }
}
