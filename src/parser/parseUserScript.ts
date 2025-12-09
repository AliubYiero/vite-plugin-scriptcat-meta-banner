import { ScriptCatUserScript } from '../types/UserScript.ts';

export interface ParseUserScript {
	/**
	 * 过滤空属性后的 UserScript
	 */
	filter: ScriptCatUserScript;
	/**
	 * 原始 UserScript
	 */
	original: ScriptCatUserScript;
	/**
	 * UserScript 所有 key 中的最大长度
	 */
	maxKeyLength: number;
}

/**
 * 将 Entry 数组形式的 UserScript 转换成对象, 过滤掉空属性
 */
export const parseUserScript = (
	userScript: ScriptCatUserScript,
): ParseUserScript => {
	// 获取所有 key 中的最大长度
	const maxKeyLength: number = Math.max( ...userScript.map( ( [ key ] ) => key.length ) );
	
	// 记录只需要 key 值的属性
	const singleDescriptionSet: Set<string> = new Set( [ 'background', 'early-start', 'noframes' ] );
	// 过滤掉空属性
	const filterUserScript = userScript.filter( ( [ key, value ] ) =>
		singleDescriptionSet.has( key ) || value,
	);
	
	return {
		filter: filterUserScript,
		original: userScript,
		maxKeyLength: maxKeyLength,
	};
};
