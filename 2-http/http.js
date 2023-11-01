 import http from 'http';
 import fs from 'fs';
 import url from 'url';
 const port = process.env.PORT || 8000;

 const server = http.createServer((req, res) => {
     var parsedUrl = url.parse(req.url, true)
     var index = parsedUrl.path.split('/')[2]
     

    var pets;
    if (req.method === 'GET' && req.url === '/pets') {
        fs.readFile('../pets.json', 'utf8', (error, data) => {
            pets = data
            console.log(pets)
            res.statusCode = 200
            res.setHeader('Content-Type', 'application-json');
            res.end(pets)
        })
    } else {
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not found');
    }
 })

 server.listen(port, () => {
    console.log('Listening on port', port)
 })