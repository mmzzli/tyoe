import Layouts from '@/component/Layouts.tsx';
import { useIntl } from 'react-intl';
import { useState } from 'react';
import { CheckCircle, Clock, Coins } from 'lucide-react';
import './StakingRecords.scss'
const StakingRecords = () =>{
  const intl = useIntl()
  const tabs = [
    {
      value:'all',
      label:intl.formatMessage({id:'common.all'}),
    },
    {
      value:'going',
      label:intl.formatMessage({id:'common.ongoing'})
    },
    {
      value:'completed',
      label:intl.formatMessage({id:'common.completed'})
    }
  ]
  const [type,setType] = useState(tabs[0].value)

  return <Layouts title={intl.formatMessage({id:'staking.records'})}>
    <div style={{margin:'20px'}}>
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
    </div>
    <div className="list staking-records-list">
      <div className="list-item card">
        <div className="top">
          <div className="left">
            <Coins size={20} color="#FC6612" />
            <div className={'order-info'}>
              <div className="up">
                {intl.formatMessage({ id: 'staking.order.id' })} STK001
              </div>
              <div className="down">
                <CheckCircle size={16} color="#4ade80" /> {intl.formatMessage({ id: 'common.ongoing' })}
              </div>
            </div>
          </div>
          <div className="right">10%{intl.formatMessage({ id: 'staking.daily.rate' })}</div>
        </div>
        <div className="ul-list">
          <div className="item">
            <div className="left">{intl.formatMessage({ id: 'staking.fund.value' })}</div>
            <div className="right">500</div>
          </div>
          <div className="item">
            <div className="left">{intl.formatMessage({ id: 'staking.dalat.amount' })}</div>
            <div className="right">500 Da Lat</div>
          </div>
          <div className="item">
            <div className="left">{intl.formatMessage({ id: 'staking.pending.dalat' })}</div>
            <div className="right">500 Da Lat</div>
          </div>
          <div className="item">
            <div className="left">{intl.formatMessage({ id: 'staking.start.time' })}</div>
            <div className="right">2025-01-10 14:30</div>
          </div>
          <div className="item">
            <div className="left">{intl.formatMessage({ id: 'staking.end.time' })}</div>
            <div className="right">2025-01-10 14:30</div>
          </div>
        </div>
      </div>
      <div className="list-item card">
        <div className="top">
          <div className="left">
            <Coins size={20} color="#FC6612" />
            <div className={'order-info'}>
              <div className="up">
                {intl.formatMessage({ id: 'staking.order.id' })} STK001
              </div>
              <div className="down">
                <Clock size={16} color="#fbbf24" /> {intl.formatMessage({ id: 'common.ongoing' })}
              </div>
            </div>
          </div>
          <div className="right">10%{intl.formatMessage({ id: 'staking.daily.rate' })}</div>
        </div>
        <div className="ul-list">
          <div className="item">
            <div className="left">{intl.formatMessage({ id: 'staking.fund.value' })}</div>
            <div className="right">500</div>
          </div>
          <div className="item">
            <div className="left">{intl.formatMessage({ id: 'staking.dalat.amount' })}</div>
            <div className="right">500 Da Lat</div>
          </div>
          <div className="item">
            <div className="left">{intl.formatMessage({ id: 'staking.pending.dalat' })}</div>
            <div className="right">500 Da Lat</div>
          </div>
          <div className="item">
            <div className="left">{intl.formatMessage({ id: 'staking.start.time' })}</div>
            <div className="right">2025-01-10 14:30</div>
          </div>
          <div className="item">
            <div className="left">{intl.formatMessage({ id: 'staking.end.time' })}</div>
            <div className="right">2025-01-10 14:30</div>
          </div>
        </div>
      </div>

    </div>
  </Layouts>
}

export default StakingRecords;