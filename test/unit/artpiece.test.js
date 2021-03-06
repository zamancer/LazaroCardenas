const { app, expect } = require('../common');

const ArtPiece = app.models.ArtPiece;

describe('ArtPiece model', () => {
  it('should resolve find', () =>
    ArtPiece.find()
    .then(res => expect(res).to.be.an('array'))
  );

  it('should convert property called source to images', () => {
    const artPieceWithSource = {
      author: 'JF Kennedy',
      title: 'The Greatest Painting',
      technique: 'Hand',
      materials: 'Diamond',
      measurements: '120x120',
      year: '2017',
      description: 'Behold!',
      source: 'https://secreturl.com/image.png'
    };

    return ArtPiece.create(artPieceWithSource)
      .then((persisted) => {
        expect(persisted).to.have.property('images');
      });
  });

  it('should create an ArtPiece', () => {
    const testArtPiece = {
      author: 'JF Kennedy',
      title: 'The Greatest Painting',
      technique: 'Hand',
      materials: 'Diamond',
      measurements: '120x120',
      year: '2017',
      description: 'Behold!',
      source: 'http://res.cloudinary.com/zamancer/image/upload/v1501170397/IMG_8896_gvbpbe.jpg',
      images: {
        thumbnail: 'http://res.cloudinary.com/zamancer/image/upload/c_fill,g_west,h_150,w_150/v1501170397/IMG_8896_gvbpbe.jpg',
        standard: 'http://res.cloudinary.com/zamancer/image/upload/v1501170397/IMG_8896_gvbpbe.jpg'
      },
      categories: [
        {
          label: 'Tag1',
          value: 'OMG',
        },
      ],
    };

    const expectedImages = {
      thumbnail: 'http://res.cloudinary.com/zamancer/image/upload/c_fill,g_west,h_150,w_150/v1501170397/IMG_8896_gvbpbe.jpg',
      standard: 'http://res.cloudinary.com/zamancer/image/upload/v1501170397/IMG_8896_gvbpbe.jpg'
    };

    return ArtPiece.create(testArtPiece)
        .then((res) => {
          expect(res.author).to.equal(testArtPiece.author);
          expect(res.title).to.equal(testArtPiece.title);
          expect(res.technique).to.equal(testArtPiece.technique);
          expect(res.materials).to.equal(testArtPiece.materials);
          expect(res.measurements).to.equal(testArtPiece.measurements);
          expect(res.year).to.equal(testArtPiece.year);
          expect(res.description).to.equal(testArtPiece.description);
          expect(res.source).to.equal(testArtPiece.source);
          expect(res.categories).to.deep.equal(testArtPiece.categories);
          expect(res.images).to.deep.equal(expectedImages);
        });
  });

  it('should retrieve an ArtPiece by id', () => {
    const testArtPiece1 = {
      author: 'JFAC Kennedy',
      title: 'The Greatest Painting',
      description: 'Behold!',
      source: 'https://superhosting.com/image.jpg'
    };

    return ArtPiece.create(testArtPiece1)
        .then(res => ArtPiece.findOne({ where: { id: res.id } }))
        .then((res) => { expect(res).to.be.an('object'); });
  });

  it('should retrieve detailFor a number of ArtPieces', () => {
    const artPiece1 = new ArtPiece({
      author: 'JF Kennedy Maestre',
      title: 'The Greatest Painting',
      technique: 'Hand',
      materials: 'Diamond',
      measurements: '120x120',
      year: '2017',
      description: 'Behold!',
      source: 'https://secreturl.com/image.png',
    });

    const artPiece2 = new ArtPiece({
      author: 'Something',
      title: 'Something',
      technique: 'Hand',
      materials: 'Diamond',
      measurements: '120x120',
      year: '2017',
      description: 'Behold!',
      source: 'https://secreturl.com/image2.png',
    });

    let persistedArtPieces = [];

    return Promise.resolve()
        .then(() => ArtPiece.create(artPiece1))
        .then(artPiece => persistedArtPieces.push(artPiece.id))
        .then(() => ArtPiece.create(artPiece2))
        .then(artPiece => persistedArtPieces.push(artPiece.id))
        .then(() => {
          ArtPiece.detailFor(persistedArtPieces, (err, detailsFor) => {
            expect(detailsFor).to.be.an('array');
            expect(detailsFor).to.have.lengthOf(2);
          })
        });
  });

  it('should retrieve an ArtPiece detail', () => {
    const artPiece = new ArtPiece({
      id: 1,
      title: 'The Greatest Painting',
      author: 'JF Kennedy Maestre',
      measurements: '120x120',
      technique: 'Hand',
      series: 'Serie 1',
      tiraje: 'Tiraje?',
      year: '2017',
      price: '20,000.00MXN',
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

    return artPiece.getArtPieceDetail((err, details) => {
      expect(details).to.be.an('object');
      expect(details).to.have.property('detail');
      expect(details).to.have.property('categories');
      expect(details).to.have.property('id');
      expect(details.id).to.be.above(0);
      expect(details.categories).to.have.lengthOf(2);
      expect(details.detail).to.deep.equal({
        title: {
          filter: 'not_empty',
          value: artPiece.title,
        },
        author: {
          filter: 'not_empty',
          value: artPiece.author,
        },
        measurements: {
          filter: 'default',
          value: artPiece.measurements,
        },
        technique: {
          filter: 'default',
          value: artPiece.technique,
        },
        series: {
          filter: 'default',
          value: artPiece.series
        },
        tiraje: {
          filter: 'default',
          value: artPiece.tiraje
        },
        year: {
          filter: 'default',
          value: artPiece.year,
        },
        price: {
          filter: 'default',
          value: artPiece.price
        },
        source: {
          filter: 'not_empty',
          value: artPiece.source,
        },
        images: {
          filter: 'not_empty',
          value: {}
        },
        artistId: {
          filter: 'not_empty',
          value: ''
        }        
      });
    });
  });

  it('should eliminate multiple', () => {
    const artPiece1 = {
      author: 'JF Kennedy Maestre',
      title: 'The Greating 1',
      technique: 'Hand',
      materials: 'Diamond',
      measurements: '120x120'
    };

    const artPiece2 = {
      author: 'JF Kennedy Maestre',
      title: 'The Greating 2',
      technique: 'Hand',
      materials: 'Diamond',
      measurements: '120x120'
    };

    const artPiece3 = {
      author: 'JF Kennedy Maestre',
      title: 'The Greating 3',
      technique: 'Hand',
      materials: 'Diamond',
      measurements: '120x120'
    };

    const artPiecesToDelete = [];

    return Promise.resolve()
        .then(() => ArtPiece.create(artPiece1))
        .then((createdArtPiece) => {
          artPiecesToDelete.push(createdArtPiece.id);
          return ArtPiece.create(artPiece2);
        })
        .then((createdArtPiece) => {
          artPiecesToDelete.push(createdArtPiece.id);
          return ArtPiece.create(artPiece3);
        })
        .then((createdArtPiece) => {
          artPiecesToDelete.push(createdArtPiece.id);
          return ArtPiece.count({ id: { inq: artPiecesToDelete } });
        })
        .then(res => expect(res).to.equal(3))
        .then(() => ArtPiece.eliminate(artPiecesToDelete, () => {}))
        .then(() => ArtPiece.count({ id: { inq: artPiecesToDelete } }))
        .then(res => expect(res).to.equal(0));
  });
});
