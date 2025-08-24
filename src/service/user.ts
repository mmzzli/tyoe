import service from "@/utils/request.ts";

export const getUserInfo = ():Promise<any> => {
  return service.post("/User/getUserInfo");
}


export const getLoginOrRegister = (data:{account:string,hex:string,signed:string}) =>{
  return service.post("/Login/register",{...data})
}

export const setInviteLink  = (invit:string)=>{
  return service.post("/User/findpTeam",{invit})
}



export interface UserAssetsItem{
  id:number,
  amount:string,
  account:string,
  create_time:string,
  status:string,
  statusint:number,
  oldamount:string
  comment:string
  types:number
}
export interface UserAssetsInterface{
  wallet:{
    usdt_num:string
    wp_num:string
    toUsdtCost:number
  },
  reward:{
    totalMoney:number,
    pledgeMoney:number,
    pondMoney:number,
  },
  list:UserAssetsItem[]
  page:number
  total:number
}

export const getUserAssets = ({page=1,limit=10}):Promise<UserAssetsInterface> =>{
  const params = {
    page,
    limit,
  }
  return service.post("/User/myUsdtReward",params);
}

