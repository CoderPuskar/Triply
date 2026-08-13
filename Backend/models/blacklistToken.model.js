const mongoose = require('mongoose');

const blacklistTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // Token will be removed after 1 hour
  },
});



module.exports =mongoose.model('BlacklistToken', blacklistTokenSchema);