import './Layouts.scss';
import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useAccount } from 'wagmi';
import useUserStore from '@/store/user.ts';
import { TOKEN } from '@/utils/const.ts';
import Iconfont from '@/component/Iconfont.tsx';
import { getUserInfo } from '@/service/user.ts';

const Layouts:FC<{
  children:React.ReactNode|undefined|React.ReactNode[],
  title:string,
  right?:React.ReactNode|null|React.ReactNode[]
}> = ({children,title,right=null}) => {
  const { address, isConnected,isConnecting,isReconnecting } = useAccount()
  const navigation = useNavigate()
  const {setUser} = useUserStore()

  const intl = useIntl()
  document.title = intl.formatMessage({id:'app.name'})
  // 如果断开连接直接回首页
  const clearUser = ()=> {
    localStorage.removeItem(TOKEN)
    setUser(null)
    navigation('/')
  }


  const fetchUserInfo = async ()=>{
    try{
      const res = await getUserInfo()
      setUser(res)
      if(res.account.toLowerCase() !== address?.toLowerCase()){
        clearUser()
        console.log(55555);
      }
    }catch {
      console.log(66666);
      clearUser()
    }
  }

  useEffect(() => {
    // 只要还在连接中，不做任何跳转
    if (isConnecting || isReconnecting) {
      return;
    }

    if (!isConnected || !address) {
      clearUser();
      return;
    }
    if (localStorage.getItem(TOKEN)) {
      fetchUserInfo();
    } else {
      clearUser();
    }
  }, [isConnected, address, isConnecting, isReconnecting]);

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