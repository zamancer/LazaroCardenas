const {app, expect} = require('../common');
const Artist = app.models.Artist;
const Credential = app.models.Credential;

describe('Artist model', function() {
  it('find should resolve', function() {
    return Artist
            .find()
            .then(res => expect(res).to.be.an('array'));
  });

  it('should create an Artist', function() {
    const testArtist = {
      phone: '5534989460',
      photo: 'https://url.com',
      categories: [{label: 'Tag', value: '#BestArtist2017'}],
    };

    return Artist.create(testArtist)
            .then(res => {
              expect(res.phone).to.equal(testArtist.phone);
              expect(res.photo).to.equal(testArtist.photo);
              expect(res.categories).to.deep.equal(testArtist.categories);
            });
  });

  it('should retrieve an Artist by id', function() {
    return Artist.findOne({where: {id: 1}})
            .then(res => {
              expect(res).to.be.an('object');
            });
  });

  it('should retrieve Artist detail', function() {
    const artist = new Artist({
      phone: '3333333333',
      photo: 'https://url2.com',
      categories: [{label: 'MyTag', value: '#BestArtist2017'}],
    });

    const credentials = {
      name: 'Nombre',
      lastName: 'Apellido',
      email: 'mail@mail.com',
      password: 'p4ssw0rd',
      ownerType: 'Artist',
    };

    return Promise.resolve()
      .then(() => Artist.create(artist))
      .then(art => {
        var assignedCredentials = Object.assign({},
                                    credentials,
                                    {ownerId: art.id});
        Credential.create(assignedCredentials);
      })
      .then(() => Artist.findOne({where: {phone: '3333333333'}}))
      .then(res => res.getArtistDetail(function(err, details) {
        expect(details).to.be.an('object');
        expect(details).to.have.property('detail');
        expect(details).to.have.property('categories');
        expect(details.categories).to.have.lengthOf(1);
        expect(details.detail).to.deep.equal({
          photo: {
            filter: 'default',
            value: 'https://url2.com',
          },
          email: {
            filter: 'not_empty',
            value: 'mail@mail.com',
          },
          name: {
            filter: 'not_empty',
            value: 'Nombre',
          },
          lastName: {
            filter: 'default',
            value: 'Apellido',
          },
          phone: {
            filter: 'default',
            value: '3333333333',
          },
        });
      }));
  });
});
// const {app, expect, request} = require('../common');
// describe('Artist request', function() {
//   it('should return 200 when ', function() {
//     return request.get('/api/Artists').expect(200);
//   });
// });
