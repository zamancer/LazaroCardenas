const ArtPieceFilters = {
  author: {
    filter: 'not_empty',
  },
  title: {
    filter: 'not_empty',
  },
  technique: {
    filter: 'default',
  },
  materials: {
    filter: 'default',
  },
  measurements: {
    filter: 'default',
  },
  year: {
    filter: 'default',
  },
  source: {
    filter: 'not_empty',
  },
  description: {
    filter: 'default',
  },
};

module.exports = ArtPieceFilters;
