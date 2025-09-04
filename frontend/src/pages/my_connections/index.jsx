import { BASE_URL } from '@/config';
import { acceptConnection, getMyConnectionRequest } from '@/config/redux/action/authAction';
import DashboardLayout from '@/layout/dashboardLayout'
import UserLayout from '@/layout/userLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Styles from './index.module.css'
import { useRouter } from 'next/router';
export default function MyConnections() {

  const dispatch = useDispatch();
  const authState = useSelector((state)=> state.auth)
  const router = useRouter();

  useEffect(()=>{
    dispatch(getMyConnectionRequest({token: localStorage.getItem("token")}));
  },[]);

  useEffect(()=>{

    if(authState.connectionRequest.length != 0){
      console.log(authState.connectionRequest)
    }

  } ,[authState.connectionRequest])


  return (
    <UserLayout>
        <DashboardLayout>
          <div style={{display:"flex" , flexDirection:"column" , gap:"2rem"}}>
            <h4>My Connections</h4>
              {authState.connectionRequest.length === 0 && <h3>NO connections request pending...</h3>}
              {authState.connectionRequest.length != 0 && authState.connectionRequest.filter((connection)=> connection.status_accepted === null).map((user , index)=>{
                return(
                  <div onClick={()=>{
                    router.push(`/view_profile/${user.userId.username}`)
                  }} key={index} className={Styles.userCard}>
                    <div style={{display:"flex" , alignItems:"center" , gap:"1.2rem" , justifyContent:"space-between"}}>
                      <div className={Styles.profilePicture}>
                        <img className='userCardImg' src={`${BASE_URL}/${user.userId.profilePicture}`} alt="Profile" />
                      </div>
                      <div className={Styles.userInfo}>
                          <h1>{user.userId.name}</h1>
                          <p>{user.userId.username}</p>
                      </div>
                      <button onClick={(e)=>{
                        e.stopPropagation();
                        dispatch(acceptConnection({
                          connectionId : user._id,
                          token : localStorage.getItem("token"),
                          action: "accept"
                        }))
                      }} className={Styles.acceptBtn}>Accept</button>
                    </div>
                  </div>
                )
              })}
              <h4>My Network</h4>
              {authState.connectionRequest.filter((connection)=> connection.status_accepted !== null).map((user , index)=>{
                return(
                  <div onClick={()=>{
                    router.push(`/view_profile/${user.userId.username}`)
                  }} key={index} className={Styles.userCard}>
                    <div style={{display:"flex" , alignItems:"center" , gap:"1.2rem" , justifyContent:"space-between"}}>
                      <div className={Styles.profilePicture}>
                        <img className='userCardImg' src={`${BASE_URL}/${user.userId.profilePicture}`} alt="Profile" />
                      </div>
                      <div className={Styles.userInfo}>
                          <h1>{user.userId.name}</h1>
                          <p>{user.userId.username}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </DashboardLayout>
    </UserLayout>
  )
}
