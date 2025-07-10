import service from "@/utils/request.ts";

export const getUserInfo = ():Promise<any> => {
  return service.post("/api/User/getUserInfo");
}


export const getLoginOrRegister = (data:{account:string,hex:string,signed:string}) =>{
  return service.post("/api/Login/register",{...data})
}

export const setInviteLink  = (invit:string)=>{
  return service.post("/api/User/findpTeam",{invit})
}