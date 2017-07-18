const {app, common} = require('../common');

const Artist = app.models.Artist;

describe('It should resolve', function() {
  it('an Artist.find', function() {
    return Artist
            .find()
            .then(res => console.log(res));
  });
});
