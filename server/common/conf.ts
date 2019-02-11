import validate from './schema/conf.schema';
import {getValidationErrors} from './schema/validate';
import TMDError from './error';
import {TMD} from '../types';
import l from './logger';

console.log(`loading ${__filename}`);

let defaultSettings = {
    "port" : 0,
    "param1" : "value1",
    "basePath" : process.env['CONTENT_ROOT_PATH'] || '/'
};


let instance:TMD.ConfigurationSettings = null;

const mergeSettings = (settings:any, def:TMD.ConfigurationSettings): TMD.ConfigurationSettings => {
    return Object.assign(defaultSettings,settings);
}

const initConf =  (settings?:object ):TMD.ConfigurationSettings => {
    console.log('xxxxxxx INIT conf');
    if(instance) {
        throw new TMDError("configuration already initialized");
    } 

    if( !settings) {
        instance = defaultSettings;
    } else {
        instance = mergeSettings(settings, defaultSettings);
    }

    const validationErrors = getValidationErrors(validate(instance));
    
    if( validationErrors.length !== 0) {
        l.error(JSON.stringify(validationErrors));
        throw new TMDError("invalid configuration object", validationErrors);
    }

    instance = Object.freeze(instance) as TMD.ConfigurationSettings ;
    l.debug('configuration',instance);
    return instance;
};

const readConf = ():TMD.ConfigurationSettings=> {
    console.log('xxxxxxx readConf');
    if(!instance) {
        return initConf();
    }
    return instance;
};

export default {
    "init" :  initConf,
    "read" : readConf
};

