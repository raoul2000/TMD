import 'mocha';
import { assert } from 'chai';
import conf from '../../server/common/conf';



describe('conf', () => {


    it('should initialize the configuration', (done) => {
        const cfg = conf.init({
            "param1" : "value1",
        });
        assert.deepEqual(cfg, {
            "param1" : "value1",
        });
        done();
    });

    it('should fail to initialize the configuration more than once', (done) => {
        try {
            const cfg = conf.init({
                "param1" : "value1",
            });
            done("failed");
        } catch (error) {  
            done();
        }
    });

});
