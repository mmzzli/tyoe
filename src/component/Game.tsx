import * as React from "react";
import {FC, useEffect, useRef, useState} from "react";
import {InitPrize, prizeDraw} from "@/service/home.ts";
import arrow from "@/assets/images/icon/arrow.svg";
import JoySticImgSrc from "@/assets/images/joystick.svg";
import Game from "@/utils/game.ts";

const GameComponent:FC<{realPrize:InitPrize[]; setRandom: React.Dispatch<React.SetStateAction<number>>}> = ({realPrize,setRandom})=>{
	const domRef = useRef(null);
	// 手动创建 reelRefs 和 animationRefs 数组，避免在循环中使用 Hooks


	const [shaking,setShaking] = useState(false);

	const [game,setGame] = useState<Game|null>(null)

	const WHEEL_LENGTH = 3;
	const handlerShake = () =>{
		if(game){
			setShaking(true)
			setTimeout(()=>{
				setShaking(false)
			},1000)
			game.startAwart(prizeDraw,setRandom)
		}
	}


	useEffect(() => {
		console.log(!!domRef.current && !!realPrize.length);
		if(domRef.current&&realPrize.length){
			console.log(8888);
			const game = new Game(realPrize, WHEEL_LENGTH)
			setGame(game)
			game.init()
		}
	}, [realPrize,domRef]);




	return (
		<>
			<div className="game" ref={domRef}>
				<div className="game-box">
					{/*{*/}
					{/*	gameRefs.map((itemRef,it) => {*/}
					{/*		return (*/}
					{/*			<div className="game-item" key={`${itemRef}`} ref={reelRefs[it]}>*/}
					{/*				<div className="game-item-main">*/}
					{/*					{*/}
					{/*						prizePool.map((item, index) => {*/}
					{/*							return (*/}
					{/*								<div className="game-item-award" key={`${item.id}${index}`}>*/}
					{/*									<img src={item.url} alt=""/>*/}
					{/*								</div>*/}
					{/*							)*/}
					{/*						})*/}
					{/*					}*/}
					{/*				</div>*/}

					{/*			</div>*/}
					{/*		)*/}
					{/*	})*/}
					{/*}*/}
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
