import { capitalizeFirstLetter } from './capitalizeFirstLetter';


export type GetterParams = {
	object: unknown,
	field: string,
	removeParts?: string[],
};


export const getObjectValue = ({ object, field }: GetterParams): string => {
	return Object(object)[field]?.toString() || '';
};


export const getClearObjectValue = ({ object, field, removeParts = [] }: GetterParams): string => {
	let value = getObjectValue({ object, field });
	for (const removePart of removeParts) {
		value = value.replace(removePart, '');
	}
	return value.trim();
};


export const getPrettyObjectValue = ({ object, field, removeParts = [] }: GetterParams): string => {
	return capitalizeFirstLetter(getClearObjectValue({ object, field, removeParts }));
};
