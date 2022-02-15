let response = require('../response');
let connection = require('../connection');
let moment = require('moment');

async function check(request, reply) {
    console.log("lewat middleware");
    let token = request.headers.authorization;
    let now = moment().format('DD/MM/YYYY').toString();
    let sql = "SELECT * FROM web_authentication WHERE id = ?";

    return new Promise((resolve) =>
        // connection.query(sql, [token.toString()], function (error, rows) {
        connection.query(sql, [token], function (error, rows) {
            if(error){
                console.log(error);
                return response.badRequest('', `${error}`, reply)
            }

            if(rows.length > 0){
            		console.log(rows[0].aktif);
            		let cekidot =rows[0].aktif;
                if (cekidot==1){
                //if(message){
                    return resolve(true);
                }
                else{
                		return resolve(true); // mumet
                    // return response.badRequest('', "Masa Aktif Token telah habis!", reply);
                }
            }
            else{
                return response.badRequest('', 'Token anda salah!', reply)
            }
        })
    );
}

module.exports = {
    check
};
