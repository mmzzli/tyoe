import Layouts from '@/component/Layouts.tsx';
import { useIntl } from 'react-intl';
import './Assets.scss';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserAssets, UserAssetsInterface, UserAssetsItem } from '@/service/user.ts';
import { List, PullRefresh } from 'react-vant';
import Iconfont from '@/component/Iconfont.tsx';
import dayjs from 'dayjs';
import { BigNumber } from 'bignumber.js';

const Assets = ()=>{
  const intl = useIntl();
  const navigator = useNavigate()
  const [loading, setLoading] = useState(false);

  const tabs = [
    {
      value:'all',
      label:intl.formatMessage({id:'common.all'}),
    },
    {
      value:'1',
      label:'Da Lat',
      icon:<Iconfont icon={'icon-jijinfenyong'}></Iconfont>
    },
    {
      value:'3',
      label:intl.formatMessage({id:'staking.fund.total'}),
      icon:<Iconfont icon={'icon-jijinfenyong-2'}></Iconfont>
    }
  ]

  const typeMap = {
    "assets.type.6":intl.formatMessage({id:"assets.type.6"}),
    "assets.type.7":intl.formatMessage({id:"assets.type.7"}),
    "assets.type.8":intl.formatMessage({id:"assets.type.8"}),
    "assets.type.9":intl.formatMessage({id:"assets.type.9"}),
    "assets.type.10":intl.formatMessage({id:"assets.type.10"}),
    "assets.type.11":intl.formatMessage({id:"assets.type.11"}),
    "assets.type.19":intl.formatMessage({id:"assets.type.19"}),
    "assets.type.20":intl.formatMessage({id:"assets.type.20"}),
  }
  const [type,setType] = useState(tabs[0].value)
  const [assets,setAssets] = useState<UserAssetsInterface|null>(null)
  const [finished, setFinished] = useState<boolean>(false)
  const [,setTotal] = useState(0)
  const [list,setList] = useState<UserAssetsItem[]>([])
  const [page,setPage] = useState(1)

  // 请求数据
  const fetchAssets = async (pageNum:number, isRefresh = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const params:any = {
        page: pageNum,
        types: type
      }
      const res = await getUserAssets(params)
      setAssets(res)
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
    await fetchAssets(1, true)
  }

  // 分页加载
  const onLoad = async () => {
    if (loading || finished) return;
    await fetchAssets(page)
  }

  // 切换tab时刷新
  useEffect(() => {
    onRefresh()
  }, [type]);

  return <Layouts title={intl.formatMessage({ id: 'nav.assets' })}>
    <div className="card asset-info">
      <div className="title">
        {intl.formatMessage({ id: 'assets.total' })}
      </div>
      <div className="value">
        ${BigNumber(assets?.wallet?.toUsdtCost||0).toFormat()}
      </div>
      <div className="list">
        <div className="list-item">
          <div className="top">Da Lat</div>
          <div className="bottom">{BigNumber(assets?.wallet?.usdt_num||0).toFormat()}</div>
        </div>

        <div className="list-item">
          <div className="top">{intl.formatMessage({ id: 'staking.fund.total' })}</div>
          <div className="bottom">{BigNumber(assets?.wallet?.wp_num||0).toFormat()}</div>
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
            <i className="iconfont icon-rise"></i>
          </div>
          <div className="top">{intl.formatMessage({id:'assets.commission.static'})}</div>
          <div className="bottom">{assets?.reward?.stateMoney}</div>
        </div>

        <div className="list-item">
          <div className="icon">
            <i className="iconfont icon-rise" style={{transform:'rotateX(180deg)'}}></i>

          </div>
          <div className="top">{intl.formatMessage({id:'assets.commission.dynamic'})}</div>
            <div className="bottom">{assets?.reward?.trendsMoney}</div>
          </div>

        <div className="list-item">
          <div className="icon">
            <Iconfont icon={'icon-jiedianfenyong'}></Iconfont>
          </div>
            <div className="top">{intl.formatMessage({id:'assets.commission.node'})}</div>
            <div className="bottom">{assets?.reward?.nodeMoney}</div>
          </div>

        <div className="list-item">
          <div className="icon">
            <Iconfont icon={'icon-jijinfenyong'}></Iconfont>

          </div>
            <div className="top">{intl.formatMessage({ id: 'assets.commission.fund' })}</div>
            <div className="bottom">{assets?.reward?.pondMoney}</div>
          </div>
        </div>
      </div>

    <div className="card asset-detail">
      <div className="top">
        <div className="title">
          {intl.formatMessage({ id: 'assets.details' })}
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
        <PullRefresh onRefresh={onRefresh} className={'record-list'}>
          <List finished={finished} onLoad={onLoad} className="staking-records-list">
          {
            list.map((item) => {
              const tab = tabs.find(tab=>Number(item.get_type)===Number(tab.value))
              return <div key={item.id} className="record-list-item">
                <div className="left">
                  <div className="coin">
                    {tab?.icon}
                  </div>
                  <div className="box">
                    <div className="up">{typeMap[`assets.type.${item.types}` as keyof typeof typeMap]}</div>
                    <div className="time">{dayjs(item.create_time).format('YYYY-MM-DD HH:mm')}</div>
                  </div>
                </div>
                <div className="right">
                  <div className={`up ${item.statusint === 0 ?'price-rise' :'price-down'}`}>{item.statusint === 0 ? '+':'-'}{BigNumber(item.amount).toFormat()}</div>
                  <div className="down">{intl.formatMessage({id:'withdraw.balance'})}：{BigNumber(item.oldamount).minus(BigNumber(item.amount)).toFormat()}</div>
                </div>
              </div>;
            })
          }
          </List>
        </PullRefresh>
      </div>
    </div>
  </Layouts>
}
export default Assets