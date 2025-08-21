import { RouteObject } from "react-router-dom";
import {lazy, Suspense} from "react";

// 动态导入 pages 目录下的所有 .tsx 文件
const modules: any = import.meta.glob('../pages/**/*.tsx');

console.log(modules);

interface MyRoutesItem {
	path: string;
	component: string;
	name?: string;
	children?: MyRoutesItem[];
}

// 定义静态路由
const myRoutes: MyRoutesItem[] = [
	{
		path: "/",
		component: './Home', // 这里应该是 Home 组件
		name: 'Home',
	},
	{
		path: "/assets",
		component: './Assets',
		name: 'Assets',
	},
	{
		path: "/announcements",
		component: './Announcements',
		name: 'Announcements',
	},
	{
		path: "/announcement-detail",
		component: './AnnouncementDetail',
		name: 'AnnouncementDetail',
	},
	{
		path: "/team",
		component: './Team',
		name: 'Team',
	},
	{
		path: "/withdraw",
		component: './Withdraw',
		name: 'Withdraw',
	},
	{
		path: "/staking",
		component: './Staking',
		name: 'Staking',
	},
	{
		path: "/staking-records",
		component: './StakingRecords',
		name: 'StakingRecords',
	}
];

// 生成路由
const genRoute = (routes: MyRoutesItem[]): RouteObject[] => {
	return routes.map(route => {
		const { component, path, children } = route;
		const genPath = `../pages${component.replace(/\./g,'')}.tsx`; // 修正路径
		const CurComp = lazy(modules[genPath]); // 动态导入组件
		const curRoutes: RouteObject = {
			path: path,
			element: (
				<Suspense fallback={<div>Loading...</div>}><CurComp/></Suspense>
			),
		};

		if (children) {
			curRoutes.children = genRoute(children); // 递归生成子路由
		}

		return curRoutes;
	});
};

// 生成最终路由数组
const routes: RouteObject[] = genRoute(myRoutes);
export default routes;
