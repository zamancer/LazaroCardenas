const path = require("path");

// eslint-disable-next-line
module.exports = function(Credential) {
  /**
   * Registers a new user Credential
   * @param {object} userAccount The details for the new user
   * @param {Function(Error, object)} callback
   */
  // eslint-disable-next-line
  Credential.register = function(userAccount, callback) {
    const Model = Credential.app.models[userAccount.ownerType];

    const modelValuesUpdate = {
      name: userAccount.name,
      lastName: userAccount.lastName,
      email: userAccount.email
    };

    let persistedModel = {};

    return Promise.resolve()
      .then(() => Model.findOne({ where: { email: userAccount.email } }))
      .then(previouslyCreatedModel => {
        persistedModel = previouslyCreatedModel;
        if (userAccount.ownerType === "CulturalHelper") {
          const Artist = Credential.app.models.Artist;
          return Artist.findOne({ where: { email: userAccount.email } });
        }
        return false;
      })
      .then(check => {
        if (check) {
          throw new Error("El correo utilizado ya existe como un Artista.");
        }
        return persistedModel;
      })
      .then(previouslyCreatedModel => {
        if (previouslyCreatedModel) {
          return previouslyCreatedModel.updateAttributes(modelValuesUpdate);
        }

        return Model.create(modelValuesUpdate);
      })
      .then(ownerModel => {
        const newCredential = Object.assign({}, userAccount, {
          ownerId: ownerModel.id
        });

        return Credential.create(newCredential);
      })
      .then(cred => callback(null, cred))
      .catch(err => {
        const customError = {
          status: 422,
          message: err.message
        };
        callback(customError, null);
      });
  };

  Credential.on("resetPasswordRequest", info => {
    // const message = `We need to send a email reset for ${info.email} using the
    // accessToken: ${info.accessToken.id}`;
    const AppEmail = Credential.app.models.AppEmail;

    const mailOptions = {
      mailer: Credential.app.models.AppEmail,
      type: "email",
      to: info.email,
      from: "alnzam17@gmail.com",
      subject: "Thanks for registering.",
      template: path.resolve(__dirname, "../../server/views/verify.ejs"),
      text: `Please reset id ${info.accessToken.id}`,
      redirect: "/verified"
    };

    AppEmail.send(mailOptions);
  });

  Credential.observe("after save", (ctx, next) => {
    if (ctx.instance && !ctx.isNewInstance) {
      return Credential.app.models.Artist.findOne({
        where: { email: ctx.instance.email }
      }).then(artist => {
        if (artist) {
          if (
            !(
              artist.name === ctx.instance.name &&
              artist.lastName === ctx.instance.lastName
            )
          ) {
            artist.updateAttributes({
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
