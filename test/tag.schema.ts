import 'mocha';
import { expect } from 'chai';
import validateTag from '../server/common/schema/tag.schema';
import { assert } from 'joi';

describe('Tag Schema', () => {
  it('validate a tag object', () => {
    const { error, value} = validateTag({
        "name" : "eee"
    });
    expect(error).to.be.null;
    expect(value).at.have.property('name').equals("eee");
    //console.log(error);
    //console.log(value);
  });

  it('validate fails on a tag object', () => {
    const { error, value} = validateTag({
        "XXX" : "eee"
    });
    expect(error).to.not.be.null;    
    expect(error).at.have.property('isJoi').equals(true);
    expect(error).at.have.property('name').equals('ValidationError');
    
    //console.log(error);
    //console.log(value);
  });

});
