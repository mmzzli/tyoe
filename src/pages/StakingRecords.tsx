import Layouts from '@/component/Layouts.tsx';
import { useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import './StakingRecords.scss';
import { getStakingRecord, StakingRecordInterface } from '@/service/staking.ts';
import Iconfont from '@/component/Iconfont.tsx';
import dayjs from 'dayjs';

const StakingRecords = () =>{
  const intl = useIntl()
  const tabs = [
    {
      value:'all',
      label:intl.formatMessage({id:'common.all'}),
    },
    {
      value:'1',
      label:intl.formatMessage({id:'common.ongoing'}),
      icon:<Iconfont icon="icon-shijiankaishishijian"></Iconfont>
    },
    {
      value:'3',
      label:intl.formatMessage({id:'common.completed'}),
      icon:<Iconfont icon="icon-zhaungtai1"></Iconfont>
    }
  ]
  const [type,setType] = useState(tabs[0].value)

  const [list,setList] = useState<StakingRecordInterface[]>([])
  const [finished, setFinished] = useState<boolean>(false)
  const [,setTotal] = useState(0)
  const [page,setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  // 请求数据
  const fetchRecords = async (pageNum:number, isRefresh = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const params:any = { page: pageNum }
      if(type!=='all'){
        params.status = type
      }
      const res = await getStakingRecord(params)
      setTotal(res.total)
      const newList = isRefresh ? res.list : [...list, ...res.list]
      setList(newList)
      setFinished(newList.length >= res.total)
      setPage(pageNum + 1)
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  // 下拉刷新
  const onRefresh = async () => {
    if (loading) return;
    setFinished(false)
    setPage(1)
    setList([])
    await fetchRecords(1, true)
  }

  // 分页加载
  const onLoad = async () => {
    if (loading || finished) return;
    await fetchRecords(page)
  }

  // 切换tab时刷新
  useEffect(() => {
    onRefresh()
  }, [type]);

  return <Layouts title={intl.formatMessage({id:'staking.records'})}>
    <div className="staking-records-detail">
      <div className="staking-records-detail-card">
        <div className="title">{intl.formatMessage({ id: 'staking.detail.total.amount' })}</div>
        <div className="content">25,000 TYOE</div>
      </div>
      <div className="staking-records-detail-card">
        <div className="title">{intl.formatMessage({ id: 'staking.detail.total.reward' })}</div>
        <div className="content success">430 TYOE</div>
      </div>
    </div>
    <div className="staking-records-list">
      <div className="title">
        {intl.formatMessage({ id: 'staking.records' })}(3)
      </div>
      <div className="staking-records-list-box">
      <div className="staking-records-list-item">
        <div className="top">
          <div className="left">
            {intl.formatMessage({ id: 'common.order.no' })}:STK001234567890
          </div>
          <div className="right">
            <div className="processing">{intl.formatMessage({ id: 'common.order.processing' })}</div>
          </div>
        </div>
        <div className="middle">
          <div className="middle-item">
            <div className="left">
              <Iconfont icon={'icon-daojishi'}></Iconfont>
              {intl.formatMessage({ id: "staking.detail.day.reward" })}
            </div>
            <div className="right">
              {dayjs('2024-01-15 14:30:00').format('YYYY-MM-DD HH:mm:ss')}
            </div>
          </div>

          <div className="middle-item">
            <div className="left">
              <Iconfont icon={'icon-meijin'}></Iconfont>
              {intl.formatMessage({ id: "staking.detail.amount" })}
            </div>
            <div className="right">
              10,000 TYOE
            </div>
          </div>

          <div className="middle-item">
            <div className="left">
              <Iconfont icon={'icon-rise'}></Iconfont>
              {intl.formatMessage({ id: "staking.detail.day.reward" })}
            </div>
            <div className="right">
              0.5%
            </div>
          </div>

          <div className="middle-item">
            <div className="left">
              {intl.formatMessage({ id: "staking.detail.calc.reward" })}
            </div>
            <div className="right success">
              250 TYOE
            </div>
          </div>
        </div>
        <div className="bottom">
          <button>{intl.formatMessage({ id: "staking.detail.Withdraw" })}</button>
        </div>
      </div>

      <div className="staking-records-list-item">
        <div className="top">
          <div className="left">
            {intl.formatMessage({ id: 'common.order.no' })}:STK001234567890
          </div>
          <div className="right">
            <div className="finished">{intl.formatMessage({ id: 'common.order.processing' })}</div>
          </div>
        </div>
        <div className="middle">
          <div className="middle-item">
            <div className="left">
              <Iconfont icon={'icon-daojishi'}></Iconfont>
              {intl.formatMessage({ id: "staking.detail.day.reward" })}
            </div>
            <div className="right">
              {dayjs('2024-01-15 14:30:00').format('YYYY-MM-DD HH:mm:ss')}
            </div>
          </div>

          <div className="middle-item">
            <div className="left">
              <Iconfont icon={'icon-meijin'}></Iconfont>
              {intl.formatMessage({ id: "staking.detail.amount" })}
            </div>
            <div className="right">
              10,000 TYOE
            </div>
          </div>

          <div className="middle-item">
            <div className="left">
              <Iconfont icon={'icon-rise'}></Iconfont>
              {intl.formatMessage({ id: "staking.detail.day.reward" })}
            </div>
            <div className="right">
              0.5%
            </div>
          </div>

          <div className="middle-item">
            <div className="left">
              {intl.formatMessage({ id: "staking.detail.calc.reward" })}
            </div>
            <div className="right success">
              250 TYOE
            </div>
          </div>
        </div>

      </div>
      </div>
    </div>
  </Layouts>
}

export default StakingRecords;