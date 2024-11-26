import {create} from "zustand";

interface UserStore{
	user:any;
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
