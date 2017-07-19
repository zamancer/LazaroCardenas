module.exports = function(Credential) {
  const selectUserBuilder = function(userAccount) {
    switch (userAccount.userType) {
      case '1':
        return {
          owner: {ownerType: 'CulturalHelper'},
          model: Credential.app.models.CulturalHelper,
        };
      case '2':
        return {
          owner: {ownerType: 'Artist'},
          model: Credential.app.models.Artist,
        };
      default:
        throw new Error('Unsupported user type');
    }
  };

 /**
 * Registers a new user Credential
 * @param {object} userAccount The details for the new user
 * @param {Function(Error, object)} callback
 */
  Credential.register = function(userAccount, callback) {
    let userTypeBuilder = selectUserBuilder(userAccount);
    const Model = userTypeBuilder.model;

    return Promise.resolve()
        .then(() => Model.create({}))
        .then((ownerModel) => {
          let newCredential = Object.assign({},
                                userAccount,
                                userTypeBuilder.owner,
                                {ownerId: ownerModel.id});

          return Credential.create(newCredential);
        })
        .then(credential => {
          return credential;
        });
  };
};
