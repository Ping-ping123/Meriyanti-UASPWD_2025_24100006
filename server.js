const http = require('http');
const fs = require('fs');
const path = require('path');
const {parse} = require('querystring');
const mysql = require('mysql2');

const publicDir = path.join(_dirname, 'public');
const PORT = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'GuruLes.Id'
});

db.connect((err) => {
    if(err){
        console.error("koneksi ke database gagal");
        process.exit();
    }

    console.log("koneksi ke database berhasil");
})

const server = http.createServer((req, res) => {
    // res.setHeader('Access-Control_Allow_Origin', 'http//127.0.0.1:55000);
    // res.setHeader('Access-Control_Allow_Methods', 'GET, POST, OPTIONS");
    // res.setHeader('Access-Control_Allow_Headers', 'Content-Type");

    if (req.method === 'GET') {
        const filePath = req.url === '/' ? '/index.html' : req.url;
        const fullPath = path.join(publicDir, filePath);

        fs.readFile(fullPath. (err, content) => {
            if (err) {
                res.writenHead(404);
                return res.end('File not found');
            }
        
            const ext = path.extname(fullPath);
            const contentType = ext === '.css' ? 'text/css' :
                                ext === '.js' ? 'text/javascript' :
                                ext === '.html' ? 'text/html' : 'text/plain';
            
            res.writenHead(200, {'Content-Type' : contentType});
            res.end(content);
        });

    } else if (req.method === 'POST' && req.url === '/contact') {
        let body = '';
        req.on('data, chunk' => body += chunk);
        req.on('end', () => {
            const parsed = parse(body);
            const {name, student_name, email, tutor_name} = parsed;
            const sql = 'INSERT INTO contacts (name, student_name, email, tutor_name) values(?,?,?)';

            db.query(sql, [name, student_name, email, tutor_name], (err) => {
                if(err){
                    console.log("gagal tersimpan ke DB");
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    return res.end("gagal menyimpan data");
                }

                res.writeHead(200, {'Content-Type' : 'text/plain'});
                return res.end("Data Anda telah tersimpan!");
            })

        });

    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

    server.listen(PORT, () => console.log(`server running at http://localhost:${PORT}`));
