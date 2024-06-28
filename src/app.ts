import express from 'express';
import path from 'path';
import * as config from './config';
import * as database from './database';

const port: number = config.serverConfig.serverPort;

const webDir = path.join(__dirname, '../web/');

const app = express();
const router = express.Router();
app.set('view engine', 'ejs');
app.use(express.static(webDir), router);

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

app.get('/upload', (req, res) => {
    res.render(webDir + "upload.ejs");
});

/* API METHODS */
app.post('/data/:fileId', (req, res) => {
    database.editFileData(Number(req.params.fileId), req.body.name, req.body.secret, req.body.data).then(() => {
        res.statusCode = 200;
        res.send();
    });
});

app.post('/data', (req, res) => {
    database.uploadNewFile(req.body.name, req.body.secret, req.body.data).then(() => {
        res.statusCode = 200;
        res.send();
    });
});

app.post('/delete', (req, res) => {
    database.deleteFile(req.body.id).then(() => {
        res.statusCode = 200;
        res.send();
    });
});
/* ============= */

app.get('/edit/:fileid', (req, res) => {
    database.fetchFileById(Number(req.params.fileid)).then((fileObj) => {
        res.render(webDir + "edit.ejs", {
            file: fileObj,
        });
    });
});

app.get('/view/:fileSecret', (req, res) => {
    database.getFileBySecret(req.params.fileSecret).then((pdfData) => {
        console.log(`\x1b[44m\x1b[30mHTTP\x1b[0m \x1b[90mShowing ${req.params.fileSecret}\x1b[0m`);
        res.writeHead(200, {
            'Content-Type': 'application/pdf',
        });
        res.end(Buffer.from(pdfData, 'binary'));
    });
});

app.get('/', (req, res) => {
    database.fetchFileList().then((fileList) => {
        res.render(webDir + "index.ejs", {
            files: fileList,
        });
    });
});

console.log("■■■■■■■■■■■■■■■■■■■■■■■■■");
console.log("■ " + "   SERVER LAUNCHED   " + " ■");
console.log("■ " + "http://localhost:" + port + " ■");
console.log("■■■■■■■■■■■■■■■■■■■■■■■■■");

database.connectDatabase();

app.listen(port);