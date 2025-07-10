import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { TOKEN } from '@/utils/const.ts';
// 创建 Axios 实例
const service: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_PROXY_URL,
	timeout: 5000, // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
	(config:any) => {
		config.headers.token = localStorage.getItem(TOKEN);
		console.log(config);
		return config
	},
	(error) => {
		// 处理请求错误
		return Promise.reject(error);
	}
);

// 响应拦截器
service.interceptors.response.use(
	(response: AxiosResponse) => {
		// 对响应数据做点什么
		if (response.status === 200) {
			const {code,data,msg:message} = response.data;
			if(code === 200){
				return data;
			}else{
				return Promise.reject(message);
			}
		} else {
			// 处理非 200 状态码
			return Promise.reject(response);
		}
	},
	(error) => {
		// 处理响应错误
		if (error.response) {
			// 服务器返回了状态码，但不在 2xx 范围内
			console.error('服务器错误', error.response);
		} else if (error.request) {
			// 请求已发出，但没有收到响应
			console.error('请求超时或网络错误', error.request);
		} else {
			// 其他错误
			console.error('错误', error.message);
		}
		return Promise.reject(error);
	}
);

export default service;
