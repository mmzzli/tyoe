import websiteBannerUrl from '@/assets/images/websitebanner.png';
import { useIntl } from 'react-intl';
import news1Svg from '@/assets/images/website/news1.svg';
import news2Svg from '@/assets/images/website/news1.svg';
import get1Svg from '@/assets/images/website/get1.svg';
import get2Svg from '@/assets/images/website/get2.svg';
import get3Svg from '@/assets/images/website/get3.svg';
import get4Svg from '@/assets/images/website/get4.svg';

import './Website.scss';
import Iconfont from '@/component/Iconfont.tsx';
import { Popup, Swiper, Toast } from 'react-vant';
import { getLoginOrRegister, getUserInfo, setInviteLink } from '@/service/user.ts';
import { TOKEN } from '@/utils/const.ts';
import { generateRandomString } from '@/utils/common.ts';
import { useEffect, useState } from 'react';
import { useAccount, usePublicClient, useSignMessage, useWriteContract } from 'wagmi';
import { useLocation, useNavigate } from 'react-router-dom';
import useUserStore from '@/store/user.ts';
import { contract } from '@/wagmi.ts';
import { manager, token } from '@/abi/tyoe.ts';
import BigNumber from 'bignumber.js';
import { buyProduct, getGoodsList, getStakingInfo, StakingInfoInterface } from '@/service/staking.ts';
import NavBar from '@/component/NavBar.tsx';


