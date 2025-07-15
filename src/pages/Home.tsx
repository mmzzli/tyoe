import * as React from 'react';
import { useEffect, useState } from 'react';
import './home.scss';
import { ChevronRight, ExternalLink } from 'lucide-react';
import avator from '@/assets/images/avator-img.png';
import { Button, Collapse, CollapseItem, Dialog, Popup, PopupPosition, Swiper, Toast } from 'react-vant';
import priceBg from '@/assets/images/price-bg.png';
import logo from '@/assets/images/bigtrainlogo.png';
import Menus from '@/component/Menus.tsx';
import SelectLanguage from '@/component/SelectLanguage.tsx';
import {
	getHomeBanner,
	getLpinfo,
	getProblems,
	getTokenInfo,
	LpInfoInterface,
	ProblemInterface,
} from '@/service/home.ts';
import { useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import { copyText, formatAddress, formatNumber, generateRandomString } from '@/utils/common.ts';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSignMessage } from 'wagmi';
import { getLoginOrRegister, getUserInfo, setInviteLink } from '@/service/user.ts';
import { TOKEN } from '@/utils/const.ts';
import useUserStore from '@/store/user.ts';
import { AnnouncementInterface, getLatestAnnouncement } from '@/service/announcement.ts';
import Iconfont from '@/component/Iconfont.tsx';
import useLanguageStore from '@/store/global.ts';
import {BigNumber} from 'bignumber.js'

