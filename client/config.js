const URL = window.location.hostname === `localhost`
            ? `http://localhost:5000`
            : `http://167.172.102.224`;

module.exports = { URL }