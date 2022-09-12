const handleGets = require('./getData');
const handleUpdates = require('./updateData');
const handlePosts = require('./postData');

module.exports = (app) => {
  handleGets(app);
  handleUpdates(app);
  handlePosts();
};
