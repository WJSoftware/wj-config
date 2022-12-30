import { exists } from 'https://deno.land/std/fs/mod.ts';

export default async (fileName, isRequired) => {
    const fileExists = await exists(fileName);
    if (fileExists) {
        return await Deno.readTextFile(fileName);
    }
    else if (isRequired) {
        throw new Error(`File ${fileName} is required but was not found.`);
    }
    // Return null.
    return null;
};
