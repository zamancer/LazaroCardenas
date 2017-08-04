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

    const detail = Object.keys(ArtistFilters)
      .map((p) => {
        const mergedFilters = {};
        mergedFilters[p] = ArtistFilters[p];
        mergedFilters[p].value = currentArtist[p];
        return mergedFilters;
      })
      .reduce((acc, current) => Object.assign({}, acc, current), {});

    const details = { detail, categories: currentArtist.categories };

    callback(null, details);
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
