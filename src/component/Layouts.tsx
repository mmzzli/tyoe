import './Layouts.scss';
import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useAccount } from 'wagmi';
import useUserStore from '@/store/user.ts';
import { TOKEN } from '@/utils/const.ts';
import Iconfont from '@/component/Iconfont.tsx';

const Layouts:FC<{
  children:React.ReactNode|undefined|React.ReactNode[],
  title:string,
  right?:React.ReactNode|null|React.ReactNode[]
}> = ({children,title,right=null}) => {
  const { address, isConnected } = useAccount()
  const navigation = useNavigate()
  const {user,setUser} = useUserStore()

  const intl = useIntl()
  document.title = intl.formatMessage({id:'app.name'})
  // 如果断开连接直接回首页

  const clearUser = ()=>{
    localStorage.removeItem(TOKEN)
    setUser(null)
  }
  useEffect(() => {
    if(!isConnected || !user?.account || !address){
      clearUser()
      navigation('/')
    }
    if(user?.account !== address){
      clearUser()
      navigation('/')
    }
  }, [isConnected,user?.account,address]);
  return (
    <>
      <div className="layout-container">
        <div className="header-container">
          <div className="left" onClick={()=>navigation(-1)}>
            <Iconfont icon={'icon-fanhuijiantou'}/>
          </div>
          <div className="title">{title}</div>
          <div className="right">{right}</div>
        </div>
        {children}
      </div>
    </>
  )
}

export default Layouts