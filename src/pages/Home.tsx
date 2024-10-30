import * as React from "react";
import LogoImgSrc from '@/assets/images/logo.svg'
import JoySticImgSrc from '@/assets/images/joystick.svg'
import coin1 from '@/assets/images/coin/coin1.png'
import coin2 from '@/assets/images/coin/coin2.png'
import none from '@/assets/images/coin/none.png';
import arrow from '@/assets/images/icon/arrow.svg'
import mission from '@/assets/images/icon/mission.svg'
import diamond from '@/assets/images/icon/diamond.svg'
import missionRight from '@/assets/images/icon/mission-right.svg'
import './Home.scss'
import {useEffect, useState} from "react";
const REWARD_POOL = [coin1,coin2,none];
const REPEAT_POOL  = [...REWARD_POOL,...REWARD_POOL]
const Home:React.FC = () =>{
	const [shaking,setShaking] = useState(false)
	const handlerShake = () =>{
		console.log('shaking')
		if(shaking) return true;
		setShaking(true)
		setTimeout(()=>{
			setShaking(false)
		},1000)
	}

	// 初始给定默认位置
	useEffect(()=>{

	})
	return(
    <div className="home-container">
			<div className="home-container-inner">
				<div className="logo">
					<img src={LogoImgSrc} alt=""/>
				</div>
				<div className="main">
					<div className="each-time">
						<span className="each-point font-terminator">
							<i>
								100
							</i>
							<i>100</i>
						</span>
						<span className="info">
							<span className="font-unbounded">
								EACH TIME
							</span>
						</span>
					</div>

					<div className="point-container font-terminator">
						<div className="point-info">
							JACKPOT
						</div>
						<div className="point">
							215,966,230
						</div>

					</div>
					<div className="game">
						<div className="game-box">
							<div className="game-item">
								{
									REPEAT_POOL.map((item,index)=> {
										return (
											<div className="game-item-award" key={`${item}${index}`}>
												<img src={item} alt=""/>
											</div>
										)
									})
								}

							</div>
							<div className="game-item">
								{
									REPEAT_POOL.map((item,index)=> {
										return (
											<div className="game-item-award" key={`${item}${index}`}>
												<img src={item} alt=""/>
											</div>
										)
									})
								}
							</div>
							<div className="game-item">
								{
									REPEAT_POOL.map((item,index)=> {
										return (
											<div className="game-item-award" key={`${item}${index}`}>
												<img src={item} alt=""/>
											</div>
										)
									})
								}
							</div>
						</div>
					</div>

					<div className="game-slogin">
						<span className="arrow">
							<img src={arrow} alt=""/>
						</span>
						<div className="font-terminator">PRIZE DESCRIPTION</div>
						<span className="arrow">
							<img src={arrow} alt=""/>
						</span>
					</div>

					<div className={['joystick', shaking ? 'shaking' : ''].join(' ')} onClick={handlerShake}>
						<img src={JoySticImgSrc} alt=""/>
					</div>
					<div className="start">
						<span className="font-terminator">START</span>
					</div>
					<div className="awards">
						<div className="award">
							<div className="award-item">
								<img src={coin1} alt=""/>
								<span className="font-terminator">+1000000</span>
							</div>

							<div className="award-item">
								<img src={coin2} alt=""/>
								<span className="font-terminator">+1000000</span>
							</div>

						</div>
					</div>
				</div>
				<div className="article">
					<div className="article-container">
						<div className="mission">
							<div className="mission-title">
								<span className='font-unbounded text-white'>SPECIAL MISSION</span>
							</div>
							<div className="mission-box">
								<div className="mission-item">
									<div className="mission-item-main default">
										<div className="left">
											<img src={mission} alt=""/>
										</div>
										<div className="middle">
											<div className="up font-unbounded">
												Follow Our X
											</div>
											<div className="down">
												<div className="font-terminator">
													<span className="text-white">+100</span>
												</div>
												<span className="symbol">
												<img src={diamond} alt=""/>
											</span>
											</div>
										</div>
										<div className="right">
											<span className='font-terminator'>GO</span>
										</div>
										<div className="right-arrow">
											<img src={missionRight} alt=""/>
										</div>
									</div>
								</div>
								<div className="mission-item active">
									<div className="mission-item-main">
										<div className="left">
											<img src={mission} alt=""/>
										</div>
										<div className="middle">
											<div className="up font-unbounded">
												Follow Our X
											</div>
											<div className="down">
												<div className="font-terminator">
													<span className="text-white">+100</span>
												</div>
												<span className="symbol">
												<img src={diamond} alt=""/>
											</span>
											</div>
										</div>
										<div className="right">
											<span className='font-terminator'>GO</span>
										</div>
										<div className="right-arrow">
											<img src={missionRight} alt=""/>
										</div>
									</div>
								</div>

							</div>
						</div>

						<div className="footer">
							<div className="logo">
								<img src={LogoImgSrc} alt=""/>
							</div>
						</div>
					</div>

				</div>
			</div>

		</div>
	)
}
export default Home
