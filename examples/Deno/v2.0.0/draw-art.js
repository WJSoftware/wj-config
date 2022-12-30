import config from './config.js';
import loadFile from './load-file.js';
import logger from './logger.js';

function calculateWidth(artLines) {
    let width = 0;
    for (const line of artLines) {
        width = Math.max(width, line.length);
    }
    return width;
}

function selectArt() {
    const index = Math.floor(Math.random() * config.app.artChoices.length);
    return config.app.artChoices[index];
}

export default async function () {
    await logger.debug('Selecting art from these choices: {ArtChoices}', config.app.artChoices);
    const art = (await loadFile(`./art/${selectArt()}.txt`, true)).toString();
    const artLines = art.split('\n');
    const artWidth = calculateWidth(artLines);
    const terminalWidth = Deno.stdout.columns;
    const leftPadding = ' '.repeat((terminalWidth - artWidth) / 2);
    for (const line of artLines) {
        console.info(`${leftPadding}${line}`);
    }
};
