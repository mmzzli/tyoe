import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import './home.scss';
import { ActionSheet, Popup, Swiper, Toast } from 'react-vant';
import { useIntl } from 'react-intl';
import bannerUrl from '@/assets/images/banner.png';
import banner01Url from '@/assets/images/banner01.jpg';
import banner02Url from '@/assets/images/banner02.jpg';
import banner03Url from '@/assets/images/banner03.jpg';
import banner04Url from '@/assets/images/banner04.jpg';
import banner05Url from '@/assets/images/banner05.jpg';
import Iconfont from '@/component/Iconfont.tsx';
import WhitePhaseItem, { PhaseItemProps } from '@/component/PhaseItem.tsx';
import { useAccount, usePublicClient, useSignMessage, useSwitchChain, useWalletClient, useWriteContract } from 'wagmi';
import { contract } from '@/wagmi.ts';
import { manager, nft, token } from '@/abi/tyoe.ts';
import useUserStore from '@/store/user.ts';
import { TOKEN } from '@/utils/const.ts';
import { getLoginOrRegister, getUserInfo, setInviteLink } from '@/service/user.ts';
import { copyText, formatAddress, generateRandomString, getContractErrorInfo } from '@/utils/common.ts';
import { useLocation } from 'react-router-dom';
import { getWhitelistRecords, WhiteListItem, whitelistPhaseList, whitelistSubmit } from '@/service/home.ts';
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import NavBar from '@/component/NavBar.tsx';
import { mainnet } from 'viem/chains';

const banner = [
  { urlimg: bannerUrl },
  { urlimg: banner01Url },
  { urlimg: banner02Url },
  { urlimg: banner03Url },
  { urlimg: banner04Url },
  { urlimg: banner05Url },
];


