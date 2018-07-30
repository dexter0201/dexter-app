const os = require('os');
const crypto = require('crypto');

const {emailConfiguration} = require('config');
const mailgun = require('mailgun-js')({apiKey: emailConfiguration.api, domain: emailConfiguration.domain});

// something to print ip wherever
function printIp() {
    const ifaces = os.networkInterfaces();

    Object.keys(ifaces).forEach((ifname) => {
        let alias = 0;

        ifaces[ifname].forEach((iface) => {
            if (iface.family !== 'IPv4' || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }

            if (alias >= 1) {
                // this single interface has multiple ipv4 addresses
                console.log(ifname + ':' + alias, iface.address);
            } else {
                // this interface has only one ipv4 adress
                console.log(ifname, iface.address);
            }
            alias = alias+1;
        });
    });
}

// something to show stack traces of async exceptions
function handleAsyncExceptions() {
    if (handleAsyncExceptions.hooked === false) {
        process.on('unhandledRejection', (err) => {
            throw err;
        });

        handleAsyncExceptions.hooked = true;
    }
}

handleAsyncExceptions.hooked = false;

function batchReduce(items, batchSize=10, op) {
    const reducer = (i) => {
        const batch = items.slice(i, i+batchSize);
        if (batch.length > 0) {
            return op(batch).then(() => reducer(i+batchSize));
        } else {
            return Promise.resolve();
        }
    };

    return reducer(0);
}

function sendEmail({to, from, subject, text}) {
    const data = {
        from,
        to,
        subject,
        text
    };
    return new Promise((resolve, reject) => {
        mailgun.messages().send(data, (error, body) => {
            console.log({body, error})
            return resolve(body);
        });
    });
}

async function createPassword(length, chars) {
    if (!chars) {
        chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    }
    return new Promise((resolve, reject) => {
        const charsLength = chars.length;
        if (charsLength > 256) {
            reject('parm chars length greater than 256 characters' +
                ' masks desired key unpredictability');
        }
        const randomBytes = crypto.randomBytes(length);
        const result = new Array(length);
        let cursor = 0;
        for (let i = 0; i < length; i++) {
            cursor += randomBytes[i];
            result[i] = chars[cursor % charsLength];
        }
        resolve(result.join(''));
    });
}

module.exports = {
    printIp,
    handleAsyncExceptions,
    batchReduce,
    sendEmail,
    createPassword
};
