const { app, expect } = require('../common');

const Credential = app.models.Credential;
const Artist = app.models.Artist;

describe('Credential model', () => {
  it('find should resolve', () => Credential.find().then(res => expect(res).to.be.an('array')));

  it('register should create an Artist', () => {
    const testCredential = { email: 'alan@mail.com', password: '12345', ownerType: 'Artist' };
    return Promise
      .resolve()
      .then(() => Credential.register(testCredential))
      .then((cred) => {
        expect(cred).to.be.an('object');
        return Artist.findOne({ where: { id: cred.ownerId } });
      })
      .then(art => expect(art).to.be.an('object'));
  });
});
