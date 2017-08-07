const lodashCollection = require('lodash/collection');
const ArtPieceFilters = require('../constants/artpieceFilters');

// eslint-disable-next-line
module.exports = function (ArtPiece) {
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
          mergedFilters[p].value = currentArtPiece[p] || '';
          return mergedFilters;
        })
        .reduce((acc, current) => Object.assign({}, acc, current), {});

    const details = { id: currentArtPiece.id, detail, categories: currentArtPiece.categories };
    callback(null, details);
  };

  function buildMosaicFilterForCulturalHelper(culturalHelperId) {
    const Artist = ArtPiece.app.models.Artist;

    return Promise.resolve()
        .then(() => Artist.find({ where: { culturalHelperId } }))
        .then((artists) => {
          const flatArtistsIds = lodashCollection.flatMap(artists, a => [a.id]);
          return { artistId: { inq: flatArtistsIds } };
        });
  }

/**
 * Retrieves a list of ArtPieces related to a user
 * @param {object} credential The user credential
 * @param {object} filters Filter for the results
 * @param {Function(Error, array)} callback
 */
// eslint-disable-next-line
  ArtPiece.mosaic = function (credential, filters, callback) {
    return Promise.resolve()
        .then(() => {
          if (credential.ownerType === 'CulturalHelper') {
            return buildMosaicFilterForCulturalHelper(credential.ownerId);
          }

          return { artistId: credential.ownerId };
        })
        .then(credentialFilter => Object.assign({}, credentialFilter, filters))
        .then(whereFilter => ArtPiece.find({ where: whereFilter }))
        .then((results) => { callback(null, results); });
  };

  /**
   * Eliminates desired ArtPiece instances
   * @param {array} ids The id arrays to eliminate
   * @param {Function(Error)} callback
   */
  // eslint-disable-next-line
  ArtPiece.eliminate = function(ids, callback) {
    return Promise.resolve()
        .then(() => ArtPiece.destroyAll({ id: { inq: ids } }))
        .then(() => callback(null));
  };
};
