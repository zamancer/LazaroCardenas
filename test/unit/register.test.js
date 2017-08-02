const { app, expect } = require('../common');

const Credential = app.models.Credential;
const Artist = app.models.Artist;
const CulturalHelper = app.models.CulturalHelper;

describe('/Register', () => {
  it('should also create an Artist', () => {
    const testCredential = {
      email: 'alan@mail.com',
      name: 'Alancillo',
      password: '12345',
      ownerType: 'Artist' };

    return Promise.resolve()
          .then(() => Credential.register(testCredential, (err, res) => {
            expect(res).to.be.an('object');
            // eslint-disable-next-line
            expect(res.ownerId).to.not.be.undefined;
            return res;
          }))
          .then(cred => Artist.findOne({ where: { id: cred.ownerId } }))
          .then(art => expect(art).to.be.an('object'));
  });

  it('should also create a Cultural Helper', () => {
    const testCredential = {
      email: 'culturalHelper1@mail.com',
      name: 'Otro Alan',
      lastName: 'Zambrano',
      password: '12345',
      ownerType: 'CulturalHelper'
    };

    return Promise.resolve()
          .then(() => Credential.register(testCredential, (err, res) => {
            expect(res).to.be.an('object');
            // eslint-disable-next-line
            expect(res.ownerId).to.not.be.undefined;
            return res;
          }))
          .then(cred => CulturalHelper.findOne({ where: { id: cred.ownerId } }))
          .then(art => expect(art).to.be.an('object'));
  });

  it('should prevent register from duplicating Artists', () => {
    const testCredential = {
      email: 'nonduplicatebyregister@mail.com',
      lastName: 'Zambrano',
      password: '12345',
      ownerType: 'Artist' };

    return Promise.resolve()
          .then(() => Artist.create({ email: 'nonduplicatebyregister@mail.com', name: 'Whatever1' }))
          .then(() => Credential.register(testCredential, (err, cred) => {
            expect(cred).to.be.an('object');
            // eslint-disable-next-line
            expect(cred.ownerId).to.not.be.undefined;
            return Artist.find({ where: { email: testCredential.email } });
          }))
          .then((results) => {
            expect(results).to.have.lengthOf(1);
          });
  });

  it('should prevent loaded Artists to be registered as CulturalHelper', () => {
    const testArtist = {
      name: 'Alan',
      lastName: 'Zambrano',
      phone: '5534989461',
      email: 'notRoleChange1@mail.com',
      photo: 'whatever.png'
    };

    const testCredential = {
      email: 'notRoleChange1@mail.com',
      lastName: 'Zambrano',
      password: '12345',
      ownerType: 'CulturalHelper'
    };

    return Promise.resolve()
          .then(() => Artist.create(testArtist))
          .then(() => Credential.register(testCredential, (err) => {
            expect(err.status).to.be.equal(422);
            expect(err.message).to.contain('El correo utilizado ya existe como un Artista.');
          }));
  });
});
