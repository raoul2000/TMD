import {TMD} from '../../types';

const applyTo = (items:Array<any> | any, fn:(any)=> any) => Array.isArray(items) ? items.map(fn) : fn(items);

/**
 * 
 * @param record Rename property `_id` to `id`
 */
export const checkout = (record:any[] | any): any[] | any => applyTo(record, (r) => {
    if(r) {
        r.id = r._id;
        delete r._id;
    }
    return r;
});
/**
 * Rename the property `id` to `_id`
 * @param record 
 */
export const checkin = (record:any[] | any): any[]|any => applyTo(record, (r) => {
    if(r) {
        delete r._id;
        if( r.id) {
            r._id = r.id;
            delete r.id;
        }
    }
    return r;
});