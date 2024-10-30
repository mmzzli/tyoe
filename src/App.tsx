import {useEffect, useState} from 'react'
import './App.scss'
import {RouterProvider} from "react-router-dom";
import router from "./router";
import WebApp from '@twa-dev/sdk'

function App() {
  const [ user,setUser ] = useState<string>('')


  useEffect(()=>{
    WebApp.ready();
    const {user} = WebApp.initDataUnsafe;
    if (user) {
      const userInfo = `${user.first_name} ${user.last_name} (@${user.username})${JSON.stringify(user)}${JSON.stringify(WebApp.initDataUnsafe)}`;
      setUser(userInfo);
    }

  })
  console.log(user)
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App
