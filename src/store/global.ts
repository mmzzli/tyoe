import {create} from "zustand";
type Language = 'zh' | 'zh-TW' | 'en' | 'vi';

interface GlobalStore{
	language:Language
	setLanguage:(by:Language)=>void
}

const useLanguageStore = create<GlobalStore>((set)=>(
	{
		language:'zh',
		setLanguage: (by) => set(() => {
			return {language:by}
		}),
	}
))

export default useLanguageStore;
