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