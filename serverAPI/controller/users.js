let response = require('../response');
let connection = require('../connection');
let sha1 = require('sha1');
let moment = require('moment');
let crypto = require('crypto');

async function register (request, reply) {

    let now = moment().format('YYYY-MM-DD HH:mm:ss').toString();
    let name = request.body.name;
    let email = request.body.email;
    let password = sha1(request.body.password);
    let token = crypto.randomBytes(32).toString('hex');
    let created_at = now;
    let updated_at = now;

    let sql = `INSERT INTO web_users (name, email, password, remember_token, created_at, updated_at)
      values(?, ?, ?, ?, ?, ?)`;

    //Menggunakan promise apabila membutuhkan data yang akan dikembalikan setelah callback
    let data = await new Promise((resolve) =>
        connection.query(sql,
            [name, email, password, token, created_at, updated_at], function (error, rows) {
            if(error){
                //Check terlebih dahulu untuk data yang sudah ada.
                if(error.code === 'ER_DUP_ENTRY'){
                    return response.badRequest('', `E-mail ${email} telah digunakan!`, reply)
                }

                //Jika bukan duplicate entry maka cetak error yang terjadi.
                console.log(error);
                return response.badRequest('', `${error}`, reply)
            }

            return resolve({ name: name, email: email, token :  token});
        })
    );

    return response.ok(data, `Berhasil registrasi pengguna baru - ${email}`, reply);
}


async function login(request, reply) {

    let email = request.body.email;
    let password = request.body.password;
    let sql = `SELECT * FROM web_users WHERE email = ?`;

    let data = await new Promise((resolve) =>
        connection.query(sql, [email], function (error, rows) {
                if(error){
                    console.log(error);
                    return response.badRequest('', `${error}`, reply)
                }
								 
                if(rows.length > 0){
                    let verify = sha1(password) === rows[0].password;

                    let data = {
                        name: rows[0].name,
                        email: rows[0].email,
                        token: rows[0].remember_token
                    };
                    return verify ? resolve(data) : resolve(false);
                }
                else{
                    return resolve(false);
                }
            })
    );

    if(!data){
        return response.badRequest('','Email atau password yang anda masukkan salah!', reply)
    }

    return response.ok(data, `Berhasil login!`, reply);
}

async function checkclientversion(request, reply) {
    try {
        let user = request.body.user;
        let version = request.body.clientversion;

        console.log("User:",user, " || Client Version: ", version)
        let data = `[\n`;
            data += `  {\n`;

        if (version==='1'){
            data += `    "status": "OK" \n`
        }else{
            data += `    "status": "UPDATE", \n`
            data += `    "url": "https://cns.anung.id/files/xxx.xlsm" \n`
        }
        
        data += `  }\n`
        data += `]`

            return data

        // return response.ok(data,``, reply);
    }catch (err) {
        console.log('ERROR: ', err)
        return response.badRequest('',err.message, reply)
      }
}


module.exports = {
    register,
    login,
    checkclientversion
};
