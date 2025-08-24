import { ChevronRight } from 'lucide-react';
import * as React from 'react';
import './Menu.scss';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import Iconfont from '@/component/Iconfont.tsx';

const Menus:React.FC<{close:()=>void}> = ({close})=>{
  const intl = useIntl();
  const navigate = useNavigate()
  const menuItems = [
    {
      icon: <Iconfont icon={'icon-user'}/>,
      title: intl.formatMessage({id:'nav.team'}),
      onPress: () => navigate('/team'),
    },
    {
      icon: <Iconfont icon={'icon-Assets'}/>,
      title: intl.formatMessage({id:'nav.assets'}),
      onPress: () => navigate('/assets'),
    },
    {
      icon: <Iconfont icon={'icon-gift'}/>,
      title: intl.formatMessage({id:'nav.staking'}),
      onPress: () => navigate('/website'),
    },
    {
      icon: <Iconfont icon={'icon-kongtou'}/>,
      title: intl.formatMessage({id:'nav.airdrop'}),
      onPress: () => navigate('/'),
    },
  ];
  return (
    <div className="menu-container">
      <div className="menu-toolbar">
        <div></div>
        <div className="right">
          <Iconfont icon={'icon-close'} onClick={close}></Iconfont>
        </div>
      </div>
      <div className="menu-main scroll-container">


        <div className="menu-list">

          {
            menuItems.map((item, index) => {
              return (
                <div className="menu-list-item" key={index} onClick={()=>{
                  close()
                  item.onPress()
                }}>
                  <div className="left">
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                  <ChevronRight size={20} color="#fc6612" />
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Menus