import {useEffect} from 'react'
import './App.scss'
import {RouterProvider} from "react-router-dom";
import router from "./router";
import WebApp from '@twa-dev/sdk'
import useUserStore from "@/store/user.ts";
const {MODE, VITE_APP_USER}  = import.meta.env
const modes = ['production','staking']
const isProd = modes.includes(MODE)
function App() {
  const setUser = useUserStore(s=>s.setUser)

  useEffect(()=>{
    WebApp.ready();
    let user:any = null;
    if(!isProd){
      user = JSON.parse(VITE_APP_USER).user;
      console.log(user,'====');
    }else{
      user = WebApp.initDataUnsafe.user
    }
    if (user) {
      setUser(user)
    }
  })
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App
