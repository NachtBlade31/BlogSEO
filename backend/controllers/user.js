const User = require('../models/User');

exports.read = (req, res) => {
    req.profile.password = undefined;
    return res.json(req.profile);
}