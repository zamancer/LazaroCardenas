module.exports = function(ArtPiece) {
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
  ArtPiece.prototype.getArtPieceDetail = function(callback) {
    let currentArtPiece = this;

    let detail = Object.keys(ArtPieceFilters)
        .map(p => {
          let mergedFilters = {};
          mergedFilters[p] = ArtPieceFilters[p];
          mergedFilters[p].value = currentArtPiece[p];
          return mergedFilters;
        })
        .reduce(function(acc, current) {
          return Object.assign({}, acc, current);
        }, {});

    var details = {detail: detail, categories: currentArtPiece.categories};
    callback(null, details);
  };

/**
 * Retrieves a list of ArtPieces related to a user
 * @param {object} credential The user credential
 * @param {object} filters Filter for the results
 * @param {Function(Error, array)} callback
 */
  ArtPiece.mosaic = function(credential, filters, callback) {
    // var artPieces = [];
    // const ArtistModel = ArtPiece.app.models.Artist;
    return Promise.resolve()
      .then(() => ArtPiece.find({where: {artistId: credential.ownerId}}))
      .then(results => { callback(null, results); });
  };
};
