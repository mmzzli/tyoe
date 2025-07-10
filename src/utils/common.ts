import { Toast } from 'react-vant';
import copy from 'copy-to-clipboard'

export const  formatWithSeparator=(number:string|number, separator = ',') =>{
	const parts = number.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
	return parts.join('.');
}

export const formatAddress = (address:string|undefined) =>{
	if(address){
		return address.slice(0,6)+'...'+address.slice(-4)
	}
	return ''
}

export const formatNumber = (num: number|string) => {
	num = Number(num);
	if (num >= 1000000) {
		return `${(num / 1000000).toFixed(1)}M`;
	}
	if (num >= 1000) {
		return `${(num / 1000).toFixed(1)}K`;
	}
	return num.toLocaleString();
};

export const copyText = (text:string|undefined) =>{
		if(!text) return ''
		copy(text)
		Toast.success('copy success')
}

export const generateRandomString = (n:number) => {
	const t = new Date().getTime() / 1000
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	let result = ''
	const charactersLength = characters.length

	for (let i = 0; i < n; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
	}

	return parseInt(t) + result
}

