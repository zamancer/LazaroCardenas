// eslint-disable-next-line
module.exports = function (Artist) {
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
  // eslint-disable-next-line
  Artist.prototype.getArtistDetail = function (callback) {
    const currentArtist = this;
    const Credential = Artist.app.models.Credential;

    return Promise.resolve()
      .then(() => Credential.findOne({
        where: {
          ownerType: 'Artist',
          ownerId: currentArtist.id,
        },
      }))
    .then((artistCredential) => {
      const mergedArtist = Object.assign({},
        { photo: currentArtist.photo,
          phone: currentArtist.phone,
        },
        { name: artistCredential.name,
          lastName: artistCredential.lastName,
          email: artistCredential.email,
        });
      const detail = Object.keys(ArtistFilters)
        .map((p) => {
          const mergedFilters = {};
          mergedFilters[p] = ArtistFilters[p];
          mergedFilters[p].value = mergedArtist[p];
          return mergedFilters;
        })
        .reduce((acc, current) => Object.assign({}, acc, current), {});
      const details = {
        detail,
        categories: currentArtist.categories,
      };
      return details;
    });
    // .then(details => callback(null, details));
  };
};
