import Layouts from '@/component/Layouts.tsx';
import { useIntl } from 'react-intl';
import './Staking.scss';
import { formatNumber, generateRandomString } from '@/utils/common.ts';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import {
  buyProduct,
  getGoodsList,
  getStakingInfo,
  StaingGoodsInterface,
  StakingInfoInterface,
} from '@/service/staking.ts';
import Iconfont from '@/component/Iconfont.tsx';
import { useSignMessage } from 'wagmi';
import { Toast } from 'react-vant';

const Staking = ()=>{
  const intl = useIntl();
  const navigator = useNavigate()

  const [nodeFees,setNodeFees] = useState<StaingGoodsInterface[]>([])
  const [selectedGoodsIndex,setSelectedGoodsIndex] = useState(-1)
  let  timeout: NodeJS.Timeout | string | number | undefined = 0;
  const {signMessageAsync,} = useSignMessage()
  const [stakeInfo,setStakeInfo] = useState<StakingInfoInterface|null>(null)

  const [stakingValue,setStakingValue ] = useState<string|number>('')
  // 请求数据
  useEffect(() => {
    const fetchData =async ()=>{
      const stakingfeeList = await getGoodsList()
      setNodeFees(stakingfeeList.list)
      await getStakeInfo()
      setSelectedGoodsIndex(stakingfeeList.list.length >0 ? 0 : -1)
    }
    fetchData()
  }, []);

  const getStakeInfo = async () =>{
    const info  = await getStakingInfo()
    console.log(info);
    setStakeInfo(info)
  }


  const curSelectedGood = useMemo(() => {
    if(nodeFees){
      return nodeFees[selectedGoodsIndex]
    }
    return null;
  }, [nodeFees, selectedGoodsIndex]);

  const handleStaking =  (e:any) => {
    setStakingValue(parseInt(e.target.value))
  }

  // 选择一个产品，没有选产品就是 true
  // 没质押有值就是 true
  // stakingvalue 小于 选中的价格
  const buttonDisabled = useMemo(()=>{
    return !curSelectedGood || !stakingValue || !(Number(stakingValue) >= Number(curSelectedGood. price))
  },[curSelectedGood, stakingValue])


  useEffect(() => {
    const value = Number(stakingValue)
    if(value){
      clearTimeout(timeout)
      timeout = setTimeout(()=>{
        const index = nodeFees.findIndex((item)=>{
          return  value -Number(item.price)  >= 0 && Number(item.maxprice) - value >=0
        })
        setSelectedGoodsIndex(index)
      },300)
    }
  }, [stakingValue]);

  const handleConfirmClick = async ()=>{
    if(buttonDisabled) return
    //   todo
    const hex = generateRandomString(32)
    // 签名
    const signed  = await signMessageAsync({message:hex})
    console.log(signed)

    try{
      await buyProduct({id:nodeFees[selectedGoodsIndex].id,amount:stakingValue.toString(),hex:hex,signed:signed})
      Toast.success(intl.formatMessage({id:'common.success'}))
      await getStakeInfo()
    }catch (e:any) {
      Toast(e)
    }
  }

  return <Layouts title={intl.formatMessage({ id: 'nav.staking' })} right={
    <Iconfont className={'layout-icon'} icon="icon-jilu_" onClick={()=>{navigator('/staking-records')}} />
  }>
    <div className="card staking-info bd">
      <div className="list">
        <div className="list-item">
          <div className="coin">
            <Iconfont icon={'icon-jijinzhiya'}/>
          </div>
          <div className="label">
            {intl.formatMessage({ id: 'staking.total' })}
          </div>
          <div className="value">
            $ {formatNumber(Number(stakeInfo?.pledgetotal||0))}
          </div>
        </div>

        <div className="list-item">
          <div className="coin">
            <Iconfont icon={'icon-jijinchi'}/>
          </div>
          <div className="label">
            {intl.formatMessage({ id: 'staking.fund.commission' })}
          </div>
          <div className="value">
            $ {formatNumber(Number(stakeInfo?.pledgegetmoney||0))}
          </div>
        </div>

        <div className="list-item">
          <div className="coin">
            <Iconfont icon={'icon-jijinzhi'}/>
          </div>
          <div className="label">
            {intl.formatMessage({ id: 'staking.fund.total' })}
          </div>
          <div className="value">
            {formatNumber(Number(stakeInfo?.pledgeNumber||0))}
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
          <div className="th">{intl.formatMessage({ id: 'staking.multiplier' })}</div>
          <div className="th">{intl.formatMessage({ id: 'staking.daily.rate' })}</div>
        </div>
        {
          nodeFees.map((item,index)=> {
            return <div className={`table-row-td ${selectedGoodsIndex === index ? 'active':''}`} onClick={()=>{setSelectedGoodsIndex(index)}} key={item.id}>
              <div className="td">{item.name}</div>
              <div className="td">{Number(item.total)}倍</div>
              <div className="td">{Number(item.reward)}%</div>
            </div>;
          })
        }
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
          <input type="text" value={stakingValue} placeholder={intl.formatMessage({ id: 'staking.amount.placeholder' })} onInput={handleStaking} />
        </div>
        <div>
          {(buttonDisabled && curSelectedGood?.price && stakingValue !== '' )?`不能小于产品价格${curSelectedGood?.price}`:""}
        </div>
      </div>

      <div className="form-item">
        <div className="label">
          {intl.formatMessage({ id: 'staking.selected.tier.info' })}
        </div>
        {
          curSelectedGood && <div className="list">
            <div className="list-item">
              <div className="top">{intl.formatMessage({ id: 'staking.token.multiplier' })}</div>
              <div className="value">{Number(curSelectedGood.total)}{intl.formatMessage({ id: 'staking.multiplier.unit' })}</div>
            </div>
            <div className="list-item">
              <div className="top">{intl.formatMessage({ id: 'staking.daily.yield' })}</div>
              <div className="value">{Number(curSelectedGood.reward)}%</div>
            </div>
          </div>
        }

      </div>

      {buttonDisabled}
      <div className={`button button-block ${buttonDisabled ? 'button-disabled' : ''}`} onClick={handleConfirmClick}>{intl.formatMessage({ id: 'staking.confirm' })}</div>

    </div>

  </Layouts>
}
export default Staking