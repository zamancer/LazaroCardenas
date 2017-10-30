const ArtistFilters = require('../constants/artistsFilters');

// eslint-disable-next-line
module.exports = function (Artist) {
  /**
     * Retrieves the artist info with filters
     * @param {Function(Error, object)} callback
     */
  // eslint-disable-next-line
  Artist.prototype.getArtistDetail = function (callback) {
    const currentArtist = this;
    const CulturalHelper = Artist.app.models.CulturalHelper;

    return Promise.resolve()
          .then((details) => {
            if (currentArtist.culturalHelperId) {
              return CulturalHelper.findOne({ where: { id: currentArtist.culturalHelperId } })
            }

            return null;
          })
          .then((culturalHelper) => {
            const detail = Object.keys(ArtistFilters)
              .map((p) => {
                const mergedFilters = {};
                mergedFilters[p] = ArtistFilters[p];
                mergedFilters[p].value = currentArtist[p] || '';
                return mergedFilters;
              })
              .reduce((acc, current) => Object.assign({}, acc, current), {});

            const details = { id: currentArtist.id, detail, categories: currentArtist.categories, profilePics: currentArtist.profilePics };

            if (culturalHelper) {
              details.detail.culturalHelperName = culturalHelper.name;
            }
            return details;
          })
          .then(details => callback(null, details));
  };

  /**
   * Retrieves the Artist detail for a list of ids
   * @param {array} artistsIds The list of Artist ids
   * @param {Function(Error, Array)} callback
   */
  // eslint-disable-next-line
  Artist.detailFor = function(artistsIds, callback) {
    return Promise.resolve()
      .then(() => Artist.find({ where: { id: { inq: artistsIds } } }))
      .then((artists) => {
        const detailPromises = artists.map((a) => {
          return new Promise((resolve, reject) => {
            a.getArtistDetail((err, dt) => resolve(dt))
          })
        });

        return Promise.all(detailPromises).then(details => details);
      })
      .then(details => callback(null, details))
      .catch(err => callback(err, null));
  };

  /**
   * Eliminates a set of Artists
   * @param {object} ids The array of Artists ids to eliminate
   * @param {Function(Error)} callback
   */
  // eslint-disable-next-line
  Artist.eliminate = function(ids, callback) {
    const ArtPiece = Artist.app.models.ArtPiece;
    return Promise.resolve()
        .then(() => Artist.find({ where: { id: { inq: ids } } }))
        .then((artists) => {
          if (artists.length > 0) {
            const artistsIds = artists.map(a => a.id);
            return ArtPiece.destroyAll({ artistId: { inq: artistsIds } });
          }
          return null;
        })
        .then(() => Artist.destroyAll({ id: { inq: ids } }))
        .then(() => callback(null));
  };

  Artist.validatesUniquenessOf('email', { message: 'El correo ingresado ya existe' });

  const validatesUniquenessAgainsCredential = (err, done) => {
    const Credential = Artist.app.models.Credential;

    return Promise.resolve()
          .then(() => { Credential.findOne({ where: { email: this.email } }); })
          .then((credential) => {
            if (credential) {
              err();
            }
            done();
          }).catch(() => err());
  };

  Artist.validateAsync('email', validatesUniquenessAgainsCredential, {
    message: 'Ya existe un usuario con este correo'
  });

  Artist.observe('after save', (ctx, next) => {
    if (ctx.instance && !ctx.isNewInstance) {
      return Artist.app.models.Credential.findOne({ where: { email: ctx.instance.email } })
          .then((cred) => {
            if (cred) {
              if (!(cred.name === ctx.instance.name && cred.lastName === ctx.instance.lastName)) {
                cred.updateAttributes({
                  name: ctx.instance.name,
                  lastName: ctx.instance.lastName
                });
              }
            }
            return null;
          });
    }

    return next();
  });
};
