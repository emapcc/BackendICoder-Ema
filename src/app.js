import express from 'express';

const app = express();
const PORT = 8080;
const server = app.listen(PORT, () => console.log("Server listening on port ", PORT));

app.get('/', (req, res) => {
    res.send("Hola");
});