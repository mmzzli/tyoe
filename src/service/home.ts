import service from "@/utils/request.ts";

export interface Task {
	complete:boolean
	diamond:number
	id:number
	name:string
	url:string
}

export interface InitData {
	diamond:number;
	prizeResultList:any[];
	taskResultList:Task[]
	userId:number
}

export interface InitPrize {
	createTime:string
	id:number
	name:string
	number:string|number
	probability:number
	updateTime:string
	url?:string
}
//定义请求
// curl --location 'https://tg-test.newhuotech.com/bot/getHomePage?userId=7213839162' \
// --header 'token: AAH6vltS2SinTmT4kqf3wfjTGxzlhKkSKl8'

export const getHomeData = ():Promise<InitData> => {
	return service.get(`/api/bot/getHomePage`, )
}

export const completeTask = (data: any) => {
	return service({
		url:`/api/bot/completeTask`,
		params:data
	})
}


export const prizeDraw = () => {
	return service.get(`/api/bot/prizeDraw`,)
}

export const getPrize =():Promise<InitPrize[]>=>{
	return service.get(`/api/bot/listPrize`,)

}
