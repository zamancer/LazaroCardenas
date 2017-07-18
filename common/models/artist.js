module.exports = function(Artist) {
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
  };

  /**
     * Retrieves the artist info with filters
     * @param {Function(Error, object)} callback
     */
  Artist.prototype.getArtistDetail = function(callback) {
    let currentArtist = this;
    let Credential = Artist.app.models.Credential;

    return Promise.resolve()
      .then(() => Credential.findOne({
        where: {
          ownerType: 'Artist',
          ownerId: currentArtist.id,
        },
      }))
    .then(artistCredential => {
      let mergedArtist = Object.assign({},
        {photo: currentArtist.photo,
          phone: currentArtist.phone,
        },
        {name: artistCredential.name,
          lastName: artistCredential.lastName,
          email: artistCredential.email,
        });
      let detail = Object.keys(ArtistFilters)
        .map(p => {
          let mergedFilters = {};
          mergedFilters[p] = ArtistFilters[p];
          mergedFilters[p].value = mergedArtist[p];
          return mergedFilters;
        })
        .reduce(function(acc, current) {
          return Object.assign({}, acc, current);
        }, {});
      let details = {
        detail: detail,
        categories: currentArtist.categories,
      };
      return details;
    });
    // .then(details => callback(null, details));
  };
};
