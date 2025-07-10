import Layouts from '@/component/Layouts.tsx';
import { useIntl } from 'react-intl';
import './Assets.scss'
import { formatNumber } from '@/utils/common.ts';
import { Coins, Filter, TrendingDown, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Assets = ()=>{
  const intl = useIntl();
  const navigator = useNavigate()
  const tabs = [
    {
      value:'all',
      label:intl.formatMessage({id:'common.all'}),
    },
    {
      value:'Da Lat',
      label:'Da Lat'
    },
    {
      value:'Fund Value',
      label:intl.formatMessage({id:'staking.fund.total'})
    }
  ]
  const map = {
    'Da Lat':'#FD6612',
    'Fund Value':"#A053FF"
  }
  const [type,setType] = useState(tabs[0].value)

  return <Layouts title={intl.formatMessage({ id: 'nav.assets' })}>
    <div className="card asset-info">
      <div className="title">
        {intl.formatMessage({ id: 'assets.total' })}
      </div>
      <div className="value">
        ${formatNumber(150.75)}
      </div>
      <div className="list">
        <div className="list-item">
          <div className="top">Da Lat</div>
          <div className="bottom">125,000</div>
        </div>

        <div className="list-item">
          <div className="top">{intl.formatMessage({ id: 'staking.fund.total' })}</div>
          <div className="bottom">5,000</div>
        </div>
      </div>
      <div className="button" onClick={()=>{navigator('/withdraw')}}>{intl.formatMessage({id:'assets.withdraw'})}</div>
    </div>


    <div className="card asset-alalysis">
      <div className="title">
        {intl.formatMessage({ id: 'assets.commission.title' })}
      </div>

      <div className="list">
        <div className="list-item">
          <div className="icon">
          <TrendingUp  size={20} color={'#fff'} />
          </div>
          <div className="top">Da Lat</div>
          <div className="bottom">125,000</div>
        </div>

        <div className="list-item">
          <div className="icon">

            <TrendingDown size={20} color={'#fff'} />
          </div>
            <div className="top">{intl.formatMessage({ id: 'staking.fund.total' })}</div>
            <div className="bottom">5,000</div>
          </div>

        <div className="list-item">
          <div className="icon">
            <Users size={20} color={'#fff'} />
          </div>
            <div className="top">{intl.formatMessage({ id: 'staking.fund.total' })}</div>
            <div className="bottom">5,000</div>
          </div>

        <div className="list-item">
          <div className="icon">

            <Coins size={20} color={'#fff'} />
          </div>
            <div className="top">{intl.formatMessage({ id: 'staking.fund.total' })}</div>
            <div className="bottom">5,000</div>
          </div>
        </div>
      </div>

    <div className="card asset-detail">
      <div className="top">
        <div className="title">
          {intl.formatMessage({ id: 'assets.details' })}
        </div>
        <Filter size={18} color="#FC6612" />
      </div>

      <div className="tabs">
        {
          tabs.map((item, index) => {
            return <div className={`tab-item ${item.value === type ? 'active' : ''}`} key={index}
                        onClick={() => setType(item.value)}>
              {item.label}
            </div>;
          })
        }
      </div>
      <div className="record-list">
        <div className="record-list-item">
          <div className="left">
            <div className="coin">
              <Coins size={16} color="#ffffff" />
            </div>
            <div className="box">
              <div className="up">Da Lat</div>
              <div className="time">2022-03-01 14:30</div>
            </div>
          </div>
          <div className="right">
            <div className={`up price-rise`}>+125.5</div>
            <div className="down">余额：5000.75</div>
          </div>
        </div>
        <div className="record-list-item">
          <div className="left">
            <div className="coin">
              <Coins size={16} color="#ffffff" />
            </div>
            <div className="box">
              <div className="up">Fund value</div>
              <div className="time">2022-03-01 14:30</div>
            </div>
          </div>
          <div className="right">
            <div className={`up price-rise`}>+125.5</div>
            <div className="down">余额：5000.75</div>
          </div>
        </div>
      </div>
    </div>
  </Layouts>
}
export default Assets