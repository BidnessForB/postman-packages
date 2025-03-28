/* 
Given a Postman request, wrap it in a promise and send it
*/
function sendRequest(req) {
    return new Promise((resolve, reject) => {
        pm.sendRequest(req, (err, res) => {
            if (err) {
                return reject(err);
            }

            return resolve(res);
        })
    });
}
