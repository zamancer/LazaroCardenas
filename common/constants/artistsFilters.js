const ArtistFilters = {
  photo: {
    filter: 'default',
  },
  email: {
    filter: 'not_empty',
  },
  name: {
    filter: 'not_empty',
  },
  lastName: {
    filter: 'default',
  },
  phone: {
    filter: 'default',
  },
  culturalHelperId: {
    filter: 'not_empty'
  }
};

module.exports = ArtistFilters;
