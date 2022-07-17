const bcrypt = require('bcryptjs');

function HashPassword(pass) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pass, salt);
    return hash;
}

function ComparePassword(pass, hash) {
    return bcrypt.compareSync(pass, hash);
}

module.exports = {
    HashPassword,
    ComparePassword
}