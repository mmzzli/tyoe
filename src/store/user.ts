import {create} from "zustand";

interface UserType{
	"id": number,
	"pid": number,
	"account": string,
	"invit": string,
	"wp_grade": string,
	"usdt_num": string,
	"wp_num": string,
	"panme": string,
	toUsdtCost:string
}
interface UserStore{
	user:UserType|null;
	setUser: (user:any)=>void;
}

const useUserStore = create<UserStore>((set)=>(
	{
		user:null,
		setUser: (by) => set(() => {
			return {user:by}
		}),
	}
))

export default useUserStore;
