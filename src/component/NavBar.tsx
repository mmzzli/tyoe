import logoUrl from '@/assets/images/logo.png';
import { ConnectButtonCustom } from '@/component/ConnectButtonCustom.tsx';
import SelectLanguage from '@/component/SelectLanguage.tsx';
import * as React from 'react';
import Iconfont from '@/component/Iconfont.tsx';
import { Popup, PopupPosition } from 'react-vant';
import { useState } from 'react';
import Menus from '@/component/Menus.tsx';
import { useNavigate } from 'react-router-dom';

const NavBar: React.FC<{showMenu?:boolean}> = ({showMenu=true}) => {
  const [menuVisable, setMenuVisable] = useState<PopupPosition>('')
  const navigate = useNavigate()
  const handlerNavigateWebsite  = ()=>{
    navigate('/website')
  }
	return (
    <>
      <div className="navbar">
        <div className="left" onClick={handlerNavigateWebsite}>
          <img src={logoUrl} alt="" />
        </div>
        <div className="middle">
          <ConnectButtonCustom />
        </div>
        <div className="right">
          <SelectLanguage />
          {
            showMenu ? <Iconfont icon={'icon-menu'} onClick={() => setMenuVisable('left')} ></Iconfont> : <Iconfont icon={'icon-yuyan'} onClick={()=>{navigate('/website')}}></Iconfont>
          }
        </div>
      </div>
      <Popup
        className={'pop-up-main pop-up-menus'}
        visible={menuVisable === 'left'}
        style={{ width: '100%', height: '100%' }}
        overlay={false}
        position='left'
        onClose={() => {
          setMenuVisable('')
        }}
      >
        <Menus close={()=>setMenuVisable('')}></Menus>
      </Popup>
    </>
  );
};
export default NavBar;