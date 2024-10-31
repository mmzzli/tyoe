import * as React from "react";
import {FC, useEffect, useRef, useState} from "react";
import {InitPrize, prizeDraw} from "@/service/home.ts";
import arrow from "@/assets/images/icon/arrow.svg";
import JoySticImgSrc from "@/assets/images/joystick.svg";
import Game from "@/utils/game.ts";
import {picUrl} from "@/pages/Home.tsx";

const GameComponent:FC<{realPrize:InitPrize[]; setRandom: React.Dispatch<React.SetStateAction<number>>}> = ({realPrize,setRandom})=>{
	const domRef = useRef(null);
	// 手动创建 reelRefs 和 animationRefs 数组，避免在循环中使用 Hooks


	const [shaking,setShaking] = useState(false);

	const [game,setGame] = useState<Game|null>(null)

	const [awardDialog,setAwardDialog] = useState(false)

	const [award,setAward] = useState<{
		id:number
		name:string
		number: number|string
		probability: number
		cumulativeProbability: number
		url:string
	}|null>(null)

	const WHEEL_LENGTH = 3;
	const handlerShake = async () =>{
		if(game){
			setShaking(true)
			setTimeout(()=>{
				setShaking(false)
			},1000)
			const res:any = await game.startAwart(prizeDraw,setRandom,setAwardDialog);
			console.log(res,'查看中的啥');
			setAward(res)
		}
	}


	useEffect(() => {
		console.log(!!domRef.current && !!realPrize.length);
		if(domRef.current&&realPrize.length){
			const game = new Game(realPrize, WHEEL_LENGTH)
			setGame(game)
			game.init()
		}
	}, [realPrize,domRef]);




	return (
		<>
			<div className={`dialog ${awardDialog?'show':''}`}>
				<div className="dialog-title">
					<span className="font-unbounded ">You win</span>
				</div>
				<div className="point">
					{
						award?.number ? <span className="font-terminator">{award?.number}</span> :
							<span className="font-terminator nothing">Nothing</span>
					}
					<img src={award?.url} alt=""/>
				</div>
				<div className="ok" onClick={()=>setAwardDialog(false)}>
					<span className="font-terminator">OK</span>
				</div>


			</div>
			<div className="game" ref={domRef}>
				<div className="game-box">
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
		</>
	)
}

export default GameComponent;
