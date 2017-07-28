const mongodbUrl = process.env.MONGODB_URL;

if (mongodbUrl) {
  // eslint-disable-next-line
  console.log('Using MongoDB url:', mongodbUrl);
  const dataSources = {
    db: {
      name: 'db',
      connector: 'mongodb',
      url: mongodbUrl,
    },
  };

  module.exports = dataSources;
}
