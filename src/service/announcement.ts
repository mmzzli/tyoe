import service from "@/utils/request.ts";
export interface AnnouncementInterface{
	id:number,
	title:string,
	content:string,
	create_time:string,
	author?:string
}
export const getAnnouncementList = ():Promise<{list:AnnouncementInterface[],page:number}> => {
	return service.get("/News/index");
}


export const getAnnouncementDetailById = ({id}:{id:number}):Promise<any> => {
	return service.post("/News/info",{id});
}

export const getLatestAnnouncement = ():Promise<AnnouncementInterface> => {
	return service.get("Index/newslsat");
}