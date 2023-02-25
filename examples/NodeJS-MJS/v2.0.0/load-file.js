import { promises as fs } from 'fs';
import exists from 'fs.promises.exists';

export default function loadFile(fileName, required) {
    if (exists(fileName)) {
        try {
            return fs.readFile(fileName, {
                encoding: 'utf-8'
            });
        }
        catch (err) {
            if (required) {
                throw new Error(`An error was caught trying to read file "${fileName}".`, { cause: err });
            }
        }
    }
    else if (required) {
        throw new Error(`File "${fileName} is required but could not be found.`);
    }
};
