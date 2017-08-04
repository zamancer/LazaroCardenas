const { app, expect } = require('../common');

const Credential = app.models.Credential;

describe('Credential model', () => {
  it('find should resolve', () => Credential.find().then(res => expect(res).to.be.an('array')));
});
