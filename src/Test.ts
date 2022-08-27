import type { IDefaultEnvConfig, IDefaultEnvironment } from "wj-config";
import wjConfig, { Environment } from "./index.js";

const env: IDefaultEnvironment = new Environment('Development') as IDefaultEnvironment;
const config: IDefaultEnvConfig = await wjConfig().includeEnvironment(env).build() as IDefaultEnvConfig;
console.log(config['abc']);
console.log(config.appSettings?.abc?.da);
const ttt = config.environment.isDevelopment();
if (ttt) {
    console.log(config.environment.value);
}
