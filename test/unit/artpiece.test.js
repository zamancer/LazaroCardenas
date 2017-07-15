const {app, common} = require('../common');

const ArtPiece = app.models.ArtPiece;

describe('It should resolve', function() {
    it('an ArtPiece.find', function() {
        return ArtPiece
                .find()
                .then(res => console.log(res));
    });
});
