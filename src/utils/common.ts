export const  formatWithSeparator=(number:string|number, separator = ',') =>{
	const parts = number.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
	return parts.join('.');
}
