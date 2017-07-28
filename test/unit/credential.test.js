const { app, expect } = require('../common');

const Credential = app.models.Credential;
const Artist = app.models.Artist;

describe('Credential model', () => {
  it('find should resolve', () => Credential.find().then(res => expect(res).to.be.an('array')));

  it('register should create an Artist', () => {
    const testCredential = { email: 'alan@mail.com', name: 'Alancillo', password: '12345', ownerType: 'Artist' };
    return Promise
      .resolve()
      .then(() => Credential.register(testCredential))
      .then((cred) => {
        expect(cred).to.be.an('object');
        // eslint-disable-next-line
        expect(cred.ownerId).to.not.be.undefined;
        return Artist.findOne({ where: { id: cred.ownerId } });
      })
      .then(art => expect(art).to.be.an('object'));
  });

  it('should prevent register from duplicating Artists', () => {
    const testCredential = { email: 'nonduplicatebyregister@mail.com', lastName: 'Zambrano', password: '12345', ownerType: 'Artist' };
    return Promise.resolve()
          .then(() => Artist.create({ email: 'nonduplicatebyregister@mail.com', name: 'Whatever1' }))
          .then(() => Credential.register(testCredential))
          .then((cred) => {
            expect(cred).to.be.an('object');
            // eslint-disable-next-line
            expect(cred.ownerId).to.not.be.undefined;
            return Artist.find({ where: { email: testCredential.email } });
          })
          .then((results) => {
            expect(results).to.have.lengthOf(1);
          });
  });
});
