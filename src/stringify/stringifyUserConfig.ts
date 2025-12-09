import { ScriptCatUserConfig } from '../types/UserConfig.ts';
import YAML from 'yamljs';

/**
 * 字符串化 UserConfig
 */
export const stringifyUserConfig = (
	userConfig?: ScriptCatUserConfig,
): string => {
	// 如果 userConfig 为空, 直接返回空字符串
	if ( userConfig == void 0 || Object.keys( userConfig ).length === 0 ) {
		return '';
	}
	
	// 读取 UserConfig.ts 字符串
	const userConfigContent = YAML.stringify( userConfig, 4, 4 ).trim();
	return [
		'/* ==UserConfig==',
		userConfigContent,
		'==/UserConfig== */',
	].join( '\n' );
};