const Home: React.FC = () => {
  const intl = useIntl();
  const timerRef = useRef<NodeJS.Timeout>();
  const userStore = useUserStore();
  const [claimed, setClaimed] = useState(false);
  const publicClient = usePublicClient();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { switchChainAsync } = useSwitchChain();
  const { data: walletClient } = useWalletClient();
  const { address, isConnected, isConnecting, isReconnecting, chainId } = useAccount();
  const [, setVisible] = useState(false);
  const { signMessageAsync } = useSignMessage();

  const [invite] = useState(searchParams.get('invite') || '');
  const [whitelistRecords, setWhitelistRecords] = useState<WhiteListItem[]>([]);
  const [whiteList, setWhiteList] = useState<PhaseItemProps[]>([]);
  const [phases, setPhases] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);

  const [subscribeDisabled, setSubscribeDisabled] = useState(false);
  const [getDisabled, setGetDisabled] = useState(false);

  const [aboutVisable, setAboutVisable] = useState<boolean>(false)
  const [appVisable, setAppVisable] = useState<boolean>(false)

  const [clamVisable,setClamVisable] = useState(false);
  const [cliamNumber,setCliamNumber] = useState<number|''>('');
  const [leftClimed,setLeftClimed] = useState(0);
  useEffect(() => {
    const fetchRelease = async () => {
      const res = await publicClient?.readContract({
        address: contract.dev.manager as `0x${string}`,
        abi: manager,
        functionName: 'releaseEnabled',
      });
      setGetDisabled(!res);
    };
    fetchRelease();
  }, []);


  const [nfts, setNFTs] = useState<{ balance: number, balanceNo: number[], show: boolean }>({
    balance: 0,
    balanceNo: [],
    show: false,
  });


  document.title = intl.formatMessage({ id: 'app.name' });

  // 绑定上级
  const bindInvite = async () => {
    // if (!invite.trim()) {
    //   Toast(intl.formatMessage({ id: 'bind.invite.placeholder' }));
    //   return;
    // }
    try {
      // 发起请求
      await setInviteLink(invite||'1');
      setVisible(false);
      try {
        const res = await getUserInfo();
        userStore.setUser(res);
      } catch {
        localStorage.removeItem(TOKEN);
      }
    } catch (e: any) {
      Toast(e);
    }
  };


  const login = async () => {
    const message = generateRandomString(32);
    const data = await signMessageAsync({ message });
    try {
      const res: any = await getLoginOrRegister({ account: address!, hex: message, signed: data });
      localStorage.setItem(TOKEN, res);
      await fetchUserInfo();
    } catch (e: any) {
      localStorage.removeItem(TOKEN);
      userStore.setUser(null);
      setVisible(false);
      Toast(e);
    }
  };

  const clearUser = () => {
    console.log(88888888);
    localStorage.removeItem(TOKEN);
    userStore.setUser(null);
    setVisible(false);
  };

  const fetchUserInfo = async () => {
    try {
      const res = await getUserInfo();
      userStore.setUser(res);
      if (res?.account?.toLowerCase() !== address?.toLowerCase()) {
        clearUser();
        login();
      }
    } catch {
      clearUser();
    }
  };

  useEffect(() => {
    if (isConnecting || isReconnecting) {
      return;
    }
    if (!isConnected || !address) {
      console.log(9999999, '=======');
      clearUser();
      return;
    }
    if (isConnected && address) {
      if (localStorage.getItem(TOKEN)) {
        fetchUserInfo();
      } else {
        login();
      }
    }
  }, [isConnected, address, isConnecting, isReconnecting]);


  useEffect(() => {
    // 当前登录且没有绑定 PID
    if (userStore.user?.id && !userStore.user.pid) {
      // 绑定 pid
      bindInvite();
    }

  }, [userStore.user, address]);

  const featchWhitelist = async () => {
    const res = await getWhitelistRecords({ page: 1, limit: 10 });
    setWhitelistRecords(res.list);
  };

  // 获取认购白名单倒计时
  const fetchWhitelistPhases = async () => {
    const res = await whitelistPhaseList()
    setPhases(res);
  };
  useEffect(() => {
    timerRef.current = setInterval(() => {
      featchWhitelist();
    }, 2000);
    fetchWhitelistPhases();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = undefined;
      }
    };
  }, []);


  useEffect(() => {
    const chainSet = async () => {
      try {
        await switchChainAsync({ chainId: mainnet.id });

      } catch {
        if (walletClient) {
          await walletClient.addChain({ chain: mainnet });
        }
      }
    };
    if (isConnected && chainId !== mainnet.id) {
      chainSet();
    }

  }, [isConnected, chainId]);

  useEffect(() => {
    const fetchPhaseIdInfo = async () => {
      const res = phases.map(async (item) => {
        // eslint-disable-next-line no-unsafe-optional-chaining
        const [usdtPrice, maxSlots, currentSlots, active]: any = await publicClient?.readContract({
          address: contract.dev.manager as `0x${string}`,
          abi: manager,
          functionName: 'getSubscriptionRoundInfo',
          args: [item.id],
        });
        console.log(item, '-----nowTime');
        return {
          usdtPrice: BigNumber(usdtPrice).dividedBy(10 ** 6).toFixed(0),
          maxSlots: BigNumber(maxSlots).toNumber(),
          currentSlots: BigNumber(currentSlots).toNumber(),
          active,
          phase: item.id,
          nowTime: item.nowtime,
          lastTime: item.lasttime,
        } as any;
      });
      const data = await Promise.all(res);
      setWhiteList(data);
    };

    if (phases.length && activeId) {
      // 合约获取相关的详情
      // 例如继续读取该轮信息
      fetchPhaseIdInfo();

    }
  }, [phases, activeId,clamVisable]);


  const curWhitelistItem = useMemo(() => {
    if (whiteList.length && activeId) {
      const cur = whiteList.find(item => item.phase === activeId);
      if (cur) {
        setSubscribeDisabled(!cur.active);
      }
      return cur;
    }
    return null;
  }, [whiteList, activeId]);


  //  是否领取过空投
  const fetchClaimed = async () => {
    // 是否领取过
    const claimed = await publicClient?.readContract({
      address: contract.dev.manager as `0x${string}`,
      abi: manager,
      functionName: 'addressClaimed',
      args: [address],
    });
    console.log(claimed);
    setClaimed(Boolean(claimed));
  };
  useEffect(() => {
    if(address){
      fetchClaimed();
    }
  }, [address, nfts]);


  useEffect(() => {
    const featch = async () => {
      const roundId = await publicClient?.readContract({
        address: contract.dev.manager as `0x${string}`,
        abi: manager,
        functionName: 'getCurrentActiveRound',
      }) as bigint;
      setActiveId(Number(roundId));
    };
    featch();
  }, []);


  // 是否为白名单用户
  const [isWhiteListUser, setIsWhiteListUser] = useState(false);
  useEffect(() => {
      const fetch = async () => {
        // 是否为白名单用户
        const isWhiteListUser = await publicClient?.readContract({
          address: contract.dev.manager as `0x${string}`,
          abi: manager,
          functionName: 'userTotalSubscriptions',
          args: [address],
        });
        console.log(isWhiteListUser);
        setIsWhiteListUser(Boolean(isWhiteListUser));
      };
      if(address){
        fetch();
      }
    }, [address],
  );


  const { writeContractAsync } = useWriteContract();

  const handlerCheckNft = async () => {
    try {
      setNFTs({
        balance: 0,
        balanceNo: [],
        show: false,
      });
      if (!address) {
        Toast(intl.formatMessage({ id: 'toast.connect.wallet' }));
        return;
      }
      if (!publicClient) {
        Toast(intl.formatMessage({ id: 'toast.connect.net.error' }));
        return;
      }
      // 1. 获取 NFT 合约地址
      const nftAddress = await publicClient.readContract({
        address: contract.dev.manager as `0x${string}`,
        abi: manager,
        functionName: 'nftContract',
      }) as `0x${string}`;

      console.log(nftAddress);
      // 2. 检测是否有 nft
      const nftBalance = await publicClient.readContract({
        address: nftAddress,
        abi: nft,
        functionName: 'balanceOf',
        args: [address],
      }) as bigint;
      console.log(nftBalance,'nftBalance');
      if(Number(nftBalance)<1){
          Toast(intl.formatMessage({ id: 'toast.no.nft' }));
          return
      }
      setNFTs({
        balance: Number(nftBalance),
        balanceNo: [0],
        show: true,
      });
      // 3. 开始空投
      const res = await writeContractAsync({
        address: contract.dev.manager as `0x${string}`,
        abi: manager,
        functionName: 'claimAirdrop',
        args: [],
      });
      const txState = await publicClient.waitForTransactionReceipt({ hash: res });
      console.log(txState);
      if (txState.status === 'reverted') {
        Toast(intl.formatMessage({ id: 'toast.airdrop.failed' }));
        return;
      }
      Toast(intl.formatMessage({ id: 'toast.staking.success' }));
    } catch (e:any) {
      Toast(e.shortMessage || e.message)
    } finally {
      await fetchClaimed();
    }
  };

  const handlerClamShow = async () =>{
    setClamVisable(true)
  }

  useEffect(() => {
    const fetch = async () => {
      const res = await publicClient?.readContract({
        address: contract.dev.manager as `0x${string}`,
        abi: manager,
        functionName: 'getUserTotalShares',
        args: [address],
      });
      setLeftClimed(Number(res) as number)
    };
    if(address){
      fetch();
    }
  }, [clamVisable,address]);


  const leftSubNum = useMemo(() => {
    if(curWhitelistItem){
      return Math.min(50-leftClimed,curWhitelistItem?.maxSlots-curWhitelistItem?.currentSlots)
    }
    return 0
  }, [leftClimed,curWhitelistItem]);

  const handlerInputClaim  =async (e:any) =>{
    if(Number(e.target.value)<1){
      setCliamNumber(1)
    }
    if(Number(e.target.value)>leftSubNum){
      setCliamNumber(leftSubNum)
      return
    }
    setCliamNumber(parseInt(e.target.value)||1)
  }

  const handlerClam = async () => {
    try {
      console.log(444);
      setSubscribeDisabled(true);
      // 获取签名
      const message = generateRandomString(32);
      const signed = await signMessageAsync({ message });
      console.log(signed);


      //  查询当前活跃期数
      const roundId = await publicClient?.readContract({
        address: contract.dev.manager as `0x${string}`,
        abi: manager,
        functionName: 'getCurrentActiveRound',
      }) as bigint;


      // 例如继续读取该轮信息
      // eslint-disable-next-line no-unsafe-optional-chaining
      const [usdtPrice]: any = await publicClient?.readContract({
        address: contract.dev.manager as `0x${string}`,
        abi: manager,
        functionName: 'getSubscriptionRoundInfo',
        args: [roundId],
      });

      console.log(Number(usdtPrice));

      const price = BigNumber(usdtPrice).dividedBy(10 ** 6).toFixed(0);
      console.log(price);

      const allowance = await publicClient?.readContract({
        address: contract.dev.usdt as `0x${string}`,
        abi: token,
        functionName: 'allowance',
        args: [address, contract.dev.manager],
      });


      console.log(allowance,'allowance');
      const needUsdt = BigNumber(usdtPrice).multipliedBy(cliamNumber)
      console.log(needUsdt,'999999');
      if(!Number(allowance)){
        console.log(3333);
        const balance:any = await publicClient?.readContract({
          address: contract.dev.usdt as `0x${string}`,
          abi: token,
          functionName: 'balanceOf',
          args: [address],
        });
        console.log(balance);
        if (BigNumber(balance).isLessThan(needUsdt)) {
          Toast(intl.formatMessage({ id: 'toast.usdt.insufficient' }));
          return;
        }
        //   授权
        const tx = await writeContractAsync({
          address: contract.dev.usdt as `0x${string}`,
          abi: token,
          functionName: 'approve',
          args: [contract.dev.manager, needUsdt.toFixed(0)],
        });
        console.log(tx);
      }else{
        console.log(4444);
        if(BigNumber(Number(allowance)||0).isLessThan(needUsdt)) {
          //   查询自己有多少 usdt
          const balance:any = await publicClient?.readContract({
            address: contract.dev.usdt as `0x${string}`,
            abi: token,
            functionName: 'balanceOf',
            args: [address],
          });
          console.log(balance);
          if (BigNumber(balance).isLessThan(needUsdt)) {
            Toast(intl.formatMessage({ id: 'toast.usdt.insufficient' }));
            return;
          }
          // 首先撤销授权
          await writeContractAsync({
            address: contract.dev.usdt as `0x${string}`,
            abi: token,
            functionName: 'approve',
            args: [contract.dev.manager, 0],
          });
          //   授权额度
          await writeContractAsync({
            address: contract.dev.usdt as `0x${string}`,
            abi: token,
            functionName: 'approve',
            args: [contract.dev.manager, needUsdt.toFixed(0)],
          });
        }
      }

      //  查询 当前活跃基数的详情
      // 查询 是否已经授权过，且额度是否正确
      const tx = await writeContractAsync({
        address: contract.dev.manager as `0x${string}`,
        abi: manager,
        functionName: 'subscribe',
        args: [cliamNumber],
      });
      // 发送给后端
      await publicClient?.waitForTransactionReceipt({ hash: tx });
      await whitelistSubmit({ hex: message, signed, hash: tx });
      await featchWhitelist();

      Toast(intl.formatMessage({ id: 'toast.buy.success' }));

      setClamVisable(false)

    } catch (e: any) {
      Toast(`${intl.formatMessage({ id: 'toast.buy.failed' })}${e.shortMessage || e.message}`);
      console.log(e);
    } finally {
      setSubscribeDisabled(false);
    }


  };
  const handlerGet = async () => {
    try {
      setGetDisabled(true);
      const tx = await writeContractAsync({
        address: contract.dev.manager as `0x${string}`,
        abi: manager,
        functionName: 'claimSubscriptionTokens',
        args: [],
      });
      const clamRes = await publicClient?.waitForTransactionReceipt({ hash: tx });
      console.log(clamRes, 'clamRes');
      if (clamRes?.status === 'reverted') {
        const res: any = await getContractErrorInfo(publicClient, clamRes);
        console.log(res);
        return Toast(res);
      }
      Toast(intl.formatMessage({ id: 'toast.get.success' }));
    } catch (e: any) {
      console.log(e);
      console.log(e.shortMessage || e.message);
      Toast(e.shortMessage || e.message);
    } finally {
      setGetDisabled(false);
    }
  };



  return (
    <>
      <div className="container">
        <NavBar showMenu={false} />
        <div className="swiper">
          <Swiper autoplay>
            {
              banner.map((item, index) => {
                return (
                  <Swiper.Item key={index}>
                    <div className="img-box">
                      <img src={item.urlimg} width={'100%'} height={'auto'} alt="" />
                      <div className="img-info">
                        <div className="title">Participate in Ethereum 10th Anniversary</div>
                        <div className="desc">Get Free TYOE Airdrop</div>
                      </div>
                    </div>
                  </Swiper.Item>
                );
              })
            }

          </Swiper>
        </div>

        <div className="welcome-box">
          <div className="title">
            {intl.formatMessage({ id: 'welcome.title' })}
          </div>
          <div className="body">
            {intl.formatMessage({ id: 'welcome.body' })}
          </div>
        </div>

        <div className="airdop-box">
          <div className="title">
            <div className="left">
              {intl.formatMessage({ id: 'airdop.title' })}
            </div>
            <div className="right" style={{ opacity: claimed ? '1' : '0.7' }}>
              <Iconfont icon={'icon-lipin'}></Iconfont>
              {
                claimed ? (
                  <div>{intl.formatMessage({ id: 'airdop.clamied' })}</div>
                ) : (
                  <div>{intl.formatMessage({ id: 'airdop.unclamied' })}</div>
                )
              }
            </div>
          </div>
          <p className="desc">
            {intl.formatMessage({ id: 'airdop.check.desc' })}
          </p>
          <div className="check-nft-button ">
            <button onClick={handlerCheckNft} disabled={claimed}>
              <Iconfont icon={'icon-sousuo'}></Iconfont>
              {intl.formatMessage({ id: 'airdop.check.nft' })}</button>
          </div>



          {
            nfts.show && !claimed && (
              <div className="check-nft-result">
                <div className="check-nft-result-title">{intl.formatMessage({ id: 'airdop.check.nft.result' })}</div>
                <div className="check-nft-result-item">
                  <Iconfont icon={'icon-a-circle-check1'}></Iconfont>
                  <div className="middle">
                    {/*<div className="top">*/}
                    {/*  {nfts.balanceNo[0]}*/}
                    {/*</div>*/}
                    <div className="bottom">
                      {intl.formatMessage({ id: 'airdop.check.nft.result.reward' })}:100 TYOE
                    </div>
                  </div>
                  <div className="right">
                    {intl.formatMessage({ id: 'airdop.check.nft.result.success' })}
                  </div>
                </div>
              </div>
            )
          }


          {/*<div className="card-box">*/}
          {/*	<div className="card-box-item">*/}
          {/*		<div className="card-box-item-title">{intl.formatMessage({ id: 'token.loop.title' })}</div>*/}
          {/*		<div className="card-box-item-middle">5000 {intl.formatMessage({ id: "common.wan" })} TYOE</div>*/}
          {/*		<div className="card-box-item-percent">{intl.formatMessage({ id: 'token.loop.supply.percent' })} 5%</div>*/}
          {/*	</div>*/}

          {/*	<div className="card-box-item">*/}
          {/*		<div className="card-box-item-title">{intl.formatMessage({ id: 'token.send.title' })}</div>*/}
          {/*		<div className="card-box-item-middle">5000 {intl.formatMessage({ id: "common.wan" })} TYOE</div>*/}
          {/*		<div className="card-box-item-percent">{intl.formatMessage({ id: 'token.left.percent' })} 75%</div>*/}
          {/*	</div>*/}
          {/*</div>*/}

          <div className="airdop-rule">
            <div className="airdop-rule-title">{intl.formatMessage({ id: 'airdop.rule.title' })}</div>
            <div className="airdop-rule-item" data-num={1}>
              {intl.formatMessage({ id: 'airdop.rule.1' })}
            </div>
            <div className="airdop-rule-item" data-num={2}>
              {intl.formatMessage({ id: 'airdop.rule.2' })}
            </div>
            <div className="airdop-rule-item" data-num={3}>
              {intl.formatMessage({ id: 'airdop.rule.3' })}
            </div>
            {/*<div className="airdop-rule-item" data-num={4}>*/}
            {/*	{intl.formatMessage({ id: 'airdop.rule.4' })}*/}
            {/*</div>*/}
          </div>

        </div>

        <div className="whitelist-container">
          <div className="title">
            <div className="left">
              {intl.formatMessage({ id: 'whitelist.title' })}
            </div>
            <div className="right">
              {isWhiteListUser ? <Iconfont icon={'icon-star'} /> : <Iconfont icon={'icon-start-outline'} />}
              {intl.formatMessage({ id: 'whitelist.title.not.user' })}
            </div>
          </div>

          <div className="whitelist-tabs">
            <div className="whitelist-show-container">
              <div className="tabs">
                {
                  curWhitelistItem ?
                    whiteList.map(item => {
                      return <div
                        className={['tab-label', curWhitelistItem.phase === item.phase ? 'active' : ''].join(' ')}
                         key={`${item.phase}-label`}>
                        {intl.formatMessage({ id: 'whitelist.tab.phase' }, { num: item.phase })}
                      </div>;
                    })
                    : ''
                }
              </div>
              <div className="tabs-container">
                {
                  curWhitelistItem ?
                    <WhitePhaseItem {...curWhitelistItem} ></WhitePhaseItem>
                    : ''
                }
              </div>
            </div>
            <div className="tabs-container">
              <div className="controls">
                <button disabled={subscribeDisabled}
                        onClick={handlerClamShow}>{intl.formatMessage({ id: 'whitelist.subscribe' })}</button>
                <button disabled={getDisabled}
                        onClick={handlerGet}>{intl.formatMessage({ id: 'whitelist.claim' })}</button>
              </div>

              <div className="staking-container-bottom">
                <div className="item"
                     onClick={() => setAboutVisable(true)}>{intl.formatMessage({ id: 'staking.footer.item1' })}</div>
                <div className="item"
                     onClick={() => setAppVisable(true)}>{intl.formatMessage({ id: 'staking.footer.item2' })}</div>
              </div>
              <div className="phase-records">
                <div
                  className="phase-records-title">{intl.formatMessage({ id: 'whitelist.participation.records' })}</div>
                <div className="lists">
                  {
                    whitelistRecords.map(item => {
                      return <div className="list-item" key={item.id}>
                        <div className="address">
                          {formatAddress(item.account)}
                        </div>
                        <div className="time">
                          {dayjs(item.create_time).format('YYYY-MM-DD HH:mm:ss')}
                        </div>
                      </div>;
                    })
                  }
                </div>
              </div>

            </div>
          </div>
        </div>


        <div className="footer">
          <div className="media">
            {intl.formatMessage({ id: 'footer.social.media' })}
          </div>
          <div className="media-list">
            <a href="https://x.com/dggg32176891?s=21" target="_blank"><Iconfont icon={'icon-tuite1'}></Iconfont></a>
            <a href="https://t.me/+cl-P63xZHOowNTY8" target="_blank"><Iconfont icon={'icon-telegram'}></Iconfont></a>
            <a href="https://ethereum.org/" target="_blank"><Iconfont icon={'icon-ethereum'}></Iconfont></a>
          </div>
          {userStore.user?.invit && (
            <div className="link">
              <div className="invite">
                {intl.formatMessage({ id: 'footer.invite.link' })}
              </div>
              <div className="link-text">
                {`${window.location.origin}?invite=${userStore.user?.invit}`}
              </div>

              <div className="link-button">
                <button>
                  <Iconfont icon={'icon-share'}></Iconfont>
                  {intl.formatMessage({ id: 'footer.copy.link' })}
                  <Iconfont icon={'icon-fuzhi'} onClick={() => {
                    copyText(`${window.location.origin}?invite=${userStore.user?.invit}`);
                  }}></Iconfont></button>
              </div>
            </div>
          )}


          <ul className="other-link">
            <li>
              <a href="https://ethereum.org/zh/about/" target="_blank">{intl.formatMessage({id:'home.footer.about'})}</a>
            </li>
            <li>
              <a href="https://ethereum.org/zh/assets/" target="_blank">{intl.formatMessage({id:'home.footer.asset'})}</a>


            </li>
            <li>
              <a href="https://ethereum.org/zh/community/code-of-conduct/" target="_blank">{intl.formatMessage({id:'home.footer.role'})}</a>


            </li>
            <li>
              <a href="https://ethereum.org/zh/about/#open-jobs" target="_blank">{intl.formatMessage({id:'home.footer.job'})}</a>


            </li>
            <li>
              <a href="https://ethereum.org/zh/privacy-policy/" target="_blank">{intl.formatMessage({id:'home.footer.privacy'})}</a>


            </li>
            <li>
              <a href="https://ethereum.org/zh/terms-of-use/" target="_blank">{intl.formatMessage({id:'home.footer.terms'})}</a>


            </li>
            <li>
              <a href="https://ethereum.org/zh/cookie-policy/" target="_blank">{intl.formatMessage({id:'home.footer.cookie'})}</a>


            </li>
            <li>
              <a href="mailto:press@ethereum.org" target="_blank">{intl.formatMessage({id:'home.footer.media'})}</a>
            </li>
          </ul>
        </div>
      </div>
      <ActionSheet visible={clamVisable} className={'cliam-popup'} onCancel={() => {
        setClamVisable(false)
      }}>
        <div className={"title"}>
          <div className="left">{intl.formatMessage({id:'home.rengou.fene'})}</div>
          <div className="right">{intl.formatMessage({id:'home.rengou.left'})}：{leftSubNum}</div>
        </div>
        <div className="form-item">
          <div className="input">
            <input value={cliamNumber} min={1} max={50} type="number" onInput={handlerInputClaim} />
          </div>
          <div className="max" onClick={() => setCliamNumber(leftSubNum)}>MAX</div>
        </div>
        <div className={"min-tip"}>
          {intl.formatMessage({id:'home.rengou.info'})}
        </div>
        <div className={'button'} onClick={handlerClam}>{intl.formatMessage({id:'home.rengou.confirm'})}</div>
      </ActionSheet>
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
          <div className="staking-footer">
            {intl.formatMessage({id:"staking.footer.item1.item11"})}

          </div>
        </div>
        <div className="item">
          {intl.formatMessage({id:"staking.footer.item1.item13"})}
        </div>
      </Popup>

      <Popup className={'app-staking-popup'} visible={appVisable} onClose={() => {
        setAppVisable(false)
      }}>
        <div className="item">{intl.formatMessage({ id: "staking.footer.item2.item1" })}</div>
        <div className="item">{intl.formatMessage({ id: "staking.footer.item2.item2" })}</div>
        <div className="item">{intl.formatMessage({ id: "staking.footer.item2.item3" })}</div>
        <div className="item">{intl.formatMessage({ id: "staking.footer.item2.item4" })}</div>
      </Popup>
    </>
  );
};


export default Home;