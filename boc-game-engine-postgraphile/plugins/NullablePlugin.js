const { makeChangeNullabilityPlugin } = require('graphile-utils');

module.exports = makeChangeNullabilityPlugin({
  Customer: {
    consentEmail: true,
  },
});
