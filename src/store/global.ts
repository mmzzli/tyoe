import {create} from "zustand";
import { LANGUAGE } from '@/utils/const.ts';
export enum language {
	'zh-TW' = 'zh-TW',
	'en' = 'en-us',
	'vi' = 'vi'
}
type LanguageType = 'zh-TW' | 'en-us' | 'vi';

interface GlobalStore{
	language:LanguageType
	setLanguage:(by:LanguageType)=>void
}

const useLanguageStore = create<GlobalStore>((set)=>(
	{
		language: localStorage.getItem(LANGUAGE) as language ||language.en,
		setLanguage: (by) => set(() => {
			localStorage.setItem(LANGUAGE, by)
			return {language:by}
		}),
	}
))

export default useLanguageStore;
