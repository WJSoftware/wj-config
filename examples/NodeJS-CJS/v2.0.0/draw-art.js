const configPromise = require('./config');
const loadFile = require('./load-file');
const loggerPromise = require('./logger');

function calculateWidth(artLines) {
    let width = 0;
    for (const line of artLines) {
        width = Math.max(width, line.length);
    }
    return width;
}

function selectArt(config) {
    const index = Math.floor(Math.random() * config.app.artChoices.length);
    return config.app.artChoices[index];
}

module.exports = async function () {
    const config = await configPromise;
    const logger = await loggerPromise;
    await logger.debug('Selecting art from these choices: {ArtChoices}', config.app.artChoices);
    const art = loadFile(`./art/${selectArt(config)}.txt`, true).toString();
    const artLines = art.split('\n');
    const artWidth = calculateWidth(artLines);
    const terminalWidth = process.stdout.columns;
    const leftPadding = ' '.repeat((terminalWidth - artWidth) / 2);
    for (const line of artLines) {
        console.info(`${leftPadding}${line}`);
    }
};
