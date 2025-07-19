import Layouts from '@/component/Layouts.tsx';
import { useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import './StakingRecords.scss';
import { getStakingRecord, StakingRecordInterface } from '@/service/staking.ts';
import { List, PullRefresh } from 'react-vant';
import dayjs from 'dayjs';
import Iconfont from '@/component/Iconfont.tsx';
import {BigNumber} from 'bignumber.js'

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
    <div className="list ">
      <PullRefresh onRefresh={onRefresh}>
      <List finished={finished} onLoad={onLoad} className="staking-records-list">
      {
        list.map((item) => {
          const tab = tabs.find((tab) => Number(tab.value) === Number(item.status_name))
          return <div className="list-item card" key={item.id}>
            <div className="top">
              <div className="left">
                <Iconfont icon="icon-DaLat"></Iconfont>
                <div className={'order-info'}>
                  <div className="up">
                    {intl.formatMessage({ id: 'staking.order.id' })}
                  </div>
                  <div className="middle">
                    {item.order_no}
                  </div>
                  <div className="down">
                    {tab?.icon} {tab?.label}
                  </div>
                </div>
              </div>
              <div className="right">{item.remark} % {intl.formatMessage({id:'staking.daily.rate'})}</div>
            </div>
            <div className="ul-list">
              <div className="item">
                <div className="left">{intl.formatMessage({ id: 'staking.fund.value' })}</div>
                <div className="right">{BigNumber(item.buy_price).toFormat()}</div>
              </div>
              <div className="item">
                <div className="left">{intl.formatMessage({ id: 'staking.dalat.amount' })}</div>
                <div className="right">{BigNumber(item.total_money).toFormat()} Da Lat</div>
              </div>
              <div className="item">
                <div className="left">{intl.formatMessage({ id: 'staking.pending.dalat' })}</div>
                <div className="right">{Number(item.core_num)-Number(item.total_money)} Da Lat</div>
              </div>
              <div className="item">
                <div className="left">{intl.formatMessage({ id: 'staking.start.time' })}</div>
                <div className="right">{dayjs(item.create_time).format('YYYY-MM-DD HH:mm')}</div>
              </div>
              {
                item.confirm_time && <div className="item">
                  <div className="left">{intl.formatMessage({ id: 'staking.end.time' })}</div>
                  <div
                    className="right">{item.confirm_time ? dayjs(item.confirm_time).format('YYYY-MM-DD HH:mm') : ''}</div>
                </div>
              }

            </div>
          </div>;
          ;
        })
      }
      </List>
      </PullRefresh>
    </div>
  </Layouts>
}

export default StakingRecords;