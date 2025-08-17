import * as React from 'react';
import { useState } from 'react';
import './home.scss';
import { Swiper } from 'react-vant';
import SelectLanguage from '@/component/SelectLanguage.tsx';
import { useIntl } from 'react-intl';
import bannerUrl from '@/assets/images/banner.png';
import logoUrl from '@/assets/images/TYOE.png';
import { ConnectButtonCustom } from '@/component/ConnectButtonCustom.tsx';
import Iconfont from '@/component/Iconfont.tsx';
import WhitePhaseItem, { PhaseItemProps } from '@/component/PhaseItem.tsx';

const Home:React.FC = () =>{
	const intl = useIntl()
	const banner = [
		{ urlimg: bannerUrl },
	]


	document.title = intl.formatMessage({id:'app.name'})


	const phases: PhaseItemProps[]= [
		{
			phase: 1,
			duration: 10,
			priceUSD: 100,
			totalSlots: 2000,
			availableSlots: 1450,
			countdown: '2025-10-31 23:59:59',
		},
		{
			phase: 2,
			duration: 10,
			priceUSD: 120,
			totalSlots: 3000,
			availableSlots: 3000,
			countdown: '2025-11-31 23:59:59',
		},
		{
			phase: 3,
			duration: 10,
			priceUSD: 150,
			totalSlots: 5000,
			availableSlots: 5000,
			countdown: '2025-12-31 23:59:59',
		},
	];

	const [curPhase,setCurPhase] = useState(phases[0])






	return(
		<div className="container">
			<div className="navbar">
				<div className="left">
					<img src={logoUrl} alt="" />
				</div>
				<div className="middle">
					<ConnectButtonCustom />
				</div>
				<div className="right">
					<SelectLanguage/>
				</div>
			</div>
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
					<div className="right">
							<Iconfont icon={'icon-lipin'}></Iconfont>
							{intl.formatMessage({id:'airdop.unclamied'})}
					</div>
				</div>
				<p className="desc">
					{intl.formatMessage({id:'airdop.check.desc'})}
				</p>
				<div className="check-nft-button">
					<button>
						<Iconfont icon={'icon-sousuo'}></Iconfont>
						{intl.formatMessage({id:'airdop.check.nft'})}</button>
				</div>

				<div className="check-nft-info">
					<Iconfont icon={'icon-zhuyi'} ></Iconfont>
					<p>
					{intl.formatMessage({id:'common.warning'})}：{intl.formatMessage({id:'airdop.check.nft.info'})}
					</p>
				</div>

				<div className="check-nft-result">
					<div className="check-nft-result-title">{intl.formatMessage({id:'airdop.check.nft.result'})}</div>
					<div className="check-nft-result-item">
						<Iconfont icon={'icon-a-circle-check1'}></Iconfont>
						<div className="middle">
							<div className="top">
								0x1234....5678
							</div>
							<div className="bottom">
								{intl.formatMessage({id:'airdop.check.nft.result.reward'})}:100 TYOE
							</div>
						</div>
						<div className="right">
							{intl.formatMessage({id:'airdop.check.nft.result.success'})}
						</div>

					</div>
				</div>

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
					{/*<div className="airdop-rule-item" data-num={3}>*/}
					{/*	{intl.formatMessage({ id: 'airdop.rule.3' })}*/}
					{/*</div>*/}
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
						<Iconfont icon={'icon-start-outline'}/>
						{intl.formatMessage({id:'whitelist.title.not.user'})}
					</div>
				</div>
				<div className="whitelist-tabs">
					<div className="tabs">
						{
							phases.map(item=> {
								return <div className={['tab-label', curPhase.phase === item.phase ? 'active' : ''].join(' ')} onClick={()=>{setCurPhase(item)}} key={`${item.phase}-label`}>
									{intl.formatMessage({ id: 'whitelist.tab.phase' }, { num: item.phase })}
								</div>;
							})
						}
					</div>
					<div className="tabs-container">
						<WhitePhaseItem {...curPhase} ></WhitePhaseItem>
					</div>
				</div>
			</div>



			<div className="footer">
				<div className="media">
					{intl.formatMessage({id:'footer.social.media'})}
				</div>
				<div className="media-list">
					<Iconfont icon={'icon-tuite1'}></Iconfont>
					<Iconfont icon={'icon-telegram'}></Iconfont>
					<Iconfont icon={'icon-discard'}></Iconfont>
				</div>
				<div className="link">
					<div className="invite">
						{intl.formatMessage({id:'footer.invite.link'})}
					</div>
					<div className="link-text">
						https://tyoe.io/invite/abc***xyz
					</div>

					<div className="link-button">
						<button>
							<Iconfont icon={'icon-share'}></Iconfont>
							{intl.formatMessage({id:'footer.copy.link'})}
							<Iconfont icon={'icon-fuzhi'}></Iconfont></button>


					</div>
				</div>
			</div>
		</div>

	)
}



export default Home