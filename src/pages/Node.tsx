import Layouts from '@/component/Layouts.tsx';
import { useIntl } from 'react-intl';
import { formatAddress, formatNumber } from '@/utils/common.ts';
import { Award, Clock, Coins, Copy } from 'lucide-react';
import './Node.scss';
import { useEffect } from 'react';

const Node = ()=>{
  const intl = useIntl();
  // const [data,setData] = useState<any>({})

  useEffect(()=>{
    const fetchData = async ()=>{
      // const res = await getMyTeams()
      // console.log(res);
      // setData(res)
    }
    fetchData()
  },[])

  return <Layouts title={intl.formatMessage({id:'nav.node'})}>
    <div className="node-container bg-gray-container">
      <div className="card  node-info bd">
        <div className="top">
          <Award size={24} color="#FC6612" />
          <div className={"node-info-title"}>
            {intl.formatMessage({ id: 'node.genesis' })}
            {/*   intl.formatMessage({id:'node.normal'})*/}
          </div>
        </div>
        <div className="info-content">
          <div className="h4">{intl.formatMessage({ id: 'node.total.dividends' })}</div>
          <div className="value">${formatNumber('555555.75')}</div>
        </div>
        <div className="middle">
          <div className="left">
            <Clock size={16} />
            {intl.formatMessage({ id: 'node.expiry' })}
          </div>
          <div className="right">2026-07-03</div>
        </div>
        <div className="node-info-details">
          <div className="text">{intl.formatMessage({ id: 'node.contract' })}</div>
          <div className="node-info-details-value">
            <div className="left">{formatAddress('0x123141234123412341234')}</div>
            <Copy size={16} color="#FC6612" />
          </div>
        </div>
      </div>

      <div className="card node-fee">
        <div className="card-title">
          <div className="text">{intl.formatMessage({ id: 'node.fees' })}</div>
        </div>
        <div className="table">
          <div className="table-row-th">
            <div className="th">{intl.formatMessage({ id: 'node.type' })}</div>
            <div className="th">{intl.formatMessage({ id: 'node.price' })}</div>
            <div className="th">{intl.formatMessage({ id: 'node.duration' })}</div>
            <div className="th">{intl.formatMessage({ id: 'node.purchase.limit' })}</div>
          </div>
          <div className="table-row-td">
            <div className="td">普通节点</div>
            <div className="td">$200U</div>
            <div className="td">100天</div>
            <div className="td">$200U</div>
          </div>
          <div className="table-row-td">
            <div className="td">普通节点</div>
            <div className="td">$200U</div>
            <div className="td">100天</div>
            <div className="td">$200U</div>
          </div>
        </div>
      </div>


      <div className="card node-records">
        <div className="card-title">
          <div className="text">{intl.formatMessage({ id: 'node.dividend.records' })}</div>
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
                <div className="up">Da Lat</div>
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

    </div>
  </Layouts>
}
export default Node