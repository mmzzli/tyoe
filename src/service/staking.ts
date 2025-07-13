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
	total_money:string,
	core_num:string,
	status:string,
	create_time:string,
	confirm_time:string|number,
	remark:string,
	buy_price:string,
	status_name:number
}

export interface StakingInfoInterface{
	pledgeNumber:string,
	pledgegetmoney:number,
	pledgetotal:number
}

export interface CommonPage{
	page?:number,
	limit?:number,
}
export const getGoodsList = ():Promise<{list:StaingGoodsInterface[]}> =>{
	return service.post("/Product/getIndexGoodsList");
}

export const buyProduct = (data:{id:number,amount:string,hex:string,signed:string})=>{
	return service.post("/Product/buyProduct",{...data})
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