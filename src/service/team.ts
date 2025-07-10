import service from "@/utils/request.ts";

export const getMyTeams = ():Promise<any> => {
  return service.post("/User/myTeam");
}