const Website  = ()=>{
  const intl  = useIntl()
  const news = [
    {
      title:intl.formatMessage({id:'website.new.item1.title'}),
      desc:intl.formatMessage({id:"website.new.item1.desc"}),
      urlimg:news1Svg,
      bg:'#F2F0FE'
    },
    {
      title:intl.formatMessage({id:'website.new.item2.title'}),
      desc:intl.formatMessage({id:"website.new.item2.desc"}),
      urlimg:news2Svg,
      bg:'#E6F4F0'
    }
  ]
  const problems = [
    {
      title:intl.formatMessage({id:'website.problem.item1.top'}),
      desc:intl.formatMessage({id:'website.problem.item1.desc'})
    },
    {
      title:intl.formatMessage({id:'website.problem.item2.top'}),
      desc:intl.formatMessage({id:'website.problem.item2.desc'})
    },
    {
      title:intl.formatMessage({id:'website.problem.item3.top'}),
      desc:intl.formatMessage({id:'website.problem.item3.desc'})
    },
    {
      title:intl.formatMessage({id:'website.problem.item4.top'}),
      desc:intl.formatMessage({id:'website.problem.item4.desc'})
    },
    {
      title:intl.formatMessage({id:'website.problem.item5.top'}),
      desc:intl.formatMessage({id:'website.problem.item5.desc'})
    },
    {
      title:intl.formatMessage({id:'website.problem.item6.top'}),
      desc:intl.formatMessage({id:'website.problem.item6.desc'})
    }
  ]
  const getEths = [
    {
      imgurl:get1Svg,
      title:intl.formatMessage({id:'website.get.item1.title'})
    },
    {
      imgurl:get2Svg,
      title:intl.formatMessage({id:'website.get.item2.title'})
    },
    {
      imgurl:get3Svg,
      title:intl.formatMessage({id:'website.get.item3.title'})
    },
    {
      imgurl:get4Svg,
      title:intl.formatMessage({id:'website.get.item4.title'})
    }
  ]
  const publicClient = usePublicClient()
  const userStore = useUserStore()
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const {writeContractAsync} = useWriteContract()
  const { address, isConnected,isConnecting, isReconnecting } = useAccount()
  const {signMessageAsync} = useSignMessage()
  const [invite]  = useState(searchParams.get('invite')||'')
  const [, setVisible] = useState(false)
  const [stakingNumber,setStakingNumber] = useState(1);
  const [stakingReNumber,setStakingReNumber] = useState(1);
  const [balance,setBalance]  = useState(0);
  const [stakingBalance,setStakingBalance]  = useState(0);
  const [random,setRandom] = useState(0)
  const [stakingBtnDisabled,setStakingDisabled] = useState(true)
  const [stakingBtnReDisabled,setStakingBtnReDisabled] = useState(true)
  const navigator = useNavigate()
  const [stakingProduct,setStakingProduct] = useState({reward:0,total:0,price:0,maxprice:0})
  const [aboutVisable, setAboutVisable] = useState<boolean>(false)
  const [appVisable, setAppVisable] = useState<boolean>(false)
  const [stakingInfo,setStakingInfo] = useState<StakingInfoInterface|null>(null)
  const [stakingVisable,setStakingVisable] = useState(false);
  const [tabs,setTabs] = useState('1')
  // 绑定上级
  const bindInvite = async () => {
    if(!invite.trim()){
      Toast(intl.formatMessage({id:'bind.invite.placeholder'}))
      return;
    }
    try{
      // 发起请求
      await setInviteLink(invite)
      setVisible(false)
      try{
        const res = await getUserInfo()
        userStore.setUser(res)
      }catch  {
        localStorage.removeItem(TOKEN)
      }
    }catch (e:any) {
      Toast(e)
    }
  }


  const login = async () => {
    const message = generateRandomString(32)
    const data  = await signMessageAsync({message})
    try{
      const res:any = await getLoginOrRegister({account:address!,hex:message,signed:data})
      localStorage.setItem(TOKEN, res)
      await fetchUserInfo()
    }catch (e:any) {
      localStorage.removeItem(TOKEN)
      userStore.setUser(null)
      setVisible(false)
      Toast(e)
    }
  }

  const clearUser = ()=>{
    console.log(88888888);
    localStorage.removeItem(TOKEN)
    userStore.setUser(null)
    setVisible(false)
  }

  const fetchUserInfo = async ()=>{
    try{
      const res = await getUserInfo()
      userStore.setUser(res)
      if(res?.account?.toLowerCase() !== address?.toLowerCase()){
        clearUser()
        login()
      }
    }catch {
      clearUser()
    }
  }

  useEffect(() => {
    if (isConnecting || isReconnecting) {
      return;
    }
    if (!isConnected || !address) {
      console.log(9999999,'=======');
      clearUser();
      return;
    }
    if(isConnected && address){
      if(localStorage.getItem(TOKEN)){
        fetchUserInfo()
      }else{
        login()
      }
    }
  }, [isConnected, address, isConnecting, isReconnecting]);



  useEffect(() => {
    // 当前登录且没有绑定 PID
    if(userStore.user?.id && !userStore.user.pid && invite){
      // 绑定 pid
      bindInvite()
    }

  }, [userStore.user,address]);

  const handlerStakingNumberChange = (e:any) =>{
    if(e.target.value < Number(stakingProduct.price)){
      setStakingNumber(Number(stakingProduct.price))
      return;
    }
    if( BigNumber(balance).div(10 ** 18).isLessThan(e.target.value)){
      setStakingNumber(BigNumber(balance).div(10 ** 18).toNumber())
      return;
    }

    setStakingNumber(Number(e.target.value)||stakingProduct.price)
  }

  const handlerStakingReNumberChange = (e:any) =>{
    if(e.target.value < Number(stakingProduct.price)){
      setStakingNumber(Number(stakingProduct.price))
      return;
    }

    if(Number(e.target.value) > Number(userStore.user?.toUsdtCost)){
      console.log(5555);
      setStakingReNumber(Number(userStore.user?.toUsdtCost)||0)
      return;
    }
    setStakingReNumber(Number(e.target.value))
  }

  const handlerGetBalance = async ()=>{
    const balance = await publicClient?.readContract({
      address: contract.dev.token as `0x${string}`,
      abi: token,
      functionName: 'balanceOf',
      args: [address],
    })
    console.log(balance,'balance');
    setBalance(Number(balance)||0)
    return balance || 0;
  }

  const handlerTyoeBalance = async () =>{
    // eslint-disable-next-line no-unsafe-optional-chaining
    const [balance]:any = await publicClient?.readContract({
      address: contract.dev.manager as `0x${string}`,
      abi: manager,
      functionName: 'getStakingInfo',
      args: [address],
    })
    // console.log(balance,'balance');
    setStakingBalance(Number(balance)||0)
    return balance || 0;
  }

  useEffect(() => {
    handlerGetBalance()
    handlerTyoeBalance()
  }, [isConnected,address,random]);


  useEffect(() => {
    setStakingDisabled(balance<=0 || stakingNumber<=0)
  }, [balance,stakingNumber]);

  useEffect(() => {
    if(!stakingInfo?.pledgegetmoney||stakingInfo?.pledgegetmoney==0){
      setStakingBtnReDisabled(true)
    }
  }, [stakingInfo]);

  const handlerStaking = async ()=>{
    try {
      setStakingDisabled(true)
      // 获取签名
      const message = generateRandomString(32)
      const signed  = await signMessageAsync({message})

      const allowance:any = await publicClient?.readContract({
        address: contract.dev.token as `0x${string}`,
        abi:token,
        functionName: 'allowance',
        args: [address, contract.dev.manager],
      })

      if( BigNumber(allowance).isLessThan(BigNumber(stakingNumber).multipliedBy(10**18))){
        //   授权
        const tx = await writeContractAsync({
          address: contract.dev.token as `0x${string}`,
          abi: token,
          functionName: 'approve',
          args: [contract.dev.manager, BigNumber(stakingNumber).multipliedBy(10**18).toString()],
        })
        console.log(tx);
      }

      const tx = await writeContractAsync({
        address: contract.dev.manager as `0x${string}`,
        abi: manager,
        functionName: 'stake',
        args: [BigNumber(stakingNumber).multipliedBy(10**18).toString()],
      })

      const stakingRes = await publicClient?.waitForTransactionReceipt({hash:tx})
      if(stakingRes?.status==='reverted'){
        Toast('staking.failed');
        return
      }
      await buyProduct({hash:tx,hex:message,signed,amount:stakingNumber.toString(),type:1})
      Toast(intl.formatMessage({id:'staking.success'}))
      setStakingVisable(false)
    }catch (e) {
      console.log(e);
      Toast(intl.formatMessage({id:'staking.failed'}))
    }finally {
      setRandom(Math.random())
      setStakingNumber(0)
      setStakingDisabled(false)
    }

  }

  const handlerReStaking = async ()=>{
    try {
      setStakingDisabled(true)
      // 获取签名
      const message = generateRandomString(32)
      const signed  = await signMessageAsync({message})

      await buyProduct({hash:'',hex:message,signed,amount:stakingNumber.toString(),type:2})
      Toast(intl.formatMessage({id:'staking.success'}))
      setStakingVisable(false)

    }catch (e) {
      console.log(e);
      Toast(intl.formatMessage({id:'staking.failed'}))
    }finally {
      setRandom(Math.random())
      setStakingNumber(0)
      setStakingDisabled(false)
      await fetchUserInfo()
    }

  }



  useEffect(() => {
    const fetchStakingReward = async () =>{
      const res = await getGoodsList()
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setStakingProduct(res.list[0])
    }
    fetchStakingReward()
  }, []);
  const fetchStakingInfo = async ()=>{
    const res = await getStakingInfo()
    setStakingInfo(res)
  }
  useEffect(() => {
    fetchStakingInfo()
  }, []);
  return <>
    <div className="website-container">
      <NavBar />
      <div className="top-banner">
        <img src={websiteBannerUrl} alt="" />
      </div>

      <div className="build-container">
        <div className="common-title">{intl.formatMessage({ id: 'website.build.title' })}</div>
        <div className="video">
          <video autoPlay={true} src="https://www.tyoe.net/videobg.mp4" muted={true}  width={'100%'} playsinline={true} webkit-playsinline x5-playsinline controls={true} height={'auto'}></video>
        </div>
      </div>

      <div className="news-container">
        <div className="title common-title">{intl.formatMessage({ id: 'website.new.title' })}</div>
        <div className="swiper">
          <Swiper autoplay>
            {
              news.map((item, index) => {
                return (
                  <Swiper.Item key={index} style={{ background: item.bg }} className="swiper-item">
                    <div className="img-box">
                      <img src={item.urlimg} width={"100%"} height={"auto"} alt="" />
                      <div className="img-info">
                        <div className="img-info-title">{item.title}</div>
                        <div className="img-info-desc">{item.desc}</div>
                      </div>
                    </div>
                  </Swiper.Item>
                )
              })
            }
          </Swiper>
        </div>
      </div>
      <div className="system-container">
        <div className="common-title">{intl.formatMessage({ id: 'website.system.title' })}</div>
        <div className="system-container-body">
          <div className="item">
            <div className="top">{intl.formatMessage({ id: 'website.system.item1.top' })}</div>
            <div className="desc">{intl.formatMessage({ id: 'website.system.item1.desc' })}</div>
          </div>
          <div className="item">
            <div className="top">{intl.formatMessage({ id: 'website.system.item2.top' })}</div>
            <div className="desc">{intl.formatMessage({ id: 'website.system.item2.desc' })}</div>
          </div>
          <div className="item">
            <div className="top">{intl.formatMessage({ id: 'website.system.item3.top' })}</div>
            <div className="desc">{intl.formatMessage({ id: 'website.system.item3.desc' })}</div>
          </div>
          <div className="item">
            <div className="top">{intl.formatMessage({ id: 'website.system.item4.top' })}</div>
            <div className="desc">{intl.formatMessage({ id: 'website.system.item4.desc' })}</div>
          </div>
        </div>
      </div>

      <div className="h1-title">
        <h1 className="h1">{intl.formatMessage({ id: 'website.title' })}</h1>
        <div className="h1-desc">{intl.formatMessage({ id: 'website.title.desc' })}</div>
      </div>
      <div className="staking-container">
        <div className="title">
          <div className="left">

          </div>
          <div className="right">
            <div className="button" onClick={()=>{setStakingVisable(true)}}>{intl.formatMessage({ id: 'staking.button' })}</div>
            <div className="staking-records" onClick={() => {
              navigator('/staking-records')
            }}>
              <Iconfont icon="icon-jilu"></Iconfont>
              {intl.formatMessage({ id: 'staking.record.title' })}
            </div>
          </div>
        </div>
        <div className="body">
          <div className="form-item">
            <div className="label">
              {intl.formatMessage({ id: 'staking.balance.left' })}
            </div>
            <div className="value">{BigNumber(balance).div(10 ** 18).toFormat()}</div>
          </div>
          <div className="form-item">
            <div className="label">
              {intl.formatMessage({ id: 'staking.balance.tyoe' })}
            </div>
            <div className="value">{BigNumber(stakingBalance).div(10 ** 18).toFormat()}</div>
          </div>

        </div>
        <div className="staking-container-footer">
          <div className="item">
            <div className="top">{intl.formatMessage({ id: 'staking.day.get' })}</div>
            <div className="bottom">{BigNumber(stakingProduct.reward * 100).toFormat()}%</div>
          </div>
          <div className="item">
            <div className="top">{intl.formatMessage({ id: "staking.year.get" })}</div>
            <div className="bottom">{BigNumber(stakingInfo?.pledgegetmoney||0).toFormat()}</div>
          </div>
        </div>
        <div className="staking-container-bottom">
          <div className="item" onClick={()=>setAboutVisable(true)}>{intl.formatMessage({ id: 'staking.footer.item1' })}</div>
          <div className="item" onClick={()=>setAppVisable(true)}>{intl.formatMessage({ id: 'staking.footer.item2' })}</div>
        </div>
      </div>


      <div className="problem-container">
        <div className="common-title">{intl.formatMessage({ id: 'website.problem.title' })}</div>
        <div className="problem-body">
          {
            problems.map(item => {
              return <div className="item" key={item.title}>
                <div className="top">{item.title}</div>
                <div className="desc">{item.desc}</div>
              </div>
            })
          }
        </div>
      </div>

      <div className="get-container">
        <div className="common-title">{intl.formatMessage({ id: 'website.get.main.title' })}</div>
        <div className="get-container-title">
          <div className="top">{intl.formatMessage({ id: 'website.get.title' })}</div>
          <div className="desc">{intl.formatMessage({ id: 'website.get.desc' })}</div>
        </div>
        <div className="get-container-body">
          {
            getEths.map(item => {
              return <div className="item" key={item.title}>
                <div className="top">
                  <img src={item.imgurl} alt="" />
                  <div>{item.title}</div>
                </div>
              </div>
            })
          }

        </div>
      </div>
    </div>
    <Popup className={'about-staking-popup'} visible={aboutVisable} onClose={() => {
      setAboutVisable(false);
    }}>
      <div className="item">
        {intl.formatMessage({id:"staking.footer.item1.item1"})}
      </div>
      <div className="item">
        {intl.formatMessage({id:"staking.footer.item1.item2"})}

      </div>
      <div className="item">
        {intl.formatMessage({id:"staking.footer.item1.item3"})}

      </div>
      <div className="item">
        {intl.formatMessage({id:"staking.footer.item1.item4"})}

      </div>
      <div className="item">
        {intl.formatMessage({id:"staking.footer.item1.item5"})}

      </div>
      <div className="item">
        {intl.formatMessage({id:"staking.footer.item1.item6"})}

      </div>
      <div className="item">
        <div className="top">
          {intl.formatMessage({id:"staking.footer.item1.item7"})}

        </div>
        <div className="bottom">
          <div className="bottom-li">
            {intl.formatMessage({id:"staking.footer.item1.item8"})}

          </div>
          <div className="bottom-li">
            {intl.formatMessage({id:"staking.footer.item1.item9"})}

          </div>
          <div className="bottom-li">
            {intl.formatMessage({id:"staking.footer.item1.item10"})}

          </div>
        </div>
        <div className="footer">
          {intl.formatMessage({id:"staking.footer.item1.item11"})}

        </div>
      </div>
      <div className="item">
        {intl.formatMessage({id:"staking.footer.item1.item12"})}
      </div>
      <div className="item">
        {intl.formatMessage({id:"staking.footer.item1.item13"})}
      </div>
    </Popup>

    <Popup className={'app-staking-popup'} visible={appVisable} onClose={() => {
      setAppVisable(false)}}>
      <div className="item">
        {intl.formatMessage({id:"staking.footer.item2.item1"})}
      </div>
    </Popup>

    <Popup visible={stakingVisable} className={'website-staking-popup'} onClose={() => {
      setStakingVisable(false);
    }}>
      <div className="title">启动验证器</div>
      <div className="tabs">
        <div className={`tab ${tabs==='1'?"active":''}`} onClick={()=>setTabs('1')}>
          质押
        </div>
        <div className={`tab ${tabs==='2'?"active":''}`} onClick={()=>setTabs('2')}>
          复投
        </div>
      </div>
      {
        tabs === '1' ? <div className="tabs-item">
          <div className="form-item">
            <div className="label">
              <div className="left">{intl.formatMessage({ id: 'staking.balance' })}</div>
              <div className="right">{BigNumber(balance).div(10 ** 18).toFormat()}</div>
            </div>
            <div className="input">
              <input type="number" value={stakingNumber} onInput={handlerStakingNumberChange}
                     placeholder={intl.formatMessage({ id: 'staking.balance.placeholder' })} />
              <div className="max" onClick={()=>setStakingNumber(BigNumber(balance).div(10 ** 18).toNumber())}>MAX</div>
            </div>
          </div>

          <div className="info-item">
            <div className="left">TYOE平均收益率</div>
            <div className="right">{BigNumber(stakingProduct.total * 100).toFormat()}%</div>
          </div>
          <div className="form-item">
            <div className="button">
              <button disabled={stakingBtnDisabled}
                      onClick={handlerStaking}>确认启动
              </button>
            </div>
          </div>
        </div> : <div className="tabs-item">
          <div className="form-item active">
            <div className="label">
              <div className="left">{intl.formatMessage({ id: 'staking.back.balance' })}</div>
              <div className="right">{BigNumber(userStore.user?.toUsdtCost||0).toFormat()}</div>
            </div>
            <div className="input">
              <input type="number" value={stakingReNumber} onInput={handlerStakingReNumberChange}
                     placeholder={intl.formatMessage({ id: 'staking.balance.placeholder' })} />
              <div className="max" onClick={() => setStakingReNumber(BigNumber(userStore.user?.toUsdtCost||0).toNumber())}>MAX
              </div>
            </div>
          </div>
          <div className="info-item">
            <div className="left">TYOE平均收益率</div>
            <div className="right">{BigNumber(stakingProduct.total * 100).toFormat()}%</div>
          </div>
          <div className="form-item">
            <div className="button">
              <button disabled={stakingBtnDisabled}
                      onClick={handlerReStaking}>确认复投
              </button>
            </div>
          </div>
        </div>
      }


    </Popup>

  </>
}

export default Website;