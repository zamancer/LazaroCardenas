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
};
