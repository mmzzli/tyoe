import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import './home.scss';
import { Swiper, Toast } from 'react-vant';
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
import { bscTestnet } from '@/config/bscTestNet.ts';
import NavBar from '@/component/NavBar.tsx';

const banner = [
	{ urlimg: bannerUrl },
	{ urlimg: banner01Url },
	{ urlimg: banner02Url },
	{ urlimg: banner03Url },
	{ urlimg: banner04Url },
	{ urlimg: banner05Url },
]


const Home:React.FC = () =>{
	const intl = useIntl()
	const timerRef = useRef<NodeJS.Timeout>();
	const userStore = useUserStore()
	const [claimed,setClaimed] = useState(false)
	const publicClient = usePublicClient()
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const { switchChainAsync } = useSwitchChain()
	const { data: walletClient } = useWalletClient()
	const { address, isConnected,isConnecting, isReconnecting,chainId } = useAccount()
	const [, setVisible] = useState(false)
	const {signMessageAsync} = useSignMessage()

	const [invite,]  = useState(searchParams.get('invite')||'')
	const [whitelistRecords,setWhitelistRecords] = useState<WhiteListItem[]>([])
	const [whiteList,setWhiteList] = useState<PhaseItemProps[]>([])
	const [phases,setPhases] = useState<any[]>([])
	const [activeId,setActiveId] = useState<number|null>(null)

	const [subscribeDisabled,setSubscribeDisabled] = useState(false)
	const [getDisabled,setGetDisabled] = useState(false)
	useEffect(()=>{
		const fetchRelease  = async () =>{
			const res = await publicClient?.readContract({
				address: contract.dev.manager as `0x${string}`,
				abi: manager,
				functionName: 'releaseEnabled',
			})
			setGetDisabled(!res)
		}
		fetchRelease()
	},[])


	const [nfts,setNFTs] = useState<{balance:number,balanceNo:number[],show:boolean}>({
		balance:0,
		balanceNo:[],
		show: false
	})


	document.title = intl.formatMessage({id:'app.name'})

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

	const featchWhitelist  = async () =>{
		const res = await getWhitelistRecords({page:1,limit:10})
		setWhitelistRecords(res.list)
	}

	// 获取认购白名单倒计时
	const fetchWhitelistPhases = async () =>{
		const res = await whitelistPhaseList()
		setPhases(res)
	}
	useEffect(() => {
		timerRef.current = setInterval(() => {
			featchWhitelist()
		}, 2000);
		fetchWhitelistPhases()
		return () => {
			if(timerRef.current){
				clearInterval(timerRef.current);
				timerRef.current = undefined
			}
		};
	}, []);


	useEffect(() => {
		const chainSet  = async () =>{
				try{
					await switchChainAsync({ chainId: bscTestnet.id })

				}catch {
					if(walletClient){
						await walletClient.addChain({chain: bscTestnet})
					}
				}
		}
		if(isConnected && chainId !== bscTestnet.id){
			chainSet()
		}

	}, [isConnected,chainId]);

	useEffect(() => {
		const fetchPhaseIdInfo = async () =>{
			const res =  phases.map(async (item) => {
				// eslint-disable-next-line no-unsafe-optional-chaining
				const [usdtPrice, maxSlots, currentSlots, active]: any = await publicClient?.readContract({
					address: contract.dev.manager as `0x${string}`,
					abi: manager,
					functionName: 'getSubscriptionRoundInfo',
					args: [item.id],
				});
				console.log(item, '-----nowTime')
				return {
					usdtPrice: BigNumber(usdtPrice).dividedBy(10 ** 18).toString(),
					maxSlots: BigNumber(maxSlots).toNumber(),
					currentSlots: BigNumber(currentSlots).toNumber(),
					active,
					phase: item.id,
					nowTime: item.nowtime,
					lastTime: item.lasttime
				} as any
			})
			const data = await Promise.all(res)
			setWhiteList(data)

		}

		if(phases.length && activeId){
			// 合约获取相关的详情
			// 例如继续读取该轮信息
			fetchPhaseIdInfo()

		}
	}, [phases,activeId]);


	const curWhitelistItem  = useMemo(() => {
		if(whiteList.length && activeId){
			const cur =whiteList.find(item => item.phase === activeId)
			if(cur){
				setSubscribeDisabled(!cur.active)
			}
			return cur
		}
		return null
	}, [whiteList,activeId]);



	//  是否领取过空投
	const fetchClaimed = async ()=>{
		// 是否领取过
		const claimed = await publicClient?.readContract({
			address: contract.dev.manager as `0x${string}`,
			abi: manager,
			functionName: 'addressClaimed',
			args:[address],
		})
		console.log(claimed);
		setClaimed(Boolean(claimed))
	}
	useEffect(() => {
		fetchClaimed()
	}, [address,nfts]);


	useEffect(() => {
		const featch = async ()=>{
			const roundId = await publicClient?.readContract({
				address: contract.dev.manager as `0x${string}`,
				abi: manager,
				functionName: 'getCurrentActiveRound',
			}) as bigint;
			setActiveId(Number(roundId))
		}
		featch()
	}, []);


	// 是否为白名单用户
	const [isWhiteListUser,setIsWhiteListUser] = useState(false)
	useEffect(() => {
			const fetch = async ()=>{
				// 是否为白名单用户
				const isWhiteListUser = await publicClient?.readContract({
					address: contract.dev.manager as `0x${string}`,
					abi: manager,
					functionName: 'userTotalSubscriptions',
					args:[address],
				})
				console.log(isWhiteListUser);
				setIsWhiteListUser(Boolean(isWhiteListUser))
			}
			fetch()
		}, [address]
	)




	const {writeContractAsync} = useWriteContract()

	const handlerCheckNft =async () =>{
		try{
			setNFTs({
				balance:0,
				balanceNo:[],
				show: false
			})
			if(!address){
				Toast(intl.formatMessage({id:'toast.connect.wallet'}));
				return;
			}
			if(!publicClient){
				Toast(intl.formatMessage({id:'toast.connect.net.error'}));
				return;
			}
			// 1. 获取 NFT 合约地址
			const nftAddress = await publicClient.readContract({
				address: contract.dev.manager as `0x${string}`,
				abi: manager,
				functionName: 'nftContract',
			}) as `0x${string}`
			// 2. 检测是否有 nft
			const nftBalance = await publicClient.readContract({
				address: nftAddress,
				abi: nft,
				functionName: 'balanceOf',
				args:[address],
			}) as bigint

			const requestNFTids = []
			for (let i = 0; i< Number(nftBalance); i++) {
				requestNFTids.push(publicClient.readContract({
					address: nftAddress,
					abi: nft,
					functionName: 'tokenOfOwnerByIndex',
					args:[address,i],
				}))
			}
			const ids:any = await Promise.all(requestNFTids) || []
			console.log(ids);
			if(!ids.length){
				Toast(intl.formatMessage({id:"toast.no.nft"}));
				return;
			}
			setNFTs({
				balance: Number(nftBalance),
				balanceNo: ids.map((item:any)=>Number(item)),
				show: true
			})
			// 3. 开始空投
			const res = await writeContractAsync({
				address: contract.dev.manager as `0x${string}`,
				abi: manager,
				functionName: 'claimAirdrop',
				args: [],
			})
			const txState = await publicClient.waitForTransactionReceipt({hash:res})
			console.log(txState);
			if(txState.status==='reverted'){
				Toast(intl.formatMessage({id:'toast.airdrop.failed'}));
				return
			}
			Toast(intl.formatMessage({id:'toast.staking.success'}))
		}catch (e) {
			console.log(e);
		} finally {
			await fetchClaimed()
		}

	}

	const handlerClam = async () =>{
		try{
			setSubscribeDisabled(true)
			// 获取签名
			const message = generateRandomString(32)
			const signed  = await signMessageAsync({message})


			//  查询当前活跃期数
			const roundId = await publicClient?.readContract({
				address: contract.dev.manager as `0x${string}`,
				abi: manager,
				functionName: 'getCurrentActiveRound',
			}) as bigint;


			// 例如继续读取该轮信息
			// eslint-disable-next-line no-unsafe-optional-chaining
			const [usdtPrice]:any = await publicClient?.readContract({
				address: contract.dev.manager as `0x${string}`,
				abi: manager,
				functionName: 'getSubscriptionRoundInfo',
				args: [roundId],
			});

			console.log(Number(usdtPrice));

			const price = BigNumber(usdtPrice).dividedBy(10 ** 18).toString()
			console.log(price);

			const allowance = await publicClient?.readContract({
				address: contract.dev.usdt as `0x${string}`,
				abi:token,
				functionName: 'allowance',
				args: [address, contract.dev.manager],
			})


			console.log(allowance);

			if((allowance||0) <usdtPrice){
				//   查询自己有多少 usdt
				const balance = await publicClient?.readContract({
					address: contract.dev.usdt as `0x${string}`,
					abi: token,
					functionName: 'balanceOf',
					args: [address],
				})
				console.log(balance);
				//   授权
				const tx = await writeContractAsync({
					address: contract.dev.usdt as `0x${string}`,
					abi: token,
					functionName: 'approve',
					args: [contract.dev.manager, balance],
				})
				console.log(tx);
			}

			//  查询 当前活跃基数的详情
			// 查询 是否已经授权过，且额度是否正确
			const tx = await writeContractAsync({
				address: contract.dev.manager as `0x${string}`,
				abi: manager,
				functionName: 'subscribe',
				args: [],
			})
			// 发送给后端
			await publicClient?.waitForTransactionReceipt({hash:tx})
			await whitelistSubmit({hex:message,signed,hash:tx})
			await featchWhitelist()

			Toast(intl.formatMessage({id:'toast.buy.success'}))

		}catch (e:any) {
			Toast(`${intl.formatMessage({id:'toast.buy.failed'})}${e.shortMessage || e.message}`)
			console.log(e);
		}finally {
			setSubscribeDisabled(false)
		}


	}
	const handlerGet = async ()=>{
		try{
			setGetDisabled(true)
			const tx = await writeContractAsync({
				address: contract.dev.manager as `0x${string}`,
				abi: manager,
				functionName: 'claimSubscriptionTokens',
				args: [],
			})
			const clamRes = await publicClient?.waitForTransactionReceipt({hash:tx})
			console.log(clamRes,'clamRes');
			if(clamRes?.status === "reverted"){
				const res:any = await getContractErrorInfo(publicClient,clamRes)
				console.log(res);
				return Toast(res)
			}
			Toast(intl.formatMessage({id:"toast.get.success"}))
		}catch (e:any) {
			console.log(e);
			console.log(e.shortMessage || e.message);
			Toast(e.shortMessage || e.message)
		}finally {
			setGetDisabled(false)
		}

	}

	return(
		<>
		<div className="container">
			<NavBar showMenu={false}/>
			<div className="swiper">
				<Swiper autoplay>
					{
						banner.map((item, index) => {
							return (
								<Swiper.Item key={index}>
									<div className="img-box">
										<img src={item.urlimg} width={"100%"} height={"auto"} alt="" />
										<div className="img-info">
											<div className="title">Participate in Ethereum 10th Anniversary</div>
											<div className="desc">Get Free TYOE Airdrop</div>
										</div>
									</div>
								</Swiper.Item>
							)
						})
					}

				</Swiper>
			</div>


			<div className="airdop-box">
				<div className="title">
					<div className="left">
						{intl.formatMessage({id:'airdop.title'})}
					</div>
					<div className="right" style={{opacity:claimed?'1':'0.7'}}>
						<Iconfont icon={'icon-lipin'}></Iconfont>
						{
							claimed ? (
								<div>{intl.formatMessage({id:'airdop.clamied'})}</div>
							) : (
								<div>{intl.formatMessage({id:'airdop.unclamied'})}</div>
							)
						}
					</div>
				</div>
				<p className="desc">
					{intl.formatMessage({id:'airdop.check.desc'})}
				</p>
				<div className="check-nft-button ">
					<button onClick={handlerCheckNft} disabled={claimed}>
						<Iconfont icon={'icon-sousuo'}></Iconfont>
						{intl.formatMessage({id:'airdop.check.nft'})}</button>
				</div>

				<div className="check-nft-info" >
					<Iconfont icon={'icon-zhuyi'} ></Iconfont>
					<p>
						{intl.formatMessage({id:'common.warning'})}：{intl.formatMessage({id:'airdop.check.nft.info'})}
					</p>
				</div>

				{
					nfts.show && !claimed && (
						<div className="check-nft-result">
							<div className="check-nft-result-title">{intl.formatMessage({ id: 'airdop.check.nft.result' })}</div>
							<div className="check-nft-result-item">
								<Iconfont icon={'icon-a-circle-check1'}></Iconfont>
								<div className="middle">
									<div className="top">
										{nfts.balanceNo[0]}
									</div>
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
						{intl.formatMessage({id:'whitelist.title'})}
					</div>
					<div className="right">
						{isWhiteListUser ? <Iconfont icon={'icon-star'}/>:<Iconfont icon={'icon-start-outline'}/>}
						{intl.formatMessage({id:'whitelist.title.not.user'})}
					</div>
				</div>
				<div className="whitelist-tabs">
					<div className="tabs">
						{
							curWhitelistItem  ?
							whiteList.map(item=> {
								return <div className={["tab-label", curWhitelistItem.phase === item.phase ? 'active' : ''].join(' ')} onClick={()=>{setActiveId(item.phase)}} key={`${item.phase}-label`}>
									{intl.formatMessage({ id: 'whitelist.tab.phase' }, { num: item.phase })}
								</div>;
							})
							:""
						}
					</div>
					<div className="tabs-container">
						{
							curWhitelistItem ?
									<WhitePhaseItem {...curWhitelistItem} ></WhitePhaseItem>
								:''
						}

						<div className="controls">
							<button disabled={subscribeDisabled} onClick={handlerClam}>{intl.formatMessage({ id: 'whitelist.subscribe' })}</button>
							<button disabled={getDisabled} onClick={handlerGet}>{intl.formatMessage({ id: 'whitelist.claim' })}</button>
						</div>

						<div className="phase-records">
							<div className="phase-records-title">{intl.formatMessage({ id: 'whitelist.participation.records' })}</div>
							<div className="lists">
								{
									whitelistRecords.map(item=> {
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
							{`https://www.tyoe.net?invite=${userStore.user?.invit}`}
						</div>

						<div className="link-button">
							<button>
								<Iconfont icon={'icon-share'}></Iconfont>
								{intl.formatMessage({ id: 'footer.copy.link' })}
								<Iconfont icon={'icon-fuzhi'} onClick={() => {
									copyText(`https://www.tyoe.net?invite=${userStore.user?.invit}`);
								}}></Iconfont></button>
						</div>
					</div>
				)}


				<ul className="other-link">
					<li>
						<a href="https://ethereum.org/zh/about/" target="_blank">关于我们</a>
					</li>
					<li>
						<a href="https://ethereum.org/zh/assets/" target="_blank">以太坊品牌资产</a>


					</li>
					<li>
						<a href="https://ethereum.org/zh/community/code-of-conduct/" target="_blank">行为守则</a>


					</li>
					<li>
						<a href="https://ethereum.org/zh/about/#open-jobs" target="_blank">工作机会</a>


					</li>
					<li>
						<a href="https://ethereum.org/zh/privacy-policy/" target="_blank">隐私政策</a>


					</li>
					<li>
						<a href="https://ethereum.org/zh/terms-of-use/" target="_blank">使用条款</a>


					</li>
					<li>
						<a href="https://ethereum.org/zh/cookie-policy/" target="_blank">Cookie 政策</a>


					</li>
					<li>
						<a href="mailto:press@ethereum.org" target="_blank">媒体联系方式</a>


					</li>
				</ul>
			</div>
		</div>

		</>
	)
}


export default Home