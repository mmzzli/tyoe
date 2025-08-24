import Layouts from '@/component/Layouts.tsx';
import { useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import './StakingRecords.scss';
import {
  getStakingInfo,
  getStakingRecord,
  StakingInfoInterface,
  StakingRecordInterface,
  unStake,
} from '@/service/staking.ts';
import Iconfont from '@/component/Iconfont.tsx';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';
import { List, PullRefresh, Toast } from 'react-vant';

const StakingRecords = () =>{
  const intl = useIntl()

  const [list,setList] = useState<StakingRecordInterface[]>([])
  const [finished, setFinished] = useState<boolean>(false)
  const [,setTotal] = useState(0)
  const [page,setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [stakingInfo,setStakingInfo] = useState<StakingInfoInterface|null>(null)
  const fetchStakingInfo = async ()=>{
    const res = await getStakingInfo()
    setStakingInfo(res)
  }

  useEffect(() => {
    fetchStakingInfo()
  }, []);
  // 请求数据
  const fetchRecords = async (pageNum:number, isRefresh = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const params:any = { page: pageNum }
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

  const statusTypes:any = {
    0: <div className="waiting">{intl.formatMessage({ id: 'common.order.waiting' })}</div>,
    1: <div className="processing">{intl.formatMessage({ id: 'common.order.processing' })}</div>,
    2: <div className="finished">{intl.formatMessage({ id: 'common.order.done' })}</div>,
  }

  const handlerUnStaking = async (item:StakingRecordInterface)=>{
    try{
      await unStake({id:item.id})
      Toast(intl.formatMessage({id:'staking.back'}))
      await onRefresh()
    }catch (e:any) {
      Toast(e?.message||e)
      console.log(e);
    }
  }

  return <Layouts title={intl.formatMessage({ id: 'staking.records' })}>
    <div className="staking-records-detail">
      <div className="staking-records-detail-card">
        <div className="title">{intl.formatMessage({ id: 'staking.detail.total.amount' })}</div>
        <div className="content">{BigNumber(stakingInfo?.pledgetotal||0).toFormat()} TYOE</div>
      </div>
      <div className="staking-records-detail-card">
        <div className="title">{intl.formatMessage({ id: 'staking.detail.total.reward' })}</div>
        <div className="content success">{BigNumber(stakingInfo?.pledgegetmoney||0).toFormat()} TYOE</div>
      </div>
    </div>
    <div className="staking-records-list">
      <div className="title">
        {intl.formatMessage({ id: 'staking.records' })}({list.length})
      </div>
      <div className="staking-records-list-box">
        <PullRefresh onRefresh={onRefresh}>
          <List finished={finished} onLoad={onLoad} className={'staking-records-list-box'}>
            {
              list.map((item) => {
                return <div key={item.id} className="staking-records-list-item">
                  <div className="top">
                    <div className="left">
                      {intl.formatMessage({ id: 'common.order.no' })}:{item.order_no}
                    </div>
                    <div className="right">
                      {statusTypes[item.status_name]}
                    </div>
                  </div>
                  <div className="middle">
                    <div className="middle-item">
                      <div className="left">
                        <Iconfont icon={'icon-daojishi'}></Iconfont>
                        {intl.formatMessage({ id: "staking.detail.day.reward" })}
                      </div>
                      <div className="right">
                        {dayjs(item.create_time).format('YYYY-MM-DD HH:mm:ss')}
                      </div>
                    </div>

                    <div className="middle-item">
                      <div className="left">
                        <Iconfont icon={'icon-meijin'}></Iconfont>
                        {intl.formatMessage({ id: "staking.detail.amount" })}
                      </div>
                      <div className="right">
                        {BigNumber(item.buy_price).toFormat()} TYOE
                      </div>
                    </div>

                    <div className="middle-item">
                      <div className="left">
                        <Iconfont icon={'icon-rise'}></Iconfont>
                        {intl.formatMessage({ id: "staking.detail.day.reward" })}
                      </div>
                      <div className="right">
                        {BigNumber(item.remark).multipliedBy(100).toFormat()} %
                      </div>
                    </div>

                    <div className="middle-item">
                      <div className="left">
                        {intl.formatMessage({ id: "staking.detail.calc.reward" })}
                      </div>
                      <div className="right success">
                        {BigNumber(item.total_money).toFormat()} TYOE
                      </div>
                    </div>
                  </div>

                  {
                    item.status_name === 1 && <div className="bottom">
                      <button onClick={() => {
                        handlerUnStaking(item);
                      }}>{intl.formatMessage({ id: 'staking.detail.Withdraw' })}</button>
                    </div>
                  }

                </div>
              })
            }


          </List>
        </PullRefresh>
      </div>
    </div>
  </Layouts>
}

export default StakingRecords;