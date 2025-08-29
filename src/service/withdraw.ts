import service from "@/utils/request.ts";
import { CommonPage } from '@/service/staking.ts';

//
/*"usdt_num": "111.1789",
  "UsdtOutFee": "3%",
  "UsdtOutmin": "0.001",
  "UsdtOutmax": "100"*/
export interface WithdrawInfoInterface{
  wp_num:string,
  UsdtOutFee:string,
  UsdtOutmin:string,
  UsdtOutmax:string
  usdt_num:string
}
export const getWithdrawInfo = ():Promise<WithdrawInfoInterface> => {
  return service.post("/Coin/transferOutIndex");
}


export interface widthDrawParams{
  hex:string,signed:string,amount:string,type:number
}

export const withdrawSubmit = (data:widthDrawParams):Promise<any> => {
  return service.post("/Coin/transferOut",data);
}


export interface WithdrawListItemInterface{
  id:number,
  create_time:string,
  num:string,
  txid:string, //0待审核 ，1成功  2失败
  status:number,
  coinname:string
  fee:number
}
export interface withListDataInterFace{
  list:WithdrawListItemInterface[],
  page:number,
  total:number
}

export const widthDrawedList = ({page=1,limit=10}:CommonPage):Promise<withListDataInterFace> =>{
  return service.post("/Coin/getWalletLogw",{page,limit});
}