import validate from './schema/conf.schema';
import {getValidationErrors} from './schema/validate';
import TMDError from './error';
import {TMD} from '../types';


let defaultSettings = {
    "param1" : "value1"
};

let instance:TMD.ConfigurationSettings = null;

const mergeSettings = (settings:any, def:TMD.ConfigurationSettings): TMD.ConfigurationSettings => {
    return {
        "param1" : settings.param1 || def.param1
    };
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

