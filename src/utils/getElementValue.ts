import { GetterParams } from './getObjectValue';


export type CallbackParams = Omit<GetterParams, 'object'> & {
	selector: string,
}


export const getWrappedElementValue = (
	wrapper: Element, 
	getter: (params: GetterParams) => string,
): (params: CallbackParams) => string => {
	return ({ selector, ...params }: CallbackParams): string => {
		const element = wrapper.querySelector(selector);
		return getter({
			object: element,
			...params,
		});
	};
};
