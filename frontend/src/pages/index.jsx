import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout/userLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {

  const router = useRouter();
  return (
    < UserLayout>
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <div className={styles.mainContainer_left}>

            <p>Welcome to your professional community</p>
            <p>By clicking Continue to SignUp, you agree to User Agreement, Privacy Policy, and Cookie Policy.</p>
            <div onClick={()=>{
              router.push('/login')
            }} className={styles.buttonJoin}>
              <p>SignUp now</p>
            </div>

          </div>
          <div className={styles.mainContainer_right}>
               <img src ='./images/connectingImg.avif' alt="connectingImg" className={styles.connectingImg}/>
          </div>
        </div>
      </div>
    </ UserLayout>
  )
}
