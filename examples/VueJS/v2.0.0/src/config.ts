import wjConfig, { Environment } from 'wj-config';
import mainConfig from './config.json';

const env = new Environment((window as any).env.APP_ENV);

const config = await wjConfig()
    .addObject(mainConfig)
    .name('Main')
    .createUrlFunctions("api")
    .build();

export default config;
