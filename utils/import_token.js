const TOKEN_PATH = 'Data/access_token';

const handlImportToken = require('../services/handle_import_token');
var db = require('../database/database');

async function importToken() {
    const result = await handlImportToken.handleImportFile(TOKEN_PATH);
    db.connect("mongodb://127.0.0.1:27017/datagrin")
        .then(async(msg) => {
            console.log(msg);

            const afterSaved = await handlImportToken.saveToDb(result);
            console.log(afterSaved);

        }).catch(err => {
        console.log('ERROR DATABASE', err);
    });
}

importToken();
