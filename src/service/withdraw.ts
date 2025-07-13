import service from "@/utils/request.ts";
import { CommonPage } from '@/service/staking.ts';

//
/*"usdt_num": "111.1789",
  "UsdtOutFee": "3%",
  "UsdtOutmin": "0.001",
  "UsdtOutmax": "100"*/
export interface WithdrawInfoInterface{
  usdt_num:string,
  UsdtOutFee:string,
  UsdtOutmin:string,
  UsdtOutmax:string
}
export const getWithdrawInfo = ():Promise<WithdrawInfoInterface> => {
  return service.post("/Coin/transferOutIndex");
}


export interface widthDrawParams{
  hex:string,signed:string,amount:string
}

export const withdrawSubmit = (data:widthDrawParams):Promise<any> => {
  return service.post("/Coin/transferOut",data);
}


export interface WithdrawListItemInterface{
  id:number,
  create_time:string,
  num:string,
  status:number,
  coinname:string
}
export interface withListDataInterFace{
  list:WithdrawListItemInterface[],
  page:number,
  total:number
}

export const widthDrawedList = ({page=1,limit=10}:CommonPage):Promise<withListDataInterFace> =>{
  return service.post("/Coin/getWalletLogw",{page,limit});
}