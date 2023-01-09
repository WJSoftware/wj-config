import config from "../config";

const countryService = async (countryCodes: any[]) => {
    const codes = countryCodes.join(',');
    console.log('%s', codes);
    const response = await fetch((config as any).api.countries.search(() => codes));
    const countryData = await response.json();
    const result: any = {};
    countryData.forEach((cd: any) => {
        result[cd.cca2] = cd.name.common;
    });
    return result;
};

export default countryService;
