const { app, expect } = require('../common');

const Artist = app.models.Artist;
const Credential = app.models.Credential;

describe('Operation hooks', () => {
  it('should update Credential values when Artist gets updated', () => {
    const userTest = {
      email: 'operationhookemail1@mail.com',
      name: 'Name',
      lastName: 'LastName',
      password: '12345',
      ownerType: 'Artist' };

    return Promise.resolve()
      .then(() => Credential.register(userTest, (err, cred) => {
        expect(cred.name).to.equal('Name');
        expect(cred.lastName).to.equal('LastName');
        return Artist.findOne({ where: { email: cred.email } });
      }))
      .then(selectedArtist => selectedArtist.updateAttributes({ name: 'David', lastName: 'Zamudio' }))
      .then((updatedArtist) => {
        expect(updatedArtist.name).to.equal('David');
        expect(updatedArtist.lastName).to.equal('Zamudio');
      })
      .then(() => Credential.findOne({ where: { email: userTest.email } }))
      .then((selectedCredential) => {
        expect(selectedCredential.name).to.equal('David');
        expect(selectedCredential.lastName).to.equal('Zamudio');
      });
  });

  it('should update Artist values when Credential gets updated', () => {
    const userTest = {
      email: 'operationhookemail2@mail.com',
      name: 'Name2',
      lastName: 'LastName2',
      password: '12345',
      ownerType: 'Artist' };

    return Promise.resolve()
      .then(() => Credential.register(userTest, (err, cred) => {
        expect(cred.name).to.equal('Name2');
        expect(cred.lastName).to.equal('LastName2');
        return cred.updateAttributes({ name: 'Mariana', lastName: 'Zavala' });
      }))
      .then((updatedCredentials) => {
        expect(updatedCredentials.name).to.equal('Mariana');
        expect(updatedCredentials.lastName).to.equal('Zavala');
        return Artist.findOne({ where: { email: updatedCredentials.email } });
      })
      .then((updatedArtist) => {
        expect(updatedArtist.name).to.equal('Mariana');
        expect(updatedArtist.lastName).to.equal('Zavala');
      });
  });
});
