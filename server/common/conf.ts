import validate from './schema/conf.schema';
import {getValidationErrors} from './schema/validate';
import TMDError from './error';

let defaultSettings = {
    "param1" : "value1"
};

let instance = null;

const initConf =  (settings) => {
    if(instance) {
        throw new TMDError("configuration already initialized");
    } 

    const validationErrors = getValidationErrors(validate(settings));
    
    if( validationErrors.length !== 0) {
        throw new TMDError("invalid configuration object", validationErrors);
    }

    instance = Object.freeze(settings);
    return instance;
};

const readConf = () => {
    if(!instance) {
        return initConf(defaultSettings);
    }
    return instance;
};

export default {
    "init" :  initConf,
    "read" : readConf
};

