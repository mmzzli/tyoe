import avator from '@/assets/images/bigtrainlogo.png';
import { Image } from 'react-vant';
import { ChevronRight } from 'lucide-react';
import * as React from 'react';
import './Menu.scss';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import useUserStore from '@/store/user.ts';
import { copyText, formatAddress, formatNumber } from '@/utils/common.ts';
import Iconfont from '@/component/Iconfont.tsx';

const Menus:React.FC<{close:()=>void}> = ({close})=>{
  const intl = useIntl();
  const navigate = useNavigate()
  const userStore = useUserStore()


  const menuItems = [
    {
      icon: <Iconfont icon={'icon-tuandui'}/>,
      title: intl.formatMessage({id:'nav.team'}),
      onPress: () => navigate('/team'),
    },
    {
      icon: <Iconfont icon={'icon-jiedian'}/>,
      title: intl.formatMessage({id:'nav.node'}),

      onPress: () => navigate('/node'),
    },
    {
      icon: <Iconfont icon={'icon-rise'}/>,
      title: intl.formatMessage({id:'nav.lp'}),

      onPress: () => navigate('/lp'),
    },
    {
      icon: <Iconfont icon={'icon-jijinzhiya'}/>,
      title: intl.formatMessage({id:'nav.staking'}),
      onPress: () => navigate('/staking'),
    },
  ];
  return (
    <div className="menu-container">
      <div className="menu-toolbar">
        <div className="left">
          <Image src={avator} width={44} height={44} alt="" fit={'cover'} />
          <span>{intl.formatMessage({id:'app.name'})}</span>
        </div>
        <div className="right">
          <Iconfont icon={'icon-close'} onClick={close}></Iconfont>
        </div>
      </div>
      <div className="menu-main scroll-container">
        <div className="user-info">
          <div className="image-box">
            <img className="user-info-image" src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" />
          </div>
          <div className="list">
            <div className="list-item">
              <div className="top">
                {intl.formatMessage({id:'common.address'})}
              </div>
              <div className="bottom">
                <div className="left">
                  {formatAddress(userStore.user?.account)}
                </div>
                <div className="right">
                  <Iconfont icon={'icon-fuzhi'} onClick={() => {
                    copyText(userStore.user?.account)
                  }}></Iconfont>
                </div>
              </div>
            </div>

            <div className="list-item">
              <div className="top">
                {intl.formatMessage({id:'common.superior'})}

              </div>
              <div className="bottom">
                <div className="left">
                  {formatAddress(userStore.user?.panme)}

                </div>
                <div className="right">

                  <Iconfont icon={'icon-fuzhi'} onClick={() => {
                    copyText(userStore.user?.panme)
                  }}></Iconfont>
                </div>
              </div>
            </div>

            <div className="list-item">
              <div className="top">
                UID
              </div>
              <div className="bottom">
                <div className="left">
                  {userStore.user?.id}
                </div>
              </div>
            </div>

            <div className="list-item">
              <div className="top">
                {intl.formatMessage({id:'common.invite.code'})}
              </div>
              <div className="bottom">
                <div className="left">
                  {userStore.user?.invit}
                </div>
                <div className="right">
                  <Iconfont icon={'icon-fuzhi'} onClick={() => {
                    copyText(`${window.location.origin}?invite=${userStore.user?.invit}`)
                  }}></Iconfont>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="user-asset" onClick={()=>{navigate('/assets')}}>
          <div className="user-asset-title">
            {intl.formatMessage({id:'sidebar.personal.assets'})}

          </div>
          <div className="user-asset-value">
            <div className="text">
              $ {formatNumber(userStore?.user?.toUsdtCost||0)}
            </div>
            <ChevronRight size={20} color="#fc6612" />
          </div>

          <div className="asset-item">
            Da Lat:{formatNumber(userStore.user?.usdt_num || 0)}

          </div>

          <div className="asset-item">
            {intl.formatMessage({id:'staking.fund.total'})}:
            {formatNumber(userStore.user?.wp_num || 0)}
          </div>
        </div>

        <div className="menu-list">
          <div className="menu-list-title">
            {intl.formatMessage({id:'sidebar.function.menu'})}
          </div>
          {
            menuItems.map((item, index) => {
              return (
                <div className="menu-list-item" key={index} onClick={item.onPress}>
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