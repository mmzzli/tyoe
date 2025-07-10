import service from "@/utils/request.ts";

export const getHomeBanner = ():Promise<any> => {
	return service.get("/Login/banner");
}

export const getTokenInfo = ()=>{
	return service.get("/Login/setioninfo");
}