interface BannerItem{
	urlimg:string;
}
interface TokenInfoType{
	"price": string,
	"pricedeth": string,
	"totalnumber": string,
	"destroynumber": number,
	"yestodayFireNumber": number,
	"lessNumber": number,
	"btdtoken": string,
	"btdname": string
}
const Home:React.FC = () =>{
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const [menuVisable, setMenuVisable] = useState<PopupPosition>('')
	const intl = useIntl()
	const [banner, setBanner] = useState<BannerItem[]>([])
	const [announcement,setAnnouncement] = useState<AnnouncementInterface|null>(null)
	const [problems,setProblems] = useState<ProblemInterface[]|null>(null)
	const [tokenInfo, setTokenInfo] =useState<TokenInfoType|null>(null)
	const [lpInfo,setLpInfo] = useState<LpInfoInterface|null>(null)
	const navigate = useNavigate();
	const { address, isConnected } = useAccount()
	const {signMessageAsync} = useSignMessage()
	const [isSigned,setSigned] = useState(false)
	const userStore = useUserStore()
	const [visible, setVisible] = useState(false)
	const [invite,setInvite]  = useState(searchParams.get('invite')||'')
	const {language}  = useLanguageStore()

	document.title = intl.formatMessage({id:'app.name'})

	const clearUser = ()=>{
		localStorage.removeItem(TOKEN)
		userStore.setUser(null)
		setVisible(false)
		setSigned(false)
	}
	// 用户和地址不匹配
	useEffect(() => {
		if(userStore.user && address){
			if(userStore.user?.account !== address){
				clearUser();
			}
		}else{
			clearUser();
		}
	}, [userStore.user,address]);


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
		setSigned(true)
		const res:any = await getLoginOrRegister({account:address!,hex:message,signed:data})
		localStorage.setItem(TOKEN, res)
		try{
			const res = await getUserInfo()
			userStore.setUser(res)
		}catch  {
			localStorage.removeItem(TOKEN)
		}
	}

	// 如果有用户信息不需要再登录
	useEffect(() => {
		if(userStore.user?.id) return
		if (isConnected && !isSigned) {
			login()
		}
	}, [isConnected,userStore.user,isSigned])

	useEffect(() => {
		if(!address){
			clearUser();
		}
	}, [address]);


	useEffect(() => {
		const fetchLp = async ()=>{
			const lpInfo = await getLpinfo()
			setLpInfo(lpInfo)

		}
		// 当前登录且没有绑定 PID
		if(userStore.user?.id && !userStore.user.pid && address){
			// 绑定 pid
			setVisible(true)
		}
		// 用户登陆了获取 Lp 信息
		if(userStore?.user?.id && isConnected && userStore.user.account === address){
			fetchLp();
		}else{
			setLpInfo(null)
		}
	}, [userStore.user,address]);

	useEffect(()=>{
		const getBanner = async ()=>{
			const [banner,tokenInfo,announcement,problems] = await Promise.all<any>([getHomeBanner(),getTokenInfo(),getLatestAnnouncement(),getProblems()])
			setBanner(banner)
			setTokenInfo(tokenInfo)
			setAnnouncement(announcement)
			setProblems(problems?.list)
		}
		getBanner()
	},[])


	return(
		<div className="container">
			<div className="navbar">
				<div className="left">
					<Iconfont onClick={() => setMenuVisable('left')} icon={'icon-ego-menu'}></Iconfont>
				</div>
				<div className="middle">
					{
						!address ? <ConnectButton /> : <div className="address">{formatAddress(address)}</div>
					}
				</div>
				<div className="right">
					<SelectLanguage/>
				</div>
			</div>

			<div className="swiper">
				<Swiper autoplay style={{height:'225px'}}>
					{
						banner.map((item, index) => {
							return (
								<Swiper.Item key={index}>
									<img src={item.urlimg} width={"100%"} height={"auto"} alt="" />
								</Swiper.Item>
							)
						})
					}

				</Swiper>
			</div>

			<div className="notice m20 card">
				<div className="top" onClick={()=>{
					navigate('/announcements')
				}}>
					<div className="title">
						{intl.formatMessage({id:'home.announcement'})}
					</div>
					<div className="right">
						<ChevronRight size={20} color="#FC6612" />
					</div>
				</div>
				<div className="main">
					<div style={{ fontSize: '12px' }}>
						{announcement?.[`title_${language}`] || announcement?.[`title`]}
					</div>

				</div>
			</div>

			{
				userStore.user?.invit && <div className="card m20 invite">
					<div className="top">
						<div className="title">
							{intl.formatMessage({ id: 'home.invite.title' })}
						</div>
					</div>
					<div className="main">
						<div className="left">
							<img src={avator} alt="" />
						</div>
						<div className="right">
							<div className="text">{intl.formatMessage({ id: 'home.invite.link' })}</div>
							<div className="link">
								<div className="link-text">{`${window.location.origin}?invite=${userStore.user?.invit}`}</div>
								<Iconfont icon={'icon-fuzhi'} onClick={() => {
									copyText(`${window.location.origin}?invite=${userStore.user?.invit}`);
								}}></Iconfont>
							</div>
						</div>
					</div>
				</div>
			}


			<div className="card mv20 token-info">
				<div className="top">
					<div className="title">
						{intl.formatMessage({ id: 'home.token.info' })}
					</div>
				</div>
				<div className="main">
					<div className="list-wrapper">
						<div className="list">
							<div className="left">
								{intl.formatMessage({ id: 'home.token.name' })}：
							</div>
							<div className="right">{tokenInfo?.btdname}</div>
						</div>
						<div className="list">
							<div className="left">
								{intl.formatMessage({ id: 'home.token.address' })}：
							</div>
							<div className="right">
								<span>{formatAddress(tokenInfo?.btdtoken)}</span>
								<Iconfont icon={'icon-fuzhi'} onClick={() => {
									copyText(tokenInfo?.btdtoken || '')
								}}></Iconfont>
							</div>
						</div>
						<div className="list">
							<div className="left">
								{intl.formatMessage({id:'home.token.supply'})}：
								</div>
							<div className="right">{formatNumber(tokenInfo?.totalnumber||0)}</div>
						</div>
					</div>
					<div className="price">
						<img src={priceBg} width={"100%"} height={"auto"} alt="" />
						<div className="price-main">
							<div className="title">
								{intl.formatMessage({id:'home.token.price'})}
								</div>
							<div className="price-box">$ {formatNumber(tokenInfo?.price||0)}</div>
							<div className={tokenInfo?.pricedeth.startsWith('-')?'price-down':'price-rise'}>{tokenInfo?.pricedeth.startsWith('-')?'-':'+'} {tokenInfo?.pricedeth}%</div>
						</div>
					</div>

					<div className="swap">
						<div className="link" onClick={()=>{
							window.open('https://pancakeswap.finance/swap?chain=bsc&outputCurrency=0xe8cC9fb1712F04Df6A8f2141f06Db4f72713AeA8')
						}}>
							PancakeSwap
						</div>
						<ExternalLink size={18} color="#FC6612" />
					</div>
					<div className="pools">
						<div className="pools-item">
							<div className="top">
								{intl.formatMessage({id:'home.token.burned'})}
							</div>
							<div className="value">
								{formatNumber(tokenInfo?.yestodayFireNumber||0)} {tokenInfo?.btdname}
							</div>
						</div>
						<div className="pools-item">
							<div className="top">
								{intl.formatMessage({id:'home.token.fund.pool'})}

							</div>
							<div className="value">
								{formatNumber(tokenInfo?.lessNumber||0)} {tokenInfo?.btdname}
							</div>
						</div>
						<div className="pools-item">
							<div className="top">
								{intl.formatMessage({id:'home.token.destroyed'})}
							</div>
							<div className="value">
								{formatNumber(tokenInfo?.destroynumber||0)} {tokenInfo?.btdname}
							</div>
						</div>
					</div>
				</div>
			</div>


			{
				lpInfo ? <div className="card mv20 lp-info">
					<div className="top">
						<div className="title">
							{intl.formatMessage({ id: 'home.lp.title' })}
						</div>
					</div>
					<div className="main">
						<div className="profit">
							<div className="profit-title">
								{intl.formatMessage({ id: 'home.lp.expected.dividend' })}
							</div>
							<div className="profit-value">
								{BigNumber(lpInfo?.lpinfo?.nextnumber || 0).toFormat()} Da Lat
							</div>
						</div>
						<div className="profit-clean">
							<div className="left">{intl.formatMessage({ id: 'home.lp.yesterday.dividend' })}：</div>
							<div className="right">
								{BigNumber(lpInfo?.lpinfo?.yestodaynumber || 0).toFormat()} Da Lat
							</div>
						</div>
					</div>
					<div className="top">
						<div className="title">
							{intl.formatMessage({ id: 'home.lp.pool' })}
						</div>
					</div>
					<div className="main">
						<div className="list">
							<Swiper slideSize={70} trackOffset={15}>
								{
									(lpInfo?.levelinfo || []).map((item, index) => {
										const name = item[`name_${language}`] || item.name
										const typeTitle = item.level_id === 0 ? intl.formatMessage({ id: 'home.lp.total.performance' }) : intl.formatMessage({ id: 'home.lp.district.performance' })
										return (
											<Swiper.Item key={item.id}>
												<div className={`list-item list-item-${index % 3 + 1}`}>
													<div className="top-title">
														{name}
													</div>
													<div className="item">
														<div className="left">{intl.formatMessage({ id: 'home.lp.direct.users' })}
														</div>
														<div className="right">{item.num}</div>
													</div>
													<div className="item">
														<div className="left">{intl.formatMessage({ id: 'home.lp.dividend.ratio' })}</div>
														<div className="right">{item.ratio}%</div>
													</div>
													<div className="item">
														<div className="left"> {intl.formatMessage({ id: 'home.lp.performance.requirement' })}</div>
														<div className="right">{formatNumber(item.service_charge)} LP</div>
													</div>
													<div className="item">
														<div className="left"> {intl.formatMessage({ id: 'home.lp.performance.type' })}</div>
														<div className="right">{typeTitle}</div>
													</div>
												</div>
											</Swiper.Item>
										)
									})
								}
							</Swiper>
						</div>
						<div className="mine-lp">
							<div className="mine-lp-title">
								<div className="title">{intl.formatMessage({ id: 'home.lp.my' })}</div>
							</div>
							<div className="mine-lp-value">
								<div className="text">
									{BigNumber(lpInfo?.lpinfo.mynumber || 0).toFormat()}LP
								</div>
								<Button type="danger" round={true} className="primary-button" onClick={() => {
									window.open('https://pancakeswap.finance/swap?utm_source=tokenpocket')
								}}>{intl.formatMessage({ id: 'home.lp.add.liquidity' })}</Button>
							</div>
						</div>
					</div>
				</div>:<></>
			}


			<div className="card mv20 problem">
				<div className="top">
					<div className="title">
						{intl.formatMessage({ id: 'home.faq.title' })}
					</div>
					<div className="desc">
						{intl.formatMessage({ id: 'home.faq.subtitle' })}

					</div>
				</div>

				<div className="main">
					<Collapse>
						{
							problems?.map((item) => {
								const title = item?.[`title_${language}`] || item?.[`title`]
								const content = item?.[`content_${language}`] || item?.[`content`]
								return <CollapseItem title={title} key={item.id} name={item.id}>
									{content}
								</CollapseItem>
							})
						}


					</Collapse>


				</div>
			</div>

			<div className="card mv20 footer">
				<div className="link">
					<div className="link-item">
						𝕏
					</div>
					<div className="link-item">
						💼
					</div>
					<div className="link-item">
						✈️
					</div>
					<div className="link-item">
						📺
					</div>
				</div>
				<div className="info">
					{intl.formatMessage({ id: 'home.footer.disclaimer' })}
				</div>

				<div className="foot-logo">
					<img src={logo} alt="" />
					<span>{intl.formatMessage({ id: 'app.name' })}</span>
				</div>

				<div className="copy">
					{intl.formatMessage({ id: 'home.footer.copyright' })}

				</div>

				<div className="secret">
					<div>{intl.formatMessage({ id: 'home.footer.privacy' })}</div>
					<span>•</span>
					<div>{intl.formatMessage({ id: 'home.footer.terms' })}</div>
				</div>
			</div>
			<Popup
				className={'pop-up-main'}
				visible={menuVisable === 'left'}
				style={{ width: '80%', height: '100%' }}
				position='left'
				onClose={() => {
					setMenuVisable('')
				}}
			>
				<Menus close={() => {
					setMenuVisable('')
				}} />
			</Popup>


			<Dialog
				visible={visible}
				showCancelButton={false}
				showConfirmButton={false}
			>
				<div className="parent-link">
					<div className="title">
						{intl.formatMessage({id:'bind.invite.title'})}
					</div>
					<div className="main">
						<div className="input">
							<input value={invite || ''} onInput={(e: any) => {
								console.log(e);
								setInvite(e.target.value)
							}} placeholder={intl.formatMessage({id:'bind.invite.placeholder'})} />
						</div>
						<div className="info">
							{intl.formatMessage({id:'bind.invite.tip'})}
						</div>
						<div className="button" onClick={bindInvite}>{intl.formatMessage({id:'bind.invite.button'})}</div>
					</div>
				</div>


			</Dialog>
		</div>

	)
}
export default Home