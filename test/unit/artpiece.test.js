const {app, expect} = require('../common');

const ArtPiece = app.models.ArtPiece;

describe('ArtPiece model', function() {
  it('should resolve find', function() {
    return ArtPiece
            .find()
            .then(res => expect(res).to.be.an('array'));
  });

  it('should create an ArtPiece', function() {
    const testArtPiece = {
      author: 'JF Kennedy',
      title: 'The Greatest Painting',
      technique: 'Hand',
      materials: 'Diamond',
      measurements: '120x120',
      year: 2017,
      description: 'Behold!',
      source: 'https://secreturl.com/image.png',
      categories: [
        {
          label: 'Tag1',
          value: 'OMG',
        },
      ],
    };

    return ArtPiece.create(testArtPiece)
        .then(res => {
          expect(res.author).to.equal(testArtPiece.author);
          expect(res.title).to.equal(testArtPiece.title);
          expect(res.technique).to.equal(testArtPiece.technique);
          expect(res.materials).to.equal(testArtPiece.materials);
          expect(res.measurements).to.equal(testArtPiece.measurements);
          expect(res.year).to.equal(testArtPiece.year);
          expect(res.description).to.equal(testArtPiece.description);
          expect(res.source).to.equal(testArtPiece.source);
          expect(res.categories).to.deep.equal(testArtPiece.categories);
        });
  });

  it('should retrieve an ArtPiece by id', function() {
    return ArtPiece.findOne({where: {id: 1}})
            .then(res => {
              expect(res).to.be.an('object');
            });
  });

  it('should retrieve an ArtPiece detail', function() {
    const artPiece = new ArtPiece({
      author: 'JF Kennedy Maestre',
      title: 'The Greatest Painting',
      technique: 'Hand',
      materials: 'Diamond',
      measurements: '120x120',
      year: 2017,
      description: 'Behold!',
      source: 'https://secreturl.com/image.png',
      categories: [
        {
          label: 'Tag1',
          value: 'OMG',
        },
        {
          label: 'Tag2',
          value: 'WTF!',
        },
      ],
    });

    return artPiece.getArtPieceDetail(function(err, details) {
      expect(details).to.be.an('object');
      expect(details).to.have.property('detail');
      expect(details).to.have.property('categories');
      expect(details.categories).to.have.lengthOf(2);
      expect(details.detail).to.deep.equal({
        author: {
          filter: 'not_empty',
          value: artPiece.author,
        },
        title: {
          filter: 'not_empty',
          value: artPiece.title,
        },
        technique: {
          filter: 'default',
          value: artPiece.technique,
        },
        materials: {
          filter: 'default',
          value: artPiece.materials,
        },
        measurements: {
          filter: 'default',
          value: artPiece.measurements,
        },
        year: {
          filter: 'default',
          value: artPiece.year,
        },
        source: {
          filter: 'not_empty',
          value: artPiece.source,
        },
        description: {
          filter: 'default',
          value: artPiece.description,
        },
      });
    });
  });
});
