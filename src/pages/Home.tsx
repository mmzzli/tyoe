import * as React from 'react';
import { useEffect, useState } from 'react';
import './home.scss';
import { ChevronRight, Copy, ExternalLink, Menu } from 'lucide-react';
import avator from '@/assets/images/avator-img.png';
import { Button, Collapse, CollapseItem, Dialog, Popup, PopupPosition, Swiper, Toast } from 'react-vant';
import priceBg from '@/assets/images/price-bg.png';
import logo from '@/assets/images/bigtrainlogo.png';
import Menus from '@/component/Menus.tsx';
import SelectLanguage from '@/component/SelectLanguage.tsx';
import { getHomeBanner, getTokenInfo } from '@/service/home.ts';
import { useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import { copyText, formatAddress, formatNumber, generateRandomString } from '@/utils/common.ts';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSignMessage } from 'wagmi';
import { getLoginOrRegister, getUserInfo, setInviteLink } from '@/service/user.ts';
import { TOKEN } from '@/utils/const.ts';
import useUserStore from '@/store/user.ts';

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
	const [tokenInfo, setTokenInfo] =useState<TokenInfoType|null>(null)
	const navigate = useNavigate();
	const { address, isConnected } = useAccount()
	const {signMessage,data, isSuccess} = useSignMessage()
	const message = generateRandomString(32)
	const token = localStorage.getItem(TOKEN)
	const userStore = useUserStore()
	const [visible, setVisible] = useState(false)
	const [invite,setInvite]  = useState(searchParams.get('invite')||'')
	
	


	// 绑定上级
	const bindInvite = async () => {
		if(!invite.trim()){
			Toast('请输入邀请码')
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

	useEffect(() => {
		if(token)return
		if (isConnected) {
			 signMessage({message})
		}
	}, [isConnected,token])

	useEffect(() => {
		// 调用后端接口
		const request = async () =>{
			const res:any = await getLoginOrRegister({account:address!,hex:message,signed:data!})
			localStorage.setItem(TOKEN, res)
		}
		if(isSuccess){
			request()
		}
	}, [isSuccess,data]);


	useEffect(() => {
		// 当前登录且没有绑定 PID
		if(userStore.user?.id && !userStore.user.pid){
			// 绑定 pid
			setVisible(true)
		}
	}, [userStore.user]);

	useEffect(()=>{
		const getBanner = async ()=>{
			const banner = await getHomeBanner()
			const tokenInfo:any = await getTokenInfo()
			setBanner(banner)
			setTokenInfo(tokenInfo)
		}
		getBanner()
	},[])
	return(
		<div className="container">
			<div className="navbar">
				<div className="left">
					<Menu size={20} onClick={() => setMenuVisable('left')} />
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
					<Swiper autoplay={3000} vertical style={{height:'30px'}}>
						<Swiper.Item className="swiper-item">
							<div style={{fontSize:'12px'}} >Platform upgrade maintenance notice, estimated maintenance time 2 hours</div>
						</Swiper.Item>
						<Swiper.Item className="swiper-item">
							<div style={{fontSize:'12px'}}>Platform upgrade maintenance notice, estimated maintenance time 2 hours</div>
						</Swiper.Item>
					</Swiper>
				</div>
			</div>

			<div className="card m20 invite">
				<div className="top">
					<div className="title">
						邀请好友
					</div>
				</div>
				<div className="main">
					<div className="left">
						<img src={avator} alt="" />
					</div>
					<div className="right">
						<div className="text">個人邀請鏈接</div>
						<div className="link">
							<div className="link-text">{`${window.location.origin}?invite=${userStore.user?.invit}`}</div>
							<Copy size={18} color="#fff" onClick={() => {
								copyText(`${window.location.origin}?invite=${userStore.user?.invit}`)
							}} />
						</div>
					</div>
				</div>
			</div>

			<div className="card mv20 token-info">
				<div className="top">
					<div className="title">
						{intl.formatMessage({id:'home.token.info'})}
					</div>
				</div>
				<div className="main">
					<div className="list-wrapper">
						<div className="list">
							<div className="left">
								{intl.formatMessage({id:'home.token.name'})}：
							</div>
							<div className="right">{tokenInfo?.btdname}</div>
						</div>
						<div className="list">
							<div className="left">
								{intl.formatMessage({id:'home.token.address'})}：
							</div>
							<div className="right">
								<span>{formatAddress(tokenInfo?.btdtoken)}</span>
								<Copy size={18} color="#000" onClick={() => {
									copyText(tokenInfo?.btdtoken || '')
								}} />
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


			<div className="card mv20 lp-info">
				<div className="top">
					<div className="title">
						Lp信息公示
					</div>
				</div>
				<div className="main">
					<div className="profit">
						<div className="profit-title">
							預計下週分紅
						</div>
						<div className="profit-value">
							3，200 Da Lat
						</div>
					</div>
					<div className="profit-clean">
						<div className="left">昨日靜態分紅：</div>
						<div className="right">2，500 Da Lat</div>
					</div>
				</div>
				<div className="top">
					<div className="title">
						分红池
					</div>
				</div>
				<div className="main">
					<div className="list">
						<Swiper slideSize={70} trackOffset={15}>
							<Swiper.Item>
								<div className="list-item list-item-1">
									<div className="top-title">
										1號分紅池
									</div>
									<div className="item">
										<div className="left">直推用户</div>
										<div className="right">3</div>
									</div>
									<div className="item">
										<div className="left">分红占比</div>
										<div className="right">8%</div>
									</div>
									<div className="item">
										<div className="left"> 业绩要求</div>
										<div className="right">5.0K LP</div>
									</div>
									<div className="item">
										<div className="left"> 业绩类型</div>
										<div className="right">小区业绩</div>
									</div>
								</div>
							</Swiper.Item>

							<Swiper.Item>
								<div className="list-item list-item-2">
									<div className="top-title">
										2號分紅池
									</div>
									<div className="item">
										<div className="left">直推用户</div>
										<div className="right">3</div>
									</div>
									<div className="item">
										<div className="left">分红占比</div>
										<div className="right">8%</div>
									</div>
									<div className="item">
										<div className="left"> 业绩要求</div>
										<div className="right">5.0K LP</div>
									</div>
									<div className="item">
										<div className="left"> 业绩类型</div>
										<div className="right">小区业绩</div>
									</div>
								</div>
							</Swiper.Item>
							<Swiper.Item>
								<div className="list-item list-item-3">
									<div className="top-title">
										3號分紅池
									</div>
									<div className="item">
										<div className="left">直推用户</div>
										<div className="right">3</div>
									</div>
									<div className="item">
										<div className="left">分红占比</div>
										<div className="right">8%</div>
									</div>
									<div className="item">
										<div className="left"> 业绩要求</div>
										<div className="right">5.0K LP</div>
									</div>
									<div className="item">
										<div className="left"> 业绩类型</div>
										<div className="right">小区业绩</div>
									</div>
								</div>
							</Swiper.Item>
						</Swiper>
					</div>
					<div className="mine-lp">
						<div className="mine-lp-title">
							<div className="title">我的LP</div>
						</div>
						<div className="mine-lp-value">
							<div className="text">
								1,500LP
							</div>
							<Button type="danger" round={true} className="primary-button">前往 PancakeSwap添加流动性</Button>
						</div>
					</div>
				</div>
			</div>


			<div className="card mv20 problem">
				<div className="top">
					<div className="title">
						常见问题
					</div>
					<div className="desc">
						您有問題嗎？我們有答案！探索我們的常見問題解答，了解 大叻火車項目的一切
					</div>
				</div>

				<div className="main">
					<Collapse initExpanded={['1']}>
						<CollapseItem title="什麼是大叻火車項目？" name="1">
							大叻火車是一個基於區塊鏈技術的去中心化金融項目，通過 創新的代幣經濟模型為用戶提供多元化的收益機會。
						</CollapseItem>
						<CollapseItem title="什麼是大叻火車項目？" name="2">
							大叻火車是一個基於區塊鏈技術的去中心化金融項目，通過 創新的代幣經濟模型為用戶提供多元化的收益機會。
						</CollapseItem>
						<CollapseItem title="什麼是大叻火車項目？" name="3">
							大叻火車是一個基於區塊鏈技術的去中心化金融項目，通過 創新的代幣經濟模型為用戶提供多元化的收益機會。
						</CollapseItem>
						<CollapseItem title="什麼是大叻火車項目？" name="4">
							大叻火車是一個基於區塊鏈技術的去中心化金融項目，通過 創新的代幣經濟模型為用戶提供多元化的收益機會。
						</CollapseItem>
						<CollapseItem title="什麼是大叻火車項目？" name="5">
							大叻火車是一個基於區塊鏈技術的去中心化金融項目，通過 創新的代幣經濟模型為用戶提供多元化的收益機會。
						</CollapseItem>
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
					加密貨幣的價值可能會波動，請謹慎投資和理性對看待
				</div>

				<div className="foot-logo">
					<img src={logo} alt="" />
					<span>大叻火車</span>
				</div>

				<div className="copy">
					@ Da Lat 2025.保留所有權利
				</div>

				<div className="secret">
					<div>隐私政策</div>
					<span>•</span>
					<div>使用条款</div>
				</div>
			</div>
			<Popup
				className={'pop-up-main'}
				visible={menuVisable === 'left'}
				style={{ width: '80%', height: '100%' }}
				position='left'
				onClose={()=>{setMenuVisable('')}}
			>
				<Menus close={()=>{setMenuVisable('')}} />
			</Popup>


			<Dialog
				visible={visible}
				showCancelButton={false}
				showConfirmButton={false}
				onConfirm={() => {
					Toast.info('点击确认按钮')
					setVisible(false)
				}}
				onCancel={() => setVisible(false)}
			>
				<div className="parent-link">
					<div className="title">
						确认上级
					</div>
					<div className="main">
						<div className="input">
							<input value={invite||''} onInput={(e:any)=>{
								console.log(e);
								setInvite(e.target.value)
							}} placeholder={'请确认上级邀请码'}/>
						</div>
						<div className="info">
							注：<br/>
							註冊前請確認上級邀請碼，謹防關係綁定錯誤。
						</div>
						<div className="button" onClick={bindInvite}>签名注册</div>
					</div>
				</div>


			</Dialog>
		</div>

	)
}
export default Home