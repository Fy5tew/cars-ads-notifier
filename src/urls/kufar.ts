export const normalizeURL = (url: string): string => {
	const urlObject = new URL(url);

	urlObject.searchParams.delete('cursor');
	urlObject.searchParams.set('sort', 'lst.d');

	return urlObject.href;
};


export const getPageURL = (url: string, cursor: string): string => {
	const urlObject = new URL(url);

	urlObject.searchParams.set('cursor', cursor);

	return urlObject.href;
};


export const getPageCursor = (url: string): string | null => {
	return new URL(url).searchParams.get('cursor');
};
