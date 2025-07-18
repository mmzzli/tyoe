import service from "@/utils/request.ts";
import { CommonPage } from '@/service/staking.ts';



export interface NodeFeeItemInterface{
  title:string,
  title_en:string,
  title_tw:string,
  title_vt:string,
  price:number,
  day:number,
  totalGet:number
}
export interface NodeInfoInterface{
  nodeInfo:{
    totalmoney:string,
    endtimestr:string,
    payTokenAddress:string,
    nodetyp:number
    nodeint:number
  },
  nodeList:NodeFeeItemInterface[]
}
 export const getNodeInfo = ():Promise<NodeInfoInterface> =>{
	return service.post("/Surpernode/listIndex");
}

export interface NodeRecordInterface{
  id:number,
  amount:string,
  create_time:string,
  status: string;
  statusint:number,
  oldamount:string
}
export const getNodeRecordsList = ({page,limit=10}:CommonPage):Promise<{list:NodeRecordInterface[],page:number,total:number}>=>{
  return service.post("/Surpernode/listlog",{page,limit});
}