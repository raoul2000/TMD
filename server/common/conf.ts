import validate from './schema/conf.schema';
import {getValidationErrors} from './schema/validate';
import TMDError from './error';
import {TMD} from '../types';
import l from './logger';

let defaultSettings = {
    "port" : 0,
    "param1" : "value1"
};


let instance:TMD.ConfigurationSettings = null;

const mergeSettings = (settings:any, def:TMD.ConfigurationSettings): TMD.ConfigurationSettings => {
    return Object.assign(defaultSettings,settings);
}

const initConf =  (settings?:object ):TMD.ConfigurationSettings => {
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
        throw new TMDError("invalid configuration object", validationErrors);
    }

    instance = Object.freeze(instance) as TMD.ConfigurationSettings ;
    l.debug('configuration',instance);
    return instance;
};

const readConf = ():TMD.ConfigurationSettings=> {
    if(!instance) {
        return initConf();
    }
    return instance;
};

export default {
    "init" :  initConf,
    "read" : readConf
};

