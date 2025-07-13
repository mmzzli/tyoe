import {create} from "zustand";
import { LANGUAGE } from '@/utils/const.ts';
export enum language {
	'tw' = 'tw',
	'en' = 'en',
	'vt' = 'vt'
}
type LanguageType = 'tw' | 'en' | 'vt';

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
