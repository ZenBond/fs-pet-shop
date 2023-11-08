
import fs from 'fs';
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

app.put('/pets/:id', (req, res) => {
    const id = Number.parseInt(req.params.id);
    const petsData = JSON.parse(fs.readFileSync(petsPath, 'utf8'));

    if (!Number.isNaN(id) && id >= 0 && id < petsData.length) {
        const updatedPet = req.body;
        if (updatedPet) {
            petsData[id] = updatedPet;
            fs.writeFileSync(petsPath, JSON.stringify(petsData));
            res.send(petsData);
        } else {
            res.sendStatus(400); 
        }
    } else {
        res.sendStatus(404); 
    }
});

app.use((err, req, res, next) => {
    res.status(err.status).json({error: err.message})
})


app.listen(port, () => {
    console.log('Listening on port:', port)
 })



