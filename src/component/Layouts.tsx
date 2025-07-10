import './Layouts.scss'
import React, { FC } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Layouts:FC<{
  children:React.ReactNode|undefined|React.ReactNode[],
  title:string,
  right?:React.ReactNode|null|React.ReactNode[]
}> = ({children,title,right=null}) => {
  const navigation = useNavigate()
  return (
    <>
      <div className="layout-container">
        <div className="header-container">
          <div className="left" onClick={()=>navigation(-1)}>
            <ArrowLeft size={24} color="#000" />
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