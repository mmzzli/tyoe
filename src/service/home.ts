import service from '@/utils/request.ts';

export const getHomeBanner = ():Promise<any> => {
	return service.get("/Login/banner");
}

export const getTokenInfo = ()=>{
	return service.get("/Login/setioninfo");
}

export interface ProblemInterface {
	id: number;
	title: string;
	title_en: string;
	title_tw: string;
	title_vt: string;
	content: string;
	content_en: string;
	content_tw: string;
	content_vt: string;
}
export const getProblems = ():Promise<{list:ProblemInterface[],page:number}>=>{
	return service.post('/News/indexqa')
}

// {
// 	"levelinfo": [{
// 	"id": 2,
// 	"name": "二号分红池",
// 	"name_en": "Pool Two",
// 	"name_tw": "二號分紅池",
// 	"name_vt": "Nhóm chia lợi nhuận 2",
// 	"service_charge": 5000,
// 	"level_id": 1,
// 	"ratio": 0.3,
// 	"num": 5
// }, {
// 	"id": 3,
// 	"name": "三号分红池",
// 	"name_en": "Pool Three",
// 	"name_tw": "三號分紅池",
// 	"name_vt": "Nhóm chia lợi nhuận 3",
// 	"service_charge": 50000,
// 	"level_id": 1,
// 	"ratio": 0.2,
// 	"num": 5
// }, {
// 	"id": 4,
// 	"name": "四号分红池",
// 	"name_en": "Pool Four",
// 	"name_tw": "四號分紅池",
// 	"name_vt": "Nhóm chia lợi nhuận 4",
// 	"service_charge": 500000,
// 	"level_id": 1,
// 	"ratio": 0.1,
// 	"num": 5
// }],
// 	"lpinfo": {
// 	"nextnumber": 20,
// 		"befernumber": 60,
// 		"yestodaynumber": 760,
// 		"mynumber": 12
// }
// }
export interface LevelInfoInterface {
	id: number;
	name: string;
	name_en: string;
	name_tw: string;
	name_vt: string;
	service_charge: number;
	level_id: number;
	ratio: number;
	num: number;
}
export interface LpInfoInterface {
	levelinfo:LevelInfoInterface[],
	lpinfo:{
		nextnumber:number,
		befernumber:number,
		yestodaynumber:number,
		mynumber:number
	}
}
export const getLpinfo = ():Promise<LpInfoInterface>=>{
	return service.post('/Surpernode/LpLevel')
}


export interface LpListItemInterface {
	id:number,
	amount:string,
	create_time:string,
	type:number// 1 添加 2 移除 3 转移
}
export interface LpListInterface {
	page: string;
	total: number;
	mynumber: number;
	list:LpListItemInterface[]
}
interface LpListParamsInterface {
	type:number,
	page:number,
	limit:number
}
export const getLpList = ({type,page,limit=10}:LpListParamsInterface):Promise<LpListInterface>=>{
	const params:any = {
		get_type:type,page,limit
	}
	if(type=== -1){
		delete params.get_type
	}
	return service.post('/Surpernode/listlplog',params)
}