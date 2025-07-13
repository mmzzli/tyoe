import service from "@/utils/request.ts";
export interface AnnouncementInterface{
	id:number,
	title:string,
	title_en:string,
	title_tw:string,
	title_vt:string
	content:string,
	content_en:string,
	content_tw:string,
	content_vt:string,
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