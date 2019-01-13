import 'mocha';
import { expect, assert } from 'chai';
import validateTag from '../server/common/schema/tag.schema';


describe('Tag Schema', () => {
  it('validate a tag object', () => {
    const result = validateTag({
      "name": "eee"
    });
    //console.log(JSON.stringify(result));
    assert.isArray(result);
    assert.lengthOf(result, 1);
    assert.equal(result[0].value.name, "eee");
    assert.isNull(result[0].error);
  });

  it('validate fails on a tag object', () => {
    const result = validateTag({
      "XXXX": "eee"
    });
    console.log(JSON.stringify(result));
    assert.isArray(result);
    assert.lengthOf(result, 1);

    const v = result[0];

    assert.isNotNull(v.error);
    assert.lengthOf(v.error.details, 1);
    const detail = v.error.details[0];

    assert.deepEqual(detail, {
      "message": "\"name\" is required",
      "path": ["name"],
      "type": "any.required",
      "context": {
        "key": "name",
        "label": "name"
      }
    });

  });

});
