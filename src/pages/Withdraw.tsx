import Layouts from '@/component/Layouts.tsx';
import { useIntl } from 'react-intl';
import './Withdraw.scss';
import { AlertCircle, CheckCircle, Clock, Wallet } from 'lucide-react';

const Withdraw = ()=>{
  const intl = useIntl();


  return <Layouts title={intl.formatMessage({ id: 'nav.withdraw' })}>
    <div className="card withdraw-info">
      <div className="card-title">
        {intl.formatMessage({ id: 'withdraw.title' })}
      </div>
      <div className="form-item">
        <div className="label">
          {intl.formatMessage({ id: 'withdraw.chain' })}
        </div>
        <div className="input">
          BEP20
        </div>
      </div>
      <div className="form-item">
        <div className="label">
          {intl.formatMessage({ id: 'withdraw.token' })}
        </div>
        <div className="input">
          Da Lat
        </div>
      </div>
      <div className="form-item">
        <div className="label">
          <div className="left">{intl.formatMessage({ id: 'withdraw.amount' })}</div>
          <div className="right">{intl.formatMessage({ id: 'withdraw.balance' })}:2500</div>
        </div>
        <div className="input">
          <input type="text" placeholder={intl.formatMessage({ id: '请输入提现数量' })} />
          <div className="btn">MAX</div>
        </div>
      </div>
      <div className="other-info">
        <div className="item">
          <div className="left">
            {intl.formatMessage({ id: 'withdraw.fee' })}
          </div>
          <div className="right" style={{color:'#fc6612'}}>0.00 Da Lat</div>
        </div>
        <div className="item">
          <div className="left">
            {intl.formatMessage({ id: 'withdraw.receive' })}
          </div>
          <div className="right" style={{color:'#3DD473'}}>0.00 Da Lat</div>
        </div>
      </div>
      <div className="button-block button">
        {intl.formatMessage({ id: 'withdraw.confirm' })}
      </div>
    </div>


    <div className="card withdraw-list">
      <div className="top">
      <div className="title">
          {intl.formatMessage({ id: 'withdraw.records' })}
        </div>
      </div>

      <div className="record-list">
        <div className="record-list-item">
          <div className="left">
            <Wallet size={20} color="#FC6612" />
            <div className="box">
              <div className="up">Da Lat</div>
              <div className="time">2022-03-01 14:30</div>
            </div>
          </div>
          <div className="right">
            <div className="tip">
              <CheckCircle size={16} color="#4ade80" /> {intl.formatMessage({ id: 'common.completed' })}
            </div>
            <div className={`up price-rise`}>+125.5</div>
            <div className="down">余额：5000.75</div>
          </div>
        </div>


        <div className="record-list-item">
          <div className="left">
            <Wallet size={20} color="#FC6612" />
            <div className="box">
              <div className="up">Da Lat</div>
              <div className="time">2022-03-01 14:30</div>
            </div>
          </div>
          <div className="right">
            <div className="tip">
              <AlertCircle size={16} color="#fbbf24" /> {intl.formatMessage({ id: 'common.pending' })}
            </div>
            <div className={`up price-rise`}>+125.5</div>
            <div className="down">余额：5000.75</div>
          </div>
        </div>

        <div className="record-list-item">
          <div className="left">
            <Wallet size={20} color="#FC6612" />
            <div className="box">
              <div className="up">Da Lat</div>
              <div className="time">2022-03-01 14:30</div>
            </div>
          </div>
          <div className="right">
            <div className="tip">
              <Clock size={16} color="#f97316" /> {intl.formatMessage({ id: 'common.processing' })}
            </div>
            <div className={`up price-rise`}>+125.5</div>
            <div className="down">余额：5000.75</div>
          </div>
        </div>
      </div>
    </div>
  </Layouts>
}
export default Withdraw