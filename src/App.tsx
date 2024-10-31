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
    // const {user} = WebApp.initDataUnsafe;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const {user} ={"user":{"id":6415882317,"first_name":"Jacobi","last_name":"zhao","username":"Jacobizhao","language_code":"zh-hans","allows_write_to_pm":true},"chat_instance":"-1262685125228642249","chat_type":"private","auth_date":"1730269877","hash":"f1cc5d3e29654a24d7b203b2243885b53a7239d3db78f1e53cd87ee3ab06a75e"}
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
