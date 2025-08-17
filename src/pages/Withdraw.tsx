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
      setFinished(newList.length >= total)
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
      Toast.success(intl.formatMessage({id:'common.success'}))
      await fetchData()
      await onRefresh();
    }catch (e:any) {
      Toast(e?.message||e)
    }
  }

  return <Layouts title={intl.formatMessage({ id: 'nav.withdraw' })}>
    <div className="card withdraw-info">
      <div className="card-title">
        {intl.formatMessage({ id: 'withdraw.title' })}
      </div>
      <div className="form-item">
        <div className="label">
          {intl.formatMessage({ id: 'withdraw.address' })}
        </div>
        <div className="input input-between">
          <div className="l">
            0x1311....131341
          </div>
          <div className="r">ERC20</div>
        </div>
      </div>

      <div className="form-item">
        <div className="label">
          <div className="left">{intl.formatMessage({ id: 'withdraw.amount' })}</div>
          <div className="right">
            <Iconfont icon={'icon-qianbao'}/>
            {intl.formatMessage({ id: 'withdraw.balance' })}:{BigNumber(withdrawInfo?.usdt_num||0).toFormat()}</div>
        </div>
        <div className="input">
          <input type="number" value={amount} onInput={(e:any)=>{setAmount(e.target.value)}} placeholder={intl.formatMessage({id:'withdraw.placeholder.amount'})} />
          <div className="btn" onClick={()=>{setAmount(Number(withdrawInfo?.usdt_num).toString()||'0')}}>MAX</div>
        </div>
      </div>
      <div className="other-info">
        <div className="item">
          <div className="left">
            {intl.formatMessage({ id: 'withdraw.fee' })}
          </div>
          <div className="right" >{withdrawInfo?.UsdtOutFee} TYOE</div>
        </div>
        <div className="item">
          <div className="left">
            {intl.formatMessage({ id: 'withdraw.receive' })}
          </div>
          <div className="right success" >{getOutAmount} TYOE</div>
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
        <div className="record-list-item-li">
          <div className="top">
            <div className="left">
              {dayjs('2024-01-15 14:30:00').format('YYYY-MM-DD HH:mm:ss')}
            </div>
            <div className="right">
              <div className="processing">{intl.formatMessage({ id: 'common.order.processing' })}</div>
            </div>
          </div>
          <div className="hash">
            {intl.formatMessage({id:'withdraw.hash'})} 0x13124...1341234
          </div>
          <div className="middle">
            <div className="middle-item">
              <div className="left">
                {intl.formatMessage({ id: "withdraw.amount" })}
              </div>
              <div className="right">
                5,000 TYOE
              </div>
            </div>

            <div className="middle-item">
              <div className="left">
                {intl.formatMessage({ id: "withdraw.fee" })}

              </div>
              <div className="right">
                50 TYOE
              </div>
            </div>


          </div>
        </div>

        <div className="record-list-item-li">
          <div className="top">
            <div className="left">
              {dayjs('2024-01-15 14:30:00').format('YYYY-MM-DD HH:mm:ss')}
            </div>
            <div className="right">
              <div className="successed">{intl.formatMessage({ id: 'withdraw.status.success' })}</div>
            </div>
          </div>
          <div className="hash">
            {intl.formatMessage({ id: 'withdraw.hash' })} 0x13124...1341234
          </div>
          <div className="middle">
            <div className="middle-item">
              <div className="left">
                {intl.formatMessage({ id: 'withdraw.amount' })}
              </div>
              <div className="right">
                5,000 TYOE
              </div>
            </div>

            <div className="middle-item">
              <div className="left">
                {intl.formatMessage({ id: 'withdraw.fee' })}

              </div>
              <div className="right">
                50 TYOE
              </div>
            </div>


          </div>
        </div>
        <div className="record-list-item-li">
          <div className="top">
            <div className="left">
              {dayjs('2024-01-15 14:30:00').format('YYYY-MM-DD HH:mm:ss')}
            </div>
            <div className="right">
              <div className="failed">{intl.formatMessage({ id: 'withdraw.status.reject' })}</div>
            </div>
          </div>
          <div className="hash">
            {intl.formatMessage({ id: 'withdraw.hash' })} 0x13124...1341234
          </div>
          <div className="middle">
            <div className="middle-item">
              <div className="left">
                {intl.formatMessage({ id: "withdraw.amount" })}
              </div>
              <div className="right">
                5,000 TYOE
              </div>
            </div>

            <div className="middle-item">
              <div className="left">
                {intl.formatMessage({ id: "withdraw.fee" })}

              </div>
              <div className="right">
                50 TYOE
              </div>
            </div>


          </div>
        </div>

      </div>
    </div>
  </Layouts>
}
export default Withdraw