'use strict';

module.exports = function(Artist) {
    /**
     * Retrieves the artist info with filters
     * @param {Function(Error, object)} callback
     */
  Artist.prototype.getArtistDetail = function(callback) {
    var details = this.categories;
    // TODO
    callback(null, details);
  };
};
