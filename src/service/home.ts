import service from "@/utils/request.ts";

export const getHomeBanner = ():Promise<any> => {
	return service.get("/Login/banner");
}

export const getTokenInfo = ()=>{
	return service.get("/Login/setioninfo");
}

export interface ProblemInterface {
	id: number;
	title: string;
	content: string;
}
export const getProblems = ():Promise<{list:ProblemInterface[],page:number}>=>{
	return service.post('/News/indexqa')
}