module.exports = function(Credential) {
 /**
 * Registers a new user Credential
 * @param {object} userAccount The details for the new user
 * @param {Function(Error, object)} callback
 */
  Credential.register = function(userAccount, callback) {
    const Model = Credential.app.models[userAccount.ownerType];

    return Promise.resolve()
        .then(() => Model.create({}))
        .then((ownerModel) => {
          let newCredential = Object.assign({},
                                userAccount,
                                {ownerId: ownerModel.id});

          return Credential.create(newCredential);
        })
        .then(credential => {
          return credential;
        });
  };
};
