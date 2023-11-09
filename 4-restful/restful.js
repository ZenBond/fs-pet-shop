import express from 'express';
import fs from 'fs';
const app = express();
const PORT = 8000;
const petsPath = '../pets.json'

app.use(express.json());




app.get('/pets', (req, res) => {
    if (!petsPath) {
        res.status(404).send('Not Found')
    }
    fs.readFile(petsPath, 'utf8', (error, data) => {
        if (error) {
            console.error(error.stack);
            return res.sendStatus(500);
        } else {
            res.send(data);
        }
    })
})

app.get('/pets/:id', (req,res) => {
    
    fs.readFile(petsPath, 'utf8', (error, data) => {
        const id = Number.parseInt(req.params.id);
        if (error) {
            console.error(error.stack);
            return res.sendStatus(500);
        } 
        const pets = JSON.parse(data)
        if (id < 0 || id >= pets.length || Number.isNaN(id)) {
            return res.status(404).send(`Not found`);
        }
        res.send(pets[id])
    })

})

app.post('/pets', (req, res) => {
    console.log(req.body)
    const { age, kind, name } = req.body;
    const pet = req.body
    if (!name || typeof age !== 'number' || !kind) {
        res.status(400).send(`Bad`);
    }
    fs.readFile(petsPath, 'utf8', (error, data) => {
        const pets = JSON.parse(data)
        if (error) {
            console.error(error.stack);
            return res.sendStatus(500);
        }
        pets.push(pet)
        fs.writeFile(petsPath, JSON.stringify(pets), (error) => {
            res.send(pets)
        })
        
    })
    
})

app.patch('/pets/:id', (req, res) => {
    const updatedPet = req.body;
    const {age, name, kind} = req.body;
    if (!name || typeof age !== 'number' || !kind) {
        res.status(400).send(`Bad`);
    }
    fs.readFile(petsPath, 'utf8', (error, data) => {
        if (error) {
            console.error(error.stack);
            return res.sendStatus(500);
        }
        const id = Number.parseInt(req.params.id);
        const pets = JSON.parse(data);
        pets[id] = updatedPet;
        fs.writeFile(petsPath, JSON.stringify(pets), (error) => {
            res.send(pets)
        })
    })
})

app.delete('/pets/:id', (req, res) => {
    fs.readFile(petsPath, 'utf8', (error, data) => {
        if (error) {
            console.error(error.stack);
            return res.sendStatus(500);
        }
        const id = Number.parseInt(req.params.id);
        const pets = JSON.parse(data);
        pets.splice(id, 1);
        fs.writeFile(petsPath, JSON.stringify(pets), (error) => {
            res.send(pets)
        })
    })
})



app.use((req, res) => {
    res.sendStatus(404);
})




app.listen(PORT, (req, res) => {
    console.log(`SERVER IS RUNNING ON ${PORT}`)
})