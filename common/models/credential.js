// eslint-disable-next-line
module.exports = function (Credential) {
  /**
   * Registers a new user Credential
   * @param {object} userAccount The details for the new user
   * @param {Function(Error, object)} callback
   */
  // eslint-disable-next-line
  Credential.register = function (userAccount, callback) {
    const Model = Credential.app.models[userAccount.ownerType];

    const modelValuesUpdate = {
      name: userAccount.name,
      lastName: userAccount.lastName,
      address1: userAccount.address1,
      address2: userAccount.address2,
      city: userAccount.city,
      state: userAccount.state,
      country: userAccount.country,
      email: userAccount.email,
      birthDate: userAccount.birthDate
    };

    let persistedModel = {};

    return Promise.resolve()
        .then(() => Model.findOne({ where: { email: userAccount.email } }))
        .then((previouslyCreatedModel) => {
          persistedModel = previouslyCreatedModel;
          if (userAccount.ownerType === 'CulturalHelper') {
            const Artist = Credential.app.models.Artist;
            return Artist.findOne({ where: { email: userAccount.email } });
          }
          return false;
        })
        .then((check) => {
          if (check) {
            throw new Error('El correo utilizado ya existe como un Artista.');
          }
          return persistedModel;
        })
        .then((previouslyCreatedModel) => {
          if (previouslyCreatedModel) {
            return previouslyCreatedModel.updateAttributes(modelValuesUpdate);
          }

          return Model.create(modelValuesUpdate);
        })
        .then((ownerModel) => {
          const newCredential = Object.assign({},
                                userAccount,
                                { ownerId: ownerModel.id });

          return Credential.create(newCredential);
        })
        .then(cred => callback(null, cred))
        .catch((err) => {
          const customError = {
            status: 422,
            message: err.message
          };
          callback(customError, null);
        });
  };
};
