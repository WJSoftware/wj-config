import wjConfig, { Environment } from "./main.js";
import type { IDefaultEnvConfig, IDefaultEnvironment, IEnvConfig } from "./types.mjs";

const env: IDefaultEnvironment = new Environment('Development') as IDefaultEnvironment;
const config: IDefaultEnvConfig = await wjConfig().includeEnvironment(env).build() as IDefaultEnvConfig;
console.log(config['abc']);
console.log(config.appSettings?.abc?.da);
const ttt = config.environment.isDevelopment();
if (ttt) {
    console.log(config.environment.value);
}
