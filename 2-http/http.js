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
                successMessage(pets)
            } else if (!parsedData[index]) {
                errorMessage()
            } else {
                successMessage(JSON.stringify(parsedData[index]))
            }
        })
    } else if (req.method === 'POST' && urlArray[1] === 'pets'){
        let data = ''
        req.on('data', (chunk) => {
            data += chunk
            console.log(data)
        })

        req.on('end', () => {
            const parseData = JSON.parse(data);
            console.log(parseData)
        })
        
        fs.readFile('../pets.json', 'utf8', (error, data) => {
            const newData = JSON.parse(data)
            newData.push(data)
            fs.writeFile('../pets.json', 'utf8', (error, data) => {

            })
        })




        
        
    } else {
        errorMessage()
    }

    


    function errorMessage() {
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not found');
    }

    function successMessage(result) {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application-json');
        res.end(result); 
    }
 })

 server.listen(port, () => {
    console.log('Listening on port', port)
 })

 