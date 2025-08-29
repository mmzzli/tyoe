import service from "@/utils/request.ts";



export interface StaingGoodsInterface{
	id:number,
	name:string,
	price:string,
	reward:string,
	total:string,
	maxprice:string
}

export interface StakingRecordInterface{
	id:number,
	order_no:string,
	create_time:string,
	buy_price:string,
	remark:string,
	total_money:string,
	status:string,
	status_name:number
}

export interface StakingInfoInterface{
	pledgeNumber:string,
	pledgegetmoney:number,
	pledgetotal:number
	usdt_num:string
}

export interface CommonPage{
	page?:number,
	limit?:number,
}
export const getGoodsList = ():Promise<{list:StaingGoodsInterface[]}> =>{
	return service.post("/Product/getIndexGoodsList");
}



export const getStakingInfo = ():Promise<StakingInfoInterface> =>{
	return service.post("/User/levelpromsg");
}

interface RecordType extends CommonPage{
	status:number|string
}
export const getStakingRecord = ({page=1,limit=10,status}:RecordType):Promise<{list:StakingRecordInterface[],page:number,total:number}> =>{
	return service.post("/Product/getUserOrder",{page,limit,status});
}

export const buyProduct = async (params:{hash:string,hex:string,signed:string,amount:string,type:number}) =>{
	return service.post("/Product/buyProduct",params)
}

export const unStake = async (params:{id:number})=>{
	return service.post('/Product/delOrder',params)
}