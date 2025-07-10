export default  {
	plugins: {
		'postcss-pxtorem': {
			rootValue: 16, // 设定根元素字体大小（以 px 为单位）
			propList: ['*'], // 可以转换的属性，'*' 表示全部
			unitPrecision: 5, // 转换后保留的小数位数
			exclude: /node_modules/i,
		},
	},
};
