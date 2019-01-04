import cfg from 'config';


let confInstance:cfg.IConfig = null;

export const load = (path?:string):cfg.IConfig => {

    if( path ) {
        process.env["NODE_CONFIG_DIR"] = path;
    }
    delete require.cache[require.resolve('config')];
    confInstance = require('config');
    return confInstance;
};


export default function():cfg.IConfig {
    if( confInstance === null) {
        load();
    }
    return confInstance;
} 