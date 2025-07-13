import { FC } from 'react';

const Iconfont:FC<{icon:string,onClick?:()=>void; className?:string}> = ({icon,className='',onClick=()=>{}})=>{
  return <>
    <svg className={`icon ${className}`} aria-hidden="true" onClick={onClick}>
      <use xlinkHref={`#${icon}`}></use>
    </svg>
  </>
}
export default Iconfont