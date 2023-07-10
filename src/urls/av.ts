export const normalizeURL = (url: string): string => {
	const urlObject = new URL(url);

	urlObject.searchParams.delete('page');
	urlObject.searchParams.set('sort', '4');

	return urlObject.href;
};


export const getPageUrl = (url: string, page: number): string => {
	const urlObject = new URL(url);
	
	urlObject.searchParams.set('page', page.toString());

	return urlObject.href;
};


export const getNextPageURL = (url: string): string => {
	const urlObject = new URL(url);
	
	const curentPage = Number.parseInt(urlObject.searchParams.get('page') || '1');

	return getPageUrl(url, curentPage + 1);
};


export const getCarId = (url: string): number | null => {
	return Number(new URL(url).pathname.split('/').at(-1)) || null;
};
