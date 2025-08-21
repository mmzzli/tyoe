import { Toast } from 'react-vant';
import copy from 'copy-to-clipboard'
import {BigNumber} from 'bignumber.js';
import { decodeErrorResult } from 'viem';

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

	return parseInt(t.toString())+'_' + result
}

export const smallNumber = (number:number|string,length=10)=>{
	const num = BigNumber(number).toFormat(length)
	// 格式化数字
	console.log(num,'=======');
// 	0.0000000645的话 显示为 0.0(7)645
// 	就是小数点后面的 0 统计下数量
	let len = 0;
	let end = ''
	const alanysisNum = num.split('.')[1]
	for (let i = 0; i <alanysisNum.length ; i++) {
		if(alanysisNum[i]==='0'){
			len ++ ;
		}else{
			end = alanysisNum.slice(i)
			 break
		}
	}
	return `${num.split('.')[0]}.0(${len})${end}`
}


export const getContractErrorInfo = async (publicClient:any,tx:any) =>{
	console.log(tx,'======');
	try {
		// 2. 用 call 重放
		await publicClient.call({
			to: tx.to,
			data: tx.input,
			from: tx.from,
			value: tx.value,
		})
	} catch (err: any) {
		console.log(err);
		// 3. 从 error.data 中提取 reason
		if (err.cause?.data) {
			try {
				const decoded = decodeErrorResult({
					data: err.cause.data,
				})
				return decoded
			} catch {
				return `Raw revert data: ${err.cause.data}`
			}
		}
		return 'No revert reason'
	}
}