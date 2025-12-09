import { ScriptCatUserScript } from './UserScript.ts';
import { ScriptCatUserConfig } from './UserConfig.ts';

export interface MetaBannerPluginOptions {
	userScript: ScriptCatUserScript;
	userConfig?: ScriptCatUserConfig;
	useBackgroundPromiseBlock?: boolean;
}
