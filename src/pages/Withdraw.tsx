import Layouts from '@/component/Layouts.tsx';
import { useIntl } from 'react-intl';
import './Withdraw.scss';
import { BigNumber } from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';
import {
  getWithdrawInfo,
  widthDrawedList,
  WithdrawInfoInterface,
  WithdrawListItemInterface,
  withdrawSubmit,
} from '@/service/withdraw.ts';
import { generateRandomString } from '@/utils/common.ts';
import { useSignMessage } from 'wagmi';
import { List, PullRefresh, Toast } from 'react-vant';
import dayjs from 'dayjs';
import Iconfont from '@/component/Iconfont.tsx';

const Withdraw = ()=>{
  const intl = useIntl();

  const [amount,setAmount] = useState('')
  const {signMessageAsync} = useSignMessage()
  const [withdrawInfo,setWithdrawInfo] = useState<WithdrawInfoInterface|null>(null)
  const [list,setList] = useState<WithdrawListItemInterface[]>([])
  const [finished, setFinished] = useState<boolean>(false)
  const [,setTotal] = useState(0)
  const [page,setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  // 请求数据
  const fetchRecords = async (pageNum:number, isRefresh = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const params:any = {
        page: pageNum
      }
      const res = await widthDrawedList(params)
      const total = res.total||0
      setTotal(total)
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

  const fetchData = async ()=>{
    const res = await getWithdrawInfo()
    setWithdrawInfo(res)
  }

  useEffect(() => {
    fetchData();
  }, []);

  const getOutAmount = useMemo(() => {
    return BigNumber(amount||0).multipliedBy(100-parseInt(withdrawInfo?.UsdtOutFee||'0')||0).div(100).toFormat()
  }, [amount,withdrawInfo]);

  const widthDrawButtonDisabled = useMemo(()=>{
    if(amount && withdrawInfo?.UsdtOutmin && withdrawInfo?.UsdtOutmax){
      return BigNumber(amount||0).isLessThan(withdrawInfo?.UsdtOutmin) || BigNumber(amount||0).isGreaterThan(withdrawInfo?.UsdtOutmax)
    }
    return true
  },[amount,withdrawInfo?.UsdtOutmin,withdrawInfo?.UsdtOutmax])


  const handlerWithdraw = async () =>{
    try{
      // 签名
      const hex = generateRandomString(32)
      const signed  = await signMessageAsync({message:hex})
      await withdrawSubmit({hex,signed,amount})
      Toast.success('success')
      await fetchData()
      await onRefresh();
    }catch (e:any) {
      Toast(e?.message||e)
    }
  }

  return <Layouts title={intl.formatMessage({ id: 'assets.withdraw' })}>
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
          <div className="right">{intl.formatMessage({ id: 'withdraw.balance' })}:{BigNumber(withdrawInfo?.usdt_num||0).toFormat()}</div>
        </div>
        <div className="input">
          <input type="number" value={amount} onInput={(e:any)=>{setAmount(e.target.value)}} placeholder={intl.formatMessage({ id: '请输入提现数量' })} />
          <div className="btn" onClick={()=>{setAmount(Number(withdrawInfo?.usdt_num).toString()||'0')}}>MAX</div>
        </div>
      </div>
      <div className="other-info">
        <div className="item">
          <div className="left">
            {intl.formatMessage({ id: 'withdraw.fee' })}
          </div>
          <div className="right" style={{color:'#fc6612'}}>{withdrawInfo?.UsdtOutFee}</div>
        </div>
        <div className="item">
          <div className="left">
            {intl.formatMessage({ id: 'withdraw.receive' })}
          </div>
          <div className="right" style={{color:'#3DD473'}}>{getOutAmount} Da Lat</div>
        </div>
      </div>
      <div className={`button-block button ${widthDrawButtonDisabled?'button-disabled':''}`} onClick={handlerWithdraw}>
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
        <PullRefresh onRefresh={onRefresh} className={'record-list'}>
          <List finished={finished} onLoad={onLoad} className="staking-records-list">
            {
              list.map((item)=> {
                const float = item.num.startsWith('-')
                return <div className="record-list-item" key={item.id}>
                  <div className="left">
                    <Iconfont icon="icon-DaLat"></Iconfont>
                    <div className="box">
                      <div className="up">Da Lat</div>
                      <div className="time">{dayjs(item.create_time).format('YYYY-MM-DD HH:mm:ss')}</div>
                    </div>
                  </div>
                  <div className="right">
                    <div className="tip">

                      {item.status === 0 && <><Iconfont icon={'icon-shijiankaishishijian'}/> {intl.formatMessage({ id: 'common.ongoing' })}</>}
                      {item.status === 1 && <><Iconfont icon={'icon-zhaungtai1'}/>{intl.formatMessage({ id: 'common.completed' })}</>}
                      {item.status === 2 && <><Iconfont icon={'icon-tishishibai'}/>{intl.formatMessage({ id: 'common.failed' })}</>}

                    </div>
                    <div className={`up ${float?'price-down':'price-rise'}`}>{float?'-':'+'}{BigNumber(float?item.num.slice(1):item.num).toFormat()}</div>
                    <div className="down">{intl.formatMessage({id:'withdraw.balance'})}：{BigNumber(item.coinname||0).toFormat()}</div>
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
export default Withdraw