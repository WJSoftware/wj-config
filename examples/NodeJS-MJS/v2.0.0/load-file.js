import fs from 'fs';

export default (fileName, isRequired) => {
    const fileExists = fs.existsSync(fileName);
    if (fileExists) {
        return fs.readFileSync(fileName);
    }
    else if (isRequired) {
        throw new Error(`File ${fileName} is required but was not found.`);
    }
    // Return null.
    return null;
};
