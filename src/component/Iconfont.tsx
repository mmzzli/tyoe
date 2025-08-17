import { FC } from 'react';

const Iconfont:FC<{icon:string,onClick?:()=>void; className?:string; style?:any}> = ({icon,className='',onClick=()=>{},style={}})=>{
  return <>
    <svg className={`icon ${className}`} aria-hidden="true" onClick={onClick} style={style}>
      <use xlinkHref={`#${icon}`}></use>
    </svg>
  </>
}
export default Iconfont