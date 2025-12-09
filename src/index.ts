import type { Plugin } from 'vite';
import { MetaBannerPluginOptions } from './types/MetaBannerPluginOptions.ts';
import { parseUserScript } from './parser/parseUserScript.ts';
import { stringifyUserScript } from './stringify/stringifyUserScript.ts';
import { stringifyUserConfig } from './stringify/stringifyUserConfig.ts';
import { ScriptCatUserConfig } from './types/UserConfig.ts';
import { ScriptCatUserScript } from './types/UserScript.ts';

/**
 * 2
 */
export function metaBannerPlugin( options: MetaBannerPluginOptions ): Plugin;
/**
 * 1
 */
export function metaBannerPlugin( userScript: ScriptCatUserScript ): Plugin;

export default function metaBannerPlugin( options: MetaBannerPluginOptions | ScriptCatUserScript ): Plugin {
	if ( Array.isArray( options ) ) {
		options = {
			userScript: options,
			userConfig: {},
			useBackgroundPromiseBlock: true,
		};
	}
	
	// 设置默认值, 后台脚本默认使用 Promise 块包裹
	options.useBackgroundPromiseBlock ??= true;
	
	// 解析 UserScript
	const parsedUserScript = parseUserScript( options.userScript );
	
	// 判断是否为后台脚本
	const isBackgroundScript = Boolean(
		options.userScript.find(
			( [ key ] ) => [ 'background', 'crontab' ].includes( key ) ),
	);
	
	
	return {
		name: 'vite-plugin-scriptcat-meta-banner',
		version: '1.0.0',
		
		// 暴露解析过的 UserScript 给其他插件
		api: {
			parsedUserScript,
		},
		
		generateBundle: {
			order: 'pre',
			handler: ( _, bundle ) => {
				for ( let fileName in bundle ) {
					const chunk = bundle[ fileName ];
					if ( chunk.type !== 'chunk' ) continue;
					
					// 在 chunk 中插入 banner
					// 在 banner 中插入 UserScript
					let bannerContent = stringifyUserScript( parsedUserScript );
					if ( options.userConfig && Object.keys( options.userConfig ).length !== 0 ) {
						// 在 banner 中插入 UserConfig
						bannerContent += '\n' + stringifyUserConfig( options.userConfig );
					}
					
					let outputCode = chunk.code.trim();
					// 后台脚本使用 Promise 包裹
					if ( isBackgroundScript && options.useBackgroundPromiseBlock ) {
						outputCode = `// noinspection JSAnnotator\nreturn new Promise(async (resolve) => {\n${ outputCode }\nresolve();\n});`;
					}
					chunk.code = bannerContent + '\n' + outputCode;
				}
			},
		},
	};
}

// 导出类型
export type {
	ScriptCatUserConfig,
	ScriptCatUserScript,
};
