const ArtPieceFilters = {
  title: {
    filter: 'not_empty',
  },
  author: {
    filter: 'not_empty',
  },
  measurements: {
    filter: 'default',
  },
  technique: {
    filter: 'default',
  },
  series: {
    filter: 'default',
  },
  tiraje: {
    filter: 'default',
  },
  year: {
    filter: 'default',
  },
  price: {
    filter: 'default',
  },
  source: {
    filter: 'not_empty',
  },
  images: {
    filter: 'not_empty',
  },
  artistId: {
    filter: 'not_empty'
  }
};

module.exports = ArtPieceFilters;
