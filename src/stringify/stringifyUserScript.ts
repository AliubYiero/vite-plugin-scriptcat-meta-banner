import { ParseUserScript } from '../parser/parseUserScript.ts';

/**
 * 字符串化 UserScript
 */
export const stringifyUserScript = (
	userScript: ParseUserScript,
) => {
	return [
		'// ==UserScript==',
		...userScript.filter.map( ( [ key, value = '', description = '' ] ) => {
			const formatKey = key.padEnd( userScript.maxKeyLength, ' ' );
			return `// @${ formatKey }    ${ value }    ${ description }`.trim();
		} ),
		'// ==/UserScript==',
	].join( '\n' );
};
