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



