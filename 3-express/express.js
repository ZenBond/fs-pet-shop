import http from 'http';
import fs from 'fs';
import url from 'url';
const port = process.env.PORT || 8000;
import express from 'express'
const app = express();



app.use((req, res, next) => {
    const url = req.url
    console.log(url)
    if (!url.includes('/pets')) {
        next({message: `Not found`, status: 404})
    } else {
        next()
    }
})



app.get('/pets', (req, res) => {
    var parsedUrl = url.parse(req.url, true)
    var urlArray = parsedUrl.path.split('/')

    
    fs.readFile('../pets.json', 'utf8', (error, data) => {
        var parsedData = JSON.parse(data);
        console.log(parsedData)
        res.send(parsedData)
    })
})

app.get('/pets/:id', (req, res, next) => {
    fs.readFile('../pets.json', 'utf8', (error, data) => {
        var parsedData = JSON.parse(data);
        if (!parsedData[req.params.id]) {
            next({message: `Not found`, status: 404})
        } 
        console.log(parsedData[req.params.id])
        res.send(parsedData[req.params.id])
    })
})

app.use((err, req, res, next) => {
    res.status(err.status).json({error: err.message})
})


app.listen(port, () => {
    console.log('Listening on port:', port)
 })
// const server = http.createServer((req, res) => {

    

//    var pets;
//    if (req.method === 'GET' && urlArray[1] === 'pets') {
       
//    } else if (req.method === 'POST' && urlArray[1] === 'pets'){
//        let data = ''
//        req.on('data', (chunk) => {
//            data += chunk
//            console.log(data)
//        })

//        req.on('end', () => {
//            const parseData = JSON.parse(data);
//            console.log(parseData)
//        })
       
//        fs.readFile('../pets.json', 'utf8', (error, data) => {
//            const newData = JSON.parse(data)
//            newData.push(data)
//            fs.writeFile('../pets.json', 'utf8', (error, data) => {

//            })
//        })




       
       
//    } else {
//        errorMessage()
//    }

   


//    function errorMessage() {
//        res.statusCode = 404
//        res.setHeader('Content-Type', 'text/plain');
//        res.end('Not found');
//    }

//    function successMessage(result) {
//        res.statusCode = 200
//        res.setHeader('Content-Type', 'application-json');
//        res.end(result); 
//    }
// })



