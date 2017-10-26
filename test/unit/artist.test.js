const { app, expect } = require('../common');

const Artist = app.models.Artist;
const Credential = app.models.Credential;
const ArtPiece = app.models.ArtPiece;

describe('Artist model', () => {
  it('find should resolve', () => Artist
      .find()
      .then(res => expect(res).to.be.an('array')));

  it('should create an Artist', () => {
    const testArtist = {
      phone: '5534989460',
      photo: 'https://url.com',
      categories: [
        {
          label: 'Tag',
          value: '#BestArtist2017',
        },
      ],
    };

    return Artist
      .create(testArtist)
      .then((res) => {
        expect(res.phone)
          .to
          .equal(testArtist.phone);
        expect(res.photo)
          .to
          .equal(testArtist.photo);
        expect(res.categories)
          .to
          .deep
          .equal(testArtist.categories);
      });
  });

  it('should retrieve an Artist by id', () => Artist
      .findOne({
        where: {
          id: 1,
        },
      })
      .then((res) => {
        expect(res)
          .to
          .be
          .an('object');
      }));

  it('should retrieve multiple detailsFor Artists', () => {
    const artist1 = new Artist({
      name: 'Javier',
      lastName: 'Matallanas',
      email: 'javier_art@mail.com',
      phone: 'DETAILSFORPHONE',
      photo: 'https://whateverpic.jpg'
    });

    const credentials1 = {
      name: 'Javier',
      lastName: 'Matallanas',
      email: 'javier_art@mail.com',
      password: 'p4ssw0rd',
      ownerType: 'Artist',
    };

    const artist2 = new Artist({
      name: 'Florencia',
      lastName: 'Gallardo',
      email: 'flor_art@mail.com',
      phone: 'DETAILSFORPHONE',
      photo: 'https://florme.jpg'
    });

    const credentials2 = {
      name: 'Florencia',
      lastName: 'Gallardo',
      email: 'flor_art@mail.com',
      password: 'p4ssw0rd',
      ownerType: 'Artist',
    };

    let persistedArtistsIds = [];

    return Promise.resolve()
          .then(() => Artist.create(artist1))
          .then((art) => {
            persistedArtistsIds.push(art.id);
            const assignedCredentials = Object.assign({}, credentials1, { ownerId: art.id });
            Credential.create(assignedCredentials);
          })
          .then(() => Artist.create(artist2))
          .then((art) => {
            persistedArtistsIds.push(art.id);              
            const assignedCredentials = Object.assign({}, credentials2, { ownerId: art.id });
            Credential.create(assignedCredentials);
          })
          .then(() => {
            Artist.detailFor(persistedArtistsIds, (err, details) => {
              expect(details).to.be.an('array');
              expect(details).to.have.lengthOf(2);
            })
          });

  });

  it('should retrieve Artist detail', () => {
    const artist = new Artist({
      name: 'Nombre',
      lastName: 'Apellido',
      email: 'mail@mail.com',
      phone: '3333333333',
      photo: 'https://url2.com',
      categories: [
        {
          label: 'MyTag',
          value: '#BestArtist2017',
        },
      ],
    });

    const credentials = {
      name: 'Nombre',
      lastName: 'Apellido',
      email: 'mail@mail.com',
      password: 'p4ssw0rd',
      ownerType: 'Artist',
    };

    return Promise
      .resolve()
      .then(() => Artist.create(artist))
      .then((art) => {
        const assignedCredentials = Object.assign({}, credentials, { ownerId: art.id });
        Credential.create(assignedCredentials);
      })
      .then(() => Artist.findOne({
        where: {
          phone: '3333333333',
        },
      }))
      .then(res => res.getArtistDetail((err, details) => {
        expect(details)
          .to
          .be
          .an('object');
        expect(details)
          .to
          .have
          .property('detail');
        expect(details)
          .to
          .have
          .property('categories');
        expect(details)
          .to
          .have
          .property('id');
        expect(details.id)
          .to
          .be.above(0);
        expect(details.categories)
          .to
          .have
          .lengthOf(1);
        expect(details.detail)
          .to
          .deep
          .equal({
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
            culturalHelperId: {
              filter: 'not_empty',
              value: ''
            }
          });
      }));
  });

  it('should valide email uniqueness', () => {
    const testArtist1 = {
      email: 'testArtist1@mymail.com',
      name: 'Test Artist 1',
      phone: '5534989460',
      photo: 'https://url.com'
    };

    const testArtist2 = {
      email: 'testArtist1@mymail.com',
      name: 'Test Artist 2',
      phone: '5534984565',
      photo: 'https://url.com'
    };

    return Artist.create(testArtist1)
            .then(() => Artist.create(testArtist2))
            .catch((err) => {
              expect(err.statusCode).to.be.equal(422);
              expect(err.message).to.contain('El correo ingresado ya existe');
            });
  });

  it('should valide email uniqueness against Credentials', () => {
    const testCredential = {
      email: 'testArtistUniqueness3@mail.com',
      password: '123456',
      name: 'Chuchito'
    };

    const testArtistWithRepatedEmail = {
      email: 'testArtistUniqueness3@mail.com',
      name: 'Test Artist 1',
      phone: '5534989460',
      photo: 'https://url.com'
    };

    return Credential.create(testCredential)
            .then(() => Artist.create(testArtistWithRepatedEmail))
            .catch((err) => {
              expect(err.statusCode).to.be.equal(422);
              expect(err.message).to.contain('Ya existe un usuario con este correo');
            });
  });

  it('should eliminate multiple', () => {
    const testArtist = {
      name: 'Alan',
      lastName: 'Zami',
      phone: '5534989460',
      photo: 'https://url.com'
    };

    const testArtist2 = {
      name: 'Nala',
      lastName: 'TheZam',
      phone: '5534989460',
      photo: 'https://url.com'
    };

    const artistsToDelete = [];

    return Artist.create(testArtist)
            .then((createdArtist) => {
              artistsToDelete.push(createdArtist.id);
              return Artist.create(testArtist2);
            })
            .then((createdArtist) => {
              artistsToDelete.push(createdArtist.id);
              return Artist.count({ id: { inq: artistsToDelete } });
            })
            .then(res => expect(res).to.equal(2))
            .then(() => Artist.eliminate(artistsToDelete, () => {}))
            .then(() => Artist.count({ id: { inq: artistsToDelete } }))
            .then(res => expect(res).to.equal(0));
  });

  it('should eliminate related ArtPieces', () => {
    const testArtist = {
      name: 'Whatever1',
      lastName: 'WhateverlastName',
      email: 'what1ev3r@mail.com'
    };

    const testArtPiece1 = {
      author: 'JF Kennedy Maestre',
      title: 'The Greating 3',
      technique: 'Hand'
    };

    const testArtPiece2 = {
      author: 'JF Kennedy Maestre',
      title: 'The Greating 3',
      technique: 'Hand'
    };

    const testArtPiece3 = {
      author: 'JF Kennedy Maestre',
      title: 'The Greating 3',
      technique: 'Hand'
    };

    let artistIdToDelete = 0;
    const artPiecesToDelete = [];

    return Artist.create(testArtist)
            .then((createdArtist) => {
              artistIdToDelete = createdArtist.id;
              testArtPiece1.artistId = artistIdToDelete;
              return ArtPiece.create(testArtPiece1);
            })
            .then((createdArtPiece) => {
              artPiecesToDelete.push(createdArtPiece.id);
              testArtPiece2.artistId = artistIdToDelete;
              return ArtPiece.create(testArtPiece2);
            })
            .then((createdArtPiece) => {
              artPiecesToDelete.push(createdArtPiece.id);
              testArtPiece3.artistId = artistIdToDelete;
              return ArtPiece.create(testArtPiece3);
            })
            .then((createdArtPiece) => {
              artPiecesToDelete.push(createdArtPiece.id);
              return ArtPiece.count({ id: { inq: artPiecesToDelete } });
            })
            .then(res => expect(res).to.equal(3))
            .then(() => Artist.eliminate([artistIdToDelete], () => {}))
            .then(() => ArtPiece.count({ id: { inq: artPiecesToDelete } }))
            .then(res => expect(res).to.equal(0));
  });
});
