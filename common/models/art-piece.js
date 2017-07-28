const transformToImages = require('./cloudinaryImageTransform');
const _ = require('lodash/collection');

function getCustomFilter(filters) {
  if (filters) {
    return filters;
  }
  return {};
}

// eslint-disable-next-line
module.exports = function (ArtPiece) {
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
  /**
   * Retrieves the ArtPiece detail
   * @param {Function(Error, object)} callback
   */
  // eslint-disable-next-line
  ArtPiece.prototype.getArtPieceDetail = function (callback) {
    const currentArtPiece = this;

    const detail = Object.keys(ArtPieceFilters)
        .map((p) => {
          const mergedFilters = {};
          mergedFilters[p] = ArtPieceFilters[p];
          mergedFilters[p].value = currentArtPiece[p];
          return mergedFilters;
        })
        .reduce((acc, current) => Object.assign({}, acc, current), {});

    const details = { detail, categories: currentArtPiece.categories };
    callback(null, details);
  };

/**
 * Retrieves a list of ArtPieces related to a user
 * @param {object} credential The user credential
 * @param {object} filters Filter for the results
 * @param {Function(Error, array)} callback
 */
// eslint-disable-next-line
  ArtPiece.mosaic = function (credential, filters, callback) {
    const customFilter = getCustomFilter(filters);

    if (credential.ownerType === 'Artist') {
      return Promise.resolve()
        .then(() => Object.assign({}, { artistId: credential.ownerId }, customFilter))
        .then(whereFilter => ArtPiece.find({ where: whereFilter }))
        .then((results) => { callback(null, results); });
    }

    if (credential.ownerType === 'CulturalHelper') {
      const Artist = ArtPiece.app.models.Artist;

      return Promise.resolve()
        .then(() => Artist.find({ where: { culturalHelperId: credential.ownerId } }))
        .then((artists) => {
          const flatArtistsIds = _.flatMap(artists, a => [a.id]);
          return Object.assign({}, { artistId: { inq: flatArtistsIds } }, customFilter);
        })
        .then(whereFilter => ArtPiece.find({ where: whereFilter }))
        .then((results) => { callback(null, results); });
    }
  };

  ArtPiece.observe('persist', (ctx, next) => {
    if (ctx.currentInstance && ctx.isNewInstance) {
      ctx.currentInstance.images = transformToImages(ctx.currentInstance.source);
    }
    return next();
  });
};
