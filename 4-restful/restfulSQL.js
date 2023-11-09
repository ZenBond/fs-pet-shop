import express from 'express';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
    user: 'jessecarter',
    host: 'localhost',
    database: 'pet_shop',
    port: '5432'
});

const PORT = 8000;

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    const url = req.url;
    if (!url.includes('/pets')) {
        next({message:"Internal Server Error", status: 500});
    }
    else {
        next();
    }
})

app.get('/pets', async (req, res, next) => {
    try {
        const result = await pool.query(
        'SELECT * FROM pets'
    );
    res.status(200).send(result.rows);
    }   
    catch (err) {
        next(err);
    }
});

app.get('/pets/:id', async (req, res, next) => {
    try {
        const id = Number.parseInt(req.params.id);
        if (Number.isNaN(id)) {
            const err = new Error('Not found');
            err.status = 404;
            throw err;
        }
        const result = await pool.query(
            `SELECT * FROM pets WHERE id = ${id}`
        );
        //console.log(id);
        //console.log(result.rows.length);
        if (result.rows.length === 0) {
            const err = new Error('Not found');
            err.status = 404;
            throw err;
        }
        res.status(200).send(result.rows)
    }
    catch (err) {
        next(err);
    }
})

app.post('/pets', async (req, res, next) => {
    try {
        const { age, kind, name } = req.body;
        if (!name || isNaN(age) || !kind) {
            return res.status(400).send(`| Request Method | Request URL | Request Body | Response Status | Response Content-Type | Response Body ||
            | -------------- | ----------- | ------------ | --------------- | --------------------- | ------------- || 
            | POST | /pets | { "name": "", "age": "two", "kind": "" } | 400 | text/plain | Bad Request ||`);
        }
        const result = await pool.query(
            `INSERT INTO pets (age, kind, name) VALUES ($1, $2, $3) RETURNING *`, [age, kind, name]
        )
        res.send(result.rows);
    }
    catch (err) {
        next(err);
    }
})

app.patch('/pets/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const { age, kind, name } = req.body;
        if (!name || isNaN(age) || !kind) {
            return res.status(400).send(`| Request Method | Request URL | Request Body | Response Status | Response Content-Type | Response Body ||
            | -------------- | ----------- | ------------ | --------------- | --------------------- | ------------- || 
            | PATCH | /pets | { "name": "", "age": "two", "kind": "" } | 400 | text/plain | Bad Request ||`);
        }
        const result = await pool.query(
            `UPDATE pets SET age = $1, kind = $2, name = $3 WHERE id = $4 RETURNING *`, [age, kind, name, id]
        )

        res.send(result.rows);
    }
    catch (err) {
        next(err);
    }
})

app.delete('/pets/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            const err = new Error('Not found');
            err.status = 404;
            throw err;
        }
        const result = await pool.query(
            `DELETE FROM pets WHERE id = $1 RETURNING *`, [id]
        )
        if (result.rows.length === 0) {
            const err = new Error('Not found');
            err.status = 404;
            throw err;
        }
        res.send(result.rows)
    }
    catch (err) {
        next(err);
    }
})

app.use((req, res, next) => {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
})

app.use((err, req, res, next) => {
    //console.error(err);
    res.status(err.status).json({error: err.message});
})

app.listen(PORT, (req, res) => {
    console.log(`Server is running on PORT: ${PORT}`)
})