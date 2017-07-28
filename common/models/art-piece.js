const transformToImages = require('./cloudinaryImageTransform');

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
    const whereFilter = Object.assign({}, { artistId: credential.ownerId }, customFilter);
    return Promise.resolve()
      .then(() => ArtPiece.find({ where: whereFilter }))
      .then((results) => { callback(null, results); });
  };

  ArtPiece.observe('persist', (ctx, next) => {
    if (ctx.currentInstance && ctx.currentInstance.source) {
      ctx.currentInstance.images = transformToImages(ctx.currentInstance.source);
    }
    return next();
  });
};
