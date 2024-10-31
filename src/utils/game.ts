import {InitPrize} from "@/service/home.ts";

class Game{

	symbolHeight:number=3.975;
	wheelWindow:number=0;
	offset:number = this.symbolHeight/2;

	wheelDom :HTMLElement[] = []

	prizePool: InitPrize[] = []
	prizeList: InitPrize[]  = []
	wheelLength: number = 0;
	shake:boolean = false;

	reelPositions: number[] = []

	animationFrames: number[] = [];

	endings:boolean[] = Array(this.wheelLength).fill(false)

	constructor(prizeList:InitPrize[],wheelLength:number) {
		this.prizeList = prizeList;
		this.wheelLength = wheelLength;
		this.prizePool = [...prizeList,...prizeList]

	}

	start(){

	}

	// 创建 dom
	createDom(){
		const container = document.querySelector('.game .game-box');
		if(container!.children.length === 0){
			for (let i = 0; i < this.wheelLength; i++) {
				const gameItem  = document.createElement('div')
				gameItem.className = 'game-item';

				const gameItemMain = document.createElement('div')
				gameItemMain.className = 'game-item-main'


				for (let j = 0; j < this.prizePool.length; j++) {
					const {url} = this.prizePool[j]
					const awardItem = document.createElement('div')
					awardItem.className = 'game-item-award'

					const img = document.createElement('img')
					img.src = url||''

					awardItem.appendChild(img)
					gameItemMain.appendChild(awardItem)
				}

				gameItem.appendChild(gameItemMain)
				container!.appendChild(gameItem)
			}
		}
	}
	// 初始化
	init(){

		// 可视化高度
		this.wheelWindow = this.prizeList.length*this.symbolHeight;
		// 无縫内容
		// 创建元素
		this.createDom()

		// 获取滚动元素
		this.wheelDom = Array.prototype.slice.call(document.querySelectorAll('.game .game-item-main'));

		// 初始化位置
		const startPosition = this.calculatePosition(0);
		// 更新位置
		this.wheelDom.forEach((item)=>{
			item.style.transform = `translateY(-${startPosition}rem)`;
		})
		this.reelPositions = new Array(this.wheelLength).fill(startPosition)
	}

	// 开始抽奖
	async startAwart(prizeDraw:()=>Promise<any>,setRandom:React.Dispatch<React.SetStateAction<number>>,setDialog:React.Dispatch<React.SetStateAction<boolean>>){
		console.log(this.shake,'stake');
		// 开关限制多次点击
		if(this.shake) return;
		this.shake = true;
			// 滚动起来
		for (let i = 0; i < this.wheelLength; i++) {
			this.endings[i] = true;
			setTimeout(()=>{
				this.spinReel(i)
			},i*300)
		}
		// 查看中奖元素
		const res = await prizeDraw();
		const prize = this.prizeList.find((item) => item.id === res.id);

		if(prize){
			setTimeout(()=>{
				this.stopAllReels(prize,setRandom,setDialog)
			},1000)
		}
		return res;
	}


	spinReel(index:number){
		const step = () => {
			const position = this.reelPositions[index];
			const newPosition = (position + 0.5 + index * 0.1) % this.wheelWindow;
			// 更新元素位置``
			this.wheelDom[index].style.transform = `translateY(-${newPosition}rem)`
			this.reelPositions[index] = newPosition
			this.animationFrames[index] = requestAnimationFrame(step);
		};
		step();
	}


	stopAllReels (prize: InitPrize,setRandom:React.Dispatch<React.SetStateAction<number>>,setDialog:React.Dispatch<React.SetStateAction<boolean>>)  {
		// 按顺序停止滚动
		for (let i = 0; i < this.wheelLength; i++) {
			setTimeout(() => {
				this.stopReel(i, prize,setRandom,setDialog);
			}, i * 1000); // 每个滚动条延迟停止
		}
	};

	stopReel (index: number, prize: InitPrize,setRandom:React.Dispatch<React.SetStateAction<number>>,setDialog:React.Dispatch<React.SetStateAction<boolean>>)  {
		cancelAnimationFrame(this.animationFrames[index]);
		// 找到中奖奖品在 prizePool 中的索引
		const prizeIndex = this.prizePool.findIndex((item) => item.id === prize.id);
		if (prizeIndex === -1) {
			console.error('未找到对应的奖品ID');
			return;
		}

		// 计算停止位置，使中奖符号居中显示
		const position = this.calculatePosition(prizeIndex);
		const newPosition = this.reelPositions[index] = position % this.wheelWindow;
		this.wheelDom[index].style.transform = `translateY(-${newPosition}rem)`;
		this.endings[index] = false;
		if(this.endings.filter(item=>item===false).length === this.wheelLength){
			this.shake = false
			setTimeout(()=>{
				setRandom(Math.random())
				setDialog(true)
			},300)
		}
	};

	calculatePosition(index:number):number{
		return -this.offset + this.wheelWindow + index* this.symbolHeight;
	}
}

export default Game;
