import config from "../config";

const countryService = async (countryCodes) => {
    const codes = countryCodes.join(',');
    console.log('%s', codes);
    const response = await fetch(config.api.countries.search(() => codes));
    const countryData = await response.json();
    const result = {};
    countryData.forEach(cd => {
        result[cd.cca2] = cd.name.common;
    });
    return result;
};

export default countryService;
