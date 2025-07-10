import Layouts from '@/component/Layouts.tsx';
import { useIntl } from 'react-intl';
import './Lp.scss';
import { ArrowRightLeft, Minus, Plus, TrendingUp } from 'lucide-react';
import  { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

const LP = ()=>{
  const intl = useIntl();
  // const navigator = useNavigate()
  const tabs = [
    {
      value:'all',
      label:intl.formatMessage({id:'common.all'}),
    },
    {
      value:'add',
      label:intl.formatMessage({id:'lp.type.add'})
    },
    {
      value:'remove',
      label:intl.formatMessage({id:'lp.type.remove'})
    },
    {
      value:'transfer',
      label:intl.formatMessage({id:'lp.type.transfer'})
    }
  ]
  const iconMap:any = {
    'add':{
      color:'#4ade80',
      icon:<Plus size={16} color="#4ade80" />,
      label:intl.formatMessage({id:'lp.type.add'})

    },
    'remove':{
      color:"#FF2020",
      icon:<Minus size={16} color="#f87171" />,
      label:intl.formatMessage({id:'lp.type.remove'})

    },
    'transfer':{
      color:"#266DFF",
      icon:<ArrowRightLeft size={16} color="#fbbf24" />,
      label:intl.formatMessage({id:'lp.type.transfer'})

    }
  }
  const lpRecords: any[] = [
    {
      id: '1',
      type: 'add',
      time: '2025-01-15 14:30',
      lpAmount: 5000,
    },
    {
      id: '2',
      type: 'remove',
      time: '2025-01-14 16:45',
      lpAmount: 1500,
    },
    {
      id: '3',
      type: 'transfer',
      time: '2025-01-13 09:30',
      lpAmount: 2000,
    },
    {
      id: '4',
      type: 'add',
      time: '2025-01-12 11:20',
      lpAmount: 3500,
    },
  ];

  const [type,setType] = useState(tabs[0].value)

  return <Layouts title={intl.formatMessage({ id: 'nav.lp' })}>

    <div className="lp-info card bd">
      <TrendingUp size={32} color="#FC6612" />
      <div className="title">{intl.formatMessage({id:'lp.total'})}</div>
      <div className="value">15,000 LP</div>
    </div>

    <div className="card lp-detail">
      <div className="top">
        <div className="title">
          {intl.formatMessage({ id: 'lp.records' })}
        </div>
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
        {
          lpRecords.map((item, ) => {
            return <div className="record-list-item" key={item.id}>
              <div className="left">
                <div className="coin">
                  {iconMap[item.type].icon}
                </div>
                <div className="box">
                  <div className="up">{iconMap[item.type].label}</div>
                  <div className="time">2022-03-01 14:30</div>
                </div>
              </div>
              <div className="right">
                <div style={{color: iconMap[item.type].color}} >125.5 LP</div>
              </div>
            </div>;
          })
        }

      </div>
    </div>
  </Layouts>
}
export default LP