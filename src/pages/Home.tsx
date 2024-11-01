import * as React from "react";
import {useEffect, useState} from "react";
import LogoImgSrc from '@/assets/images/logo.svg'
import mission from '@/assets/images/icon/mission.svg'
import diamond from '@/assets/images/icon/diamond.svg'
import missionRight from '@/assets/images/icon/mission-right.svg'
import {completeTask, getHomeData, getPrize, InitData, InitPrize, Task} from "@/service/home.ts";
import {formatWithSeparator} from "@/utils/common.ts";
import Game from "@/component/Game";
import WebApp from "@twa-dev/sdk";
import './Home.scss'


const Home:React.FC = () =>{
	const [prize,setPrize] = useState<InitPrize[]>([])
	const [random,setRandom] = useState(0)




	const [initData,setInitData] = useState<InitData>()


	// 获取首页信息
	const getInitData = async () => {
		const res = await getHomeData()
		setInitData(res)
	}
	// 获取奖品列表
	const initGetPirze = async () => {
		const res = await getPrize()

		setPrize(res);

		console.log(res);
	}
	useEffect(()=>{
		getInitData()
	},[random])

	useEffect(()=>{
		initGetPirze()
	},[])







	// 任务
	const handlerTask = async (task:Task)=>{
		await completeTask({
			taskId:task.id
		});
		WebApp.openLink(task.url)
		setRandom(Math.random())
	}

	const [dialog,setDialog] = useState(false)

	return(
		<div className="home-container">
			<div className={`dialog-mask dialog-tips ${dialog ? 'show' : ''}`}>
				<div className={`dialog `}>
					<div className="dialog-title">
						<span className="font-unbounded ">TIPS</span>
					</div>
					<div className="point font-terminator font-size-tip" >
						Comming Soon
					</div>
					<div className="ok" onClick={() => setDialog(false)}>
						<span className="font-terminator">OK</span>
					</div>


				</div>
			</div>
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
							{formatWithSeparator(initData?.diamond || 0)}
						</div>

					</div>

					<Game realPrize={prize} setRandom={setRandom}/>


				</div>

				<div className="article">
					<div className="article-container">
						<div className="awards">
							<div className="award">
								{
									(initData?.prizeResultList || [])?.map(item => {
										return (<div className="award-item" key={item.prizeId} onClick={()=>setDialog(true)}>
											<img src={item.url} alt=""/>
											<span className="font-terminator">+{item.balance}</span>
										</div>)
									})
								}
							</div>
						</div>
						<div className="mission">
							<div className="mission-title">
								<span className='font-unbounded text-white'>SPECIAL MISSION</span>
							</div>
							<div className="mission-box">
								{
									initData?.taskResultList?.map(item => {
										return (
											<div className={`mission-item ${item.complete ? 'active' : ''}`} key={`task-${item.id}`}>
												<div className="mission-item-main">
													<div className="left">
														<img src={mission} alt=""/>
													</div>
													<div className="middle">
														<div className="up font-unbounded">
															{item.name}
														</div>
														<div className="down">
															<div className="font-terminator">
																<span className="text-white">+{item.diamond}</span>
															</div>
															<span className="symbol">
																<img src={diamond} alt=""/>
															</span>
														</div>
													</div>
													<div className="right" onClick={() => {
														handlerTask(item)
													}}>
														<span className='font-terminator'>GO</span>
													</div>
													<div className="right-arrow">
														<img src={missionRight} alt=""/>
													</div>
												</div>
											</div>
										)
									})
								}


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
