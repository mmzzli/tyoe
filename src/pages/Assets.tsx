import Layouts from '@/component/Layouts.tsx';
import { useIntl } from 'react-intl';
import './Assets.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserAssets, UserAssetsInterface, UserAssetsItem } from '@/service/user.ts';
import { List, PullRefresh } from 'react-vant';
import Iconfont from '@/component/Iconfont.tsx';
import dayjs from 'dayjs';
import { BigNumber } from 'bignumber.js';
import { formatAddress } from '@/utils/common.ts';

const Assets = ()=>{
  const intl = useIntl();
  const navigator = useNavigate()
  const [loading, setLoading] = useState(false);


  const types:any  = {
    18:{
      label:intl.formatMessage({id:'assets.shuhui'}),
      icon:<Iconfont icon={'icon-rise'}></Iconfont>
    },
    19:{
      label:intl.formatMessage({id:'assets.stake'}),
      icon:<Iconfont icon={'icon-rise'}></Iconfont>
    },
    7:{
      label:intl.formatMessage({id:'assets.withdraw'}),
      icon:<Iconfont icon={'icon-arrow-right-up-red'}></Iconfont>
    },
    10:{
      label:intl.formatMessage({id:'assets.withdraw.back'}),
      icon:<Iconfont icon={'icon-rise'}></Iconfont>
    },
    20:{
      label:intl.formatMessage({id:'assets.stake.reward'}),
      icon:<Iconfont icon={'icon-rise'}></Iconfont>
    },
    21:{
      label:intl.formatMessage({id:'assets.reward'}),
      icon:<Iconfont icon={'icon-rise'}></Iconfont>
    },
    26:{
      label:intl.formatMessage({id:'assets.system'}),
      icon:<Iconfont icon={'icon-rise'}></Iconfont>
    },
  }

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
        limit:10
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


  return <Layouts title={intl.formatMessage({ id: 'assets.title' })}>
    <div className="card asset-info">
      <div className="common-title">
        <Iconfont icon={'icon-qianbao'}></Iconfont>
        {intl.formatMessage({ id: 'assets.balance' })}
      </div>
      <div className="value">
        <div className="value-item">
          <div className="top">
            {intl.formatMessage({id:'staking.balance'})}
          </div>
          <div className="bottom">
            {BigNumber(assets?.wallet.wp_num || 0).toFormat()}<span>TYOE</span>
          </div>
        </div>
        <div className="value-item">
          <div className="top">
            {intl.formatMessage({id:'staking.back.balance'})}
          </div>
          <div className="bottom">
            {BigNumber(assets?.wallet.usdt_num || 0).toFormat()}<span>TYOE</span>
          </div>
        </div>


      </div>

      <div className="button" onClick={()=>{navigator('/withdraw')}}>
        <Iconfont icon={'icon-arrow-right-up'}></Iconfont>
        {intl.formatMessage({id:'assets.withdraw'})}</div>
    </div>


    <div className="card asset-all">
      <div className="common-title">
        {intl.formatMessage({ id: 'assets.all' })}
      </div>

      <div className="list">
        <div className="list-item">
          <div className="left">
            {intl.formatMessage({ id: 'assets.total' })}
          </div>
          <div className="middle">
            {BigNumber(assets?.reward.totalMoney||0).toFormat()} TYOE
          </div>

        </div>
        <div className="list-item">
          <div className="left">
            {intl.formatMessage({ id: 'assets.staking' })}
          </div>
          <div className="middle">
            {BigNumber(assets?.reward.pledgeMoney||0).toFormat()} TYOE
          </div>

        </div>
        <div className="list-item">
          <div className="left">
            {intl.formatMessage({ id: 'assets.today' })}
          </div>
          <div className="middle">
            {BigNumber(assets?.reward.pondMoney||0).toFormat()} TYOE
          </div>

        </div>
      </div>
    </div>

    <div className="card asset-detail">
      <div className="common-title">
        {intl.formatMessage({ id: 'assets.records' })}
      </div>

      <div className="record-list">
        <PullRefresh onRefresh={onRefresh} className={'record-list'}>
          <List finished={finished} onLoad={onLoad} className="record-list">
            {
              list.map((item) => {
                return <div className="item" key={item.id}>
                  <div className="left">
                    {types[item.types]?.icon}
                  </div>
                  <div className="middle">
                    <div className="top">{types[item.types]?.label}</div>
                    <div className="center">{dayjs(item.create_time).format('YYYY-MM-DD HH:mm:ss')}</div>
                    <div className="bottom">{formatAddress(item.account)}</div>
                  </div>
                  <div className="right">
                    <div className={`top ${item.statusint === 0 ? 'success':'warning'}`}>{item.statusint === 0 ? '+':'-'} {BigNumber(item.amount||0).toFormat()} TYOE</div>
                    <div className="bottom">{intl.formatMessage({ id: 'assets.status.completed' })}</div>
                  </div>
                </div>
              })
            }


          </List>
        </PullRefresh>
      </div>
    </div>
  </Layouts>
}
export default Assets