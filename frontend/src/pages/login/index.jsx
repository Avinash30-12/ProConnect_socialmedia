import UserLayout from '@/layout/userLayout'
import { useRouter } from 'next/router'
import React, { use, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Styles from './style.module.css'
import { login, register } from '@/config/redux/action/authAction'
import { emptyMessage } from '@/config/redux/reducer/authReducer'

export default function LoginComponent() {
  
   const authState = useSelector(state => state.auth)
   const router = useRouter();
   const dispatch = useDispatch();

   const [userLoginMethod , setUserLoginMethod] = useState(false);
   const [username , setUsername] = useState('');
   const [name , setName] = useState('');
   const [email , setEmail] = useState('');
   const [password , setPassword] = useState('');


   useEffect(() => {
     if(authState.loggedIn) {
       router.push('/dashboard')
     }
   }, [authState.loggedIn ])

   useEffect(() => {
      if(localStorage.getItem("token")) {
        router.push('/dashboard')
      }
   }, [])

   useEffect(() => {
      dispatch(emptyMessage())
   }, [userLoginMethod])


   const handleRegister = () => {
      dispatch(register({username, name, email, password}))  
   }

   const handleLogin = () => {
      dispatch(login({email, password}))  
   }

  return (
    <UserLayout>
      <div className={Styles.Container}>
      <div className={Styles.cardContainer}>

         <div className={Styles.cardContainer_left}>
            <p className={Styles.cardLeft_heading}>{userLoginMethod? "SignIn" : "SignUp"}</p>
              <p style={{color: authState.isError ? "red" :"green"}}>{authState.message.message}</p>

            <div className={Styles.inputContainers}>
                {!userLoginMethod && <div className={Styles.inputRow}>
                    <input type="text" placeholder='Username' onChange={(e)=> setUsername(e.target.value)} className={Styles.inputField} />
                    <input type="text" placeholder='Name' onChange={(e)=> setName(e.target.value)} className={Styles.inputField} />
                </div>}
                <input type="text" placeholder='Email' onChange={(e)=> setEmail(e.target.value)} className={Styles.inputField} />
                <input type="password" placeholder='Password' onChange={(e)=> setPassword(e.target.value)} className={Styles.inputField} />
                
                <div onClick={()=> {
                  if(userLoginMethod) {
                    handleLogin()
                  } else {
                    handleRegister()
                  }
                }} className={Styles.buttonWithOutline}>
                    <p>{userLoginMethod? "SignIn" : "SignUp"}</p>
                </div>
            </div>
         </div>
         <div className={Styles.cardContainer_right}>
            {userLoginMethod ? <p>New to this community ?</p> :<p>Already have an account</p> }
            <div onClick={()=> {setUserLoginMethod(!userLoginMethod)}}
             style={{backgroundColor:"white" , textAlign:"center" ,color:"blue" }}
             className={Styles.buttonWithOutline}>
                    <p>{userLoginMethod? "SignUp" : "SignIn"}</p>
                </div>
            </div>
      </div>
      </div>
    </UserLayout>
  )
}
