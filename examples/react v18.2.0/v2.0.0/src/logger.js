import { LoggerConfiguration, ConsoleSink } from 'structured-log';
import config from './config';

const logger = new LoggerConfiguration()
    .minLevel(config.logging.minLevel)
    .writeTo(new ConsoleSink())
    .create();

export default logger;
