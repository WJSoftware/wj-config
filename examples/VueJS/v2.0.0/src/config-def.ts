import type { IDataSourceInfo, IEnvironment, QueryString, RouteValuesFunction } from "wj-config";

export type UrlFunction = (replaceValues?: RouteValuesFunction | { [x: string | symbol]: any }, queryString?: QueryString) => string;

export interface Config {
  appSettings: AppSettings;
  logging: Logging;
  personApi: PersonApi;
  flagsApi: FlagsApi;
  api: Api;
  environment: IEnvironment,
  _trace: any,
  _qualifiedDs: IDataSourceInfo[]
}
export interface AppSettings {
  id: string;
  title: string;
  projectName: string;
  projectHome: string;
  inputDelay: number;
  dramaticPause: number;
  mockarooText: string;
  mockarooUrl: string;
}
export interface Logging {
  minLevel: string;
  outputPropertiesInConsole: boolean;
}
export interface PersonApi {
  defaultMinBday: string;
  initialPeopleCount: number;
  maxPeopleCount: number;
  peopleCountStep: number;
  pills: (number)[];
}
export interface FlagsApi {
  anonymousCrossOrigin: boolean;
  lowerCaseCodes: boolean;
  name: string;
  backLink: string;
}
export interface Api {
  options: Options;
  mockaroo: Mockaroo;
  flags: Flags;
  countries: Countries;
}
export interface Options {
  mockaroo: Mockaroo1;
}
export interface Mockaroo1 {
  key: string;
}
export interface Mockaroo {
  host: string;
  scheme: string;
  person: Person;
}
export interface Person {
  all: UrlFunction;
}
export interface Flags {
  host: string;
  scheme: string;
  flag: UrlFunction;
}
export interface Countries {
  host: string;
  scheme: string;
  search: UrlFunction;
}
