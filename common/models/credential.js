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

    return Promise.resolve()
        .then(() => Model.create({
          name: userAccount.name,
          lastName: userAccount.lastName,
          address1: userAccount.address1,
          address2: userAccount.address2,
          city: userAccount.city,
          state: userAccount.state,
          country: userAccount.country,
          email: userAccount.email,
          birthDate: userAccount.birthDate
        }))
        .then((ownerModel) => {
          const newCredential = Object.assign({},
                                userAccount,
                                { ownerId: ownerModel.id });

          return Credential.create(newCredential);
        })
        .then(credential => credential);
  };
};
