import service from "@/utils/request.ts";

export interface TeamInterface {
  userInfo: UserInfo;
  firstLen: number;
  firstList: TeamMember[];
  page: number;
  total:number;
}

interface UserInfo {
  id: number;
  pid: number;
  account: string;
  invit: string;
  whitesta: number;
  freesta: number;
  create_time: string;
  pledgenum: number;
  pledgeteam: number;
}

export interface TeamMember {
  id: number;
  account: string;
  create_time: string;
  whitesta: number;
  freesta: number;
  pledgenum: number;
}
export const getMyTeams = (params:{page:number,limit:number}):Promise<TeamInterface> => {
  return service.post("/User/myTeam",params);
}