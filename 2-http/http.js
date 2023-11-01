 import http from 'http';
 import fs from 'fs';
 import url from 'url';
 const port = process.env.PORT || 8000;

 const server = http.createServer((req, res) => {
     var parsedUrl = url.parse(req.url, true)
     var urlArray = parsedUrl.path.split('/')
     

    var pets;
    if (req.method === 'GET' && urlArray[1] === 'pets') {
        fs.readFile('../pets.json', 'utf8', (error, data) => {
            var parsedData = JSON.parse(data);
            var index = urlArray[2];

            if (!urlArray[2]) {
                pets = data
                console.log(pets)
                res.statusCode = 200
                res.setHeader('Content-Type', 'application-json');
                res.end(pets)
            } else if (!parsedData[index]) {
                errorMessage()
            } else {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application-json');
                res.end(JSON.stringify(parsedData[index])); 
            }
        })
    } else {
        errorMessage()
    }


    function errorMessage() {
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not found');
    }
 })

 server.listen(port, () => {
    console.log('Listening on port', port)
 })

 