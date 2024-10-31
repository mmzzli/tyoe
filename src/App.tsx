import {useEffect} from 'react'
import './App.scss'
import {RouterProvider} from "react-router-dom";
import router from "./router";
import WebApp from '@twa-dev/sdk'
import useUserStore from "@/store/user.ts";

function App() {
  const setUser = useUserStore(s=>s.setUser)

  useEffect(()=>{
    WebApp.ready();
    const {user} = WebApp.initDataUnsafe;
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
