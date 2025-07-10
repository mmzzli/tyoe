import avator from '@/assets/images/bigtrainlogo.png';
import { Image } from 'react-vant';
import { ChevronRight, Coins, Copy, Server, TrendingUp, Users, X } from 'lucide-react';
import * as React from 'react';
import './Menu.scss';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import useUserStore from '@/store/user.ts';
import { copyText, formatAddress, formatNumber } from '@/utils/common.ts';

const Menus:React.FC<{close:()=>void}> = ({close})=>{
  const intl = useIntl();
  const navigate = useNavigate()
  const userStore = useUserStore()


  const menuItems = [
    {
      icon: Users,
      title: intl.formatMessage({id:'nav.team'}),
      onPress: () => navigate('/team'),
    },
    {
      icon: Server,
      title: intl.formatMessage({id:'nav.node'}),

      onPress: () => navigate('/node'),
    },
    {
      icon: TrendingUp,
      title: intl.formatMessage({id:'nav.lp'}),

      onPress: () => navigate('/lp'),
    },
    {
      icon: Coins,
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
          <X size={24} color="#797979" onClick={close} />
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
                  <Copy size={18} color="#fc6612" onClick={() => {
                    copyText(userStore.user?.account)

                  }} />
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
                  <Copy size={18} color="#fc6612" onClick={() => {
                    copyText(userStore.user?.panme)
                  }} />
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
                  <Copy size={18} color="#fc6612" onClick={() => {
                    copyText(`${window.location.origin}?invite=${userStore.user?.invit}`)
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="user-asset">
          <div className="user-asset-title">
            {intl.formatMessage({id:'sidebar.personal.assets'})}

          </div>
          <div className="user-asset-value">
            <div className="text">
              $ {userStore.user?.toUsdtCost}
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
                    <item.icon size={20} color={'#fc6612'} />
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