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
  create_time:string,
  status:string,
  statusint:number,
  oldamount:string
  get_type:string|number
  types:number
}
export interface UserAssetsInterface{
  wallet:{
    usdt_num:string
    wp_num:string
    toUsdtCost:number
  },
  reward:{
    stateMoney:number,
    trendsMoney:number,
    nodeMoney:number,
    pondMoney:number
  },
  list:UserAssetsItem[]
  page:number
  total:number
}

export const getUserAssets = ({page=1,limit=10,types='all'}):Promise<UserAssetsInterface> =>{
  const params = {
    page,
    limit,
    types:Number(types)
  }
  if(types==='all'){
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    delete params.types
  }
  return service.post("/User/myUsdtReward",params);
}

