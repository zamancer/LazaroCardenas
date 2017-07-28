const { app, expect } = require('../common');

const ArtPiece = app.models.ArtPiece;
const Artist = app.models.Artist;
const Credential = app.models.Credential;
const CulturalHelper = app.models.CulturalHelper;

describe('/Mosaic', () => {
  it('should retrieve results for Artist', () => {
    const testArtist = {
      email: 'testMosaicResults1@gmail.com',
      phone: '55555',
      photo: 'https://url2.com',
      categories: [{ label: 'MyTag', value: '#BestArtist2017' }],
    };

    const artistCredentials = {
      name: 'Nombre',
      lastName: 'Apellido',
      email: 'mail123@mail.com',
      password: 'p4ssw0rd',
    };

    const artPieceRelated = {
      author: 'Ultra',
      title: 'The Greatest Painting',
      technique: 'Hand',
      materials: 'Diamond',
      measurements: '120x120',
      year: 2015,
      description: 'Behold!',
      source: 'https://secreturl.com/image.png',
      categories: [],
    };

    return Promise.resolve()
      .then(() => Artist.create(testArtist))
      .then((createdArtist) => {
        artPieceRelated.artistId = createdArtist.id;
        return ArtPiece.create(artPieceRelated);
      })
      .then((createdArtPiece) => {
        const mergedCredentials = Object.assign({},
                                    artistCredentials,
                                    { ownerId: createdArtPiece.artistId, ownerType: 'Artist' });

        return Credential.create(mergedCredentials);
      })
      .then(createdCredentials => ArtPiece
          .mosaic(createdCredentials, {}, (err, res) => {
            expect(res).to.be.an('array');
            expect(res).to.have.lengthOf(1);
          }));
  });

  it('should retrieve results for Artist with filters', () => {
    const testArtist = {
      email: 'testMosaicResults2@gmail.com',
      phone: '7777777',
      photo: 'https://url2.com',
      categories: [{ label: 'MyTag', value: '#BestArtist2017' }],
    };

    const artistCredentials = {
      name: 'Nuevo',
      lastName: 'LastName',
      email: 'mail456@mail.com',
      password: 'p4ssw0rd',
    };

    const artPieceRelated = {
      author: 'Ultra',
      technique: 'Hand',
      materials: 'Diamond',
      measurements: '120x120',
      year: 2015,
      description: 'Behold!',
      source: 'https://secreturl.com/image.png',
      categories: [],
    };

    let variableArtPiece = {};

    return Promise.resolve()
      .then(() => Artist.create(testArtist))
      .then((createdArtist) => {
        variableArtPiece = { title: 'The Happening', artistId: createdArtist.id };
        const artPieceToSave1 = Object.assign({}, artPieceRelated, variableArtPiece);
        return ArtPiece.create(artPieceToSave1);
      })
      .then(() => {
        variableArtPiece = { title: 'The Quaresma 1' };
        const artPieceToSave2 = Object.assign({}, artPieceRelated, variableArtPiece);
        return ArtPiece.create(artPieceToSave2);
      })
      .then(() => {
        variableArtPiece = { title: 'The Quaresma 2' };
        const artPieceToSave3 = Object.assign({}, artPieceRelated, variableArtPiece);
        return ArtPiece.create(artPieceToSave3);
      })
      .then(() => {
        variableArtPiece = { title: 'The Quaresma 3' };
        const artPieceToSave3 = Object.assign({}, artPieceRelated, variableArtPiece);
        return ArtPiece.create(artPieceToSave3);
      })
      .then((createdArtPiece) => {
        const mergedCredentials = Object.assign({},
                                    artistCredentials,
                                    { ownerId: createdArtPiece.artistId, ownerType: 'Artist' });

        return Credential.create(mergedCredentials);
      })
      .then(createdCredentials => ArtPiece
          .mosaic(createdCredentials, { title: { ilike: 'quaresma' } }, (err, res) => {
            expect(res).to.be.an('array');
            expect(res).to.have.lengthOf(3);
          }));
  });
  it('should retrieve results for CulturalHelper', () => {
    const testArtist = {
      email: 'testMosaicArtistWCH4@gmail.com',
      phone: '44444444',
      photo: 'https://url2.com'
    };

    let savedArtist = {};

    return Promise.resolve()
      .then(() => Artist.create(testArtist))
      .then((createdArtist) => {
        savedArtist = createdArtist;
        return ArtPiece.create({ title: 'The Manipulation', source: 'https://image1.png', artistId: createdArtist.id });
      })
      .then(createdArtPiece => ArtPiece.create({ title: 'The Decision', source: 'https://image2.png', artistId: createdArtPiece.artistId }))
      .then((createdArtPiece) => {
        const newCulturalHelper = { nickname: 'AZam', toRelateWith: createdArtPiece.artistId };
        return CulturalHelper.create(newCulturalHelper);
      })
      .then(createdCulturalHelper => savedArtist.updateAttribute('culturalHelperId', createdCulturalHelper.id))
      .then((updatedArtist) => {
        const culturalHelperCredentials = {
          email: 'culturalHelperEmail1@gmail.com',
          password: '1234567',
          ownerId: updatedArtist.culturalHelperId,
          ownerType: 'CulturalHelper' };

        return Credential.create(culturalHelperCredentials);
      })
      .then(createdCredentials => ArtPiece
          .mosaic(createdCredentials, {}, (err, res) => {
            expect(res).to.be.an('array');
            expect(res).to.have.lengthOf(2);
          }));
  });
});
