import Layouts from '@/component/Layouts.tsx';
import { useIntl } from 'react-intl';
import './Staking.scss';
import { formatNumber } from '@/utils/common.ts';
import { Coins, DollarSign, FileText, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';




const Staking = ()=>{
  const intl = useIntl();
const navigator = useNavigate()
  return <Layouts title={intl.formatMessage({ id: 'nav.staking' })} right={<FileText onClick={()=>{navigator('/staking-records')}} size={24} color="#000" />}>
    <div className="card staking-info bd">
      <div className="list">
        <div className="list-item">
          <div className="coin">
            <Coins size={24} color="#fff" />
          </div>
          <div className="label">
            {intl.formatMessage({ id: 'staking.total' })}
          </div>
          <div className="value">
            $ {formatNumber(8500)}
          </div>
        </div>

        <div className="list-item">
          <div className="coin">
            <TrendingUp size={24} color="#fff" />
          </div>
          <div className="label">
            {intl.formatMessage({ id: 'staking.fund.commission' })}
          </div>
          <div className="value">
            $ {formatNumber(8500)}
          </div>
        </div>

        <div className="list-item">
          <div className="coin">
            <DollarSign size={24} color="#fff" />
          </div>
          <div className="label">
            {intl.formatMessage({ id: 'staking.fund.total' })}
          </div>
          <div className="value">
            {formatNumber(2500)}
          </div>
        </div>
      </div>

    </div>

    <div className="card staking-table">
      <div className="card-title">
        <div className="text">{intl.formatMessage({ id: 'staking.tiers' })}</div>
      </div>
      <div className="table">
        <div className="table-row-th">
          <div className="th">{intl.formatMessage({ id: 'staking.amount.range' })}</div>
          <div className="th">{intl.formatMessage({ id: 'staking.days' })}</div>
          <div className="th">{intl.formatMessage({ id: 'staking.multiplier' })}</div>
          <div className="th">{intl.formatMessage({ id: 'staking.daily.rate' })}</div>
        </div>
        <div className="table-row-td">
          <div className="td">10-99U</div>
          <div className="td">20天</div>
          <div className="td">1.3倍</div>
          <div className="td">5%</div>
        </div>
        <div className="table-row-td">
          <div className="td">100-499U</div>
          <div className="td">15天</div>
          <div className="td">1.5倍</div>
          <div className="td">6.7%</div>
        </div>
        <div className="table-row-td">
          <div className="td">500U以上</div>
          <div className="td">10天</div>
          <div className="td">2倍</div>
          <div className="td">10%</div>
        </div>

      </div>
    </div>


    <div className="card stak-control">
      <div className="card-title">
        {intl.formatMessage({ id: 'staking.operation' })}
      </div>
      <div className="form-item">
        <div className="label">
          {intl.formatMessage({ id: 'staking.input.amount' })}
        </div>
        <div className="input">
          <input type="text" placeholder={intl.formatMessage({ id: 'staking.amount.placeholder' })} />
        </div>
      </div>

      <div className="form-item">
        <div className="label">
          {intl.formatMessage({ id: 'staking.selected.tier.info' })}
        </div>
        <div className="list">
          <div className="list-item">
            <div className="top">{intl.formatMessage({ id: 'staking.time' })}</div>
            <div className="value">15{intl.formatMessage({ id: 'staking.days.unit' })}</div>
          </div>
          <div className="list-item">
            <div className="top">{intl.formatMessage({ id: 'staking.token.multiplier' })}</div>
            <div className="value">15{intl.formatMessage({ id: 'staking.multiplier.unit' })}</div>
          </div>
          <div className="list-item">
            <div className="top">{intl.formatMessage({ id: 'staking.daily.yield' })}</div>
            <div className="value">15%</div>
          </div>
        </div>
      </div>

      <div className={`button button-block button-disabled`}>{intl.formatMessage({ id: 'staking.confirm' })}</div>

    </div>

  </Layouts>
}
export default Staking