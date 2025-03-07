const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const filePath = 'notas.json';

app.use(cors());
app.use(bodyParser.json());

// Leer notas
app.get('/notas', (req, res) => {
    if (!fs.existsSync(filePath)) {
        return res.json([]);
    }
    const data = fs.readFileSync(filePath, 'utf8');
    const notas = JSON.parse(data);
    res.json(notas);
});

// Agregar una nueva nota
app.post('/notas', (req, res) => {
    const { titulo, contenido } = req.body;
    if (!titulo || !contenido) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    let notas = [];
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        notas = JSON.parse(data);
    }

    if (notas.some(nota => nota.titulo === titulo)) {
        return res.status(400).json({ error: 'La nota ya existe' });
    }

    notas.push({ titulo, contenido });
    fs.writeFileSync(filePath, JSON.stringify(notas, null, 2));
    res.json({ mensaje: 'Nota agregada' });
});

// Eliminar una nota
app.delete('/notas/:titulo', (req, res) => {
    const titulo = req.params.titulo;
    if (!fs.existsSync(filePath)) {
        return res.status(400).json({ error: 'No hay notas guardadas' });
    }

    const data = fs.readFileSync(filePath, 'utf8');
    let notas = JSON.parse(data);
    const notasFiltradas = notas.filter(nota => nota.titulo !== titulo);

    if (notas.length === notasFiltradas.length) {
        return res.status(404).json({ error: 'Nota no encontrada' });
    }

    fs.writeFileSync(filePath, JSON.stringify(notasFiltradas, null, 2));
    res.json({ mensaje: 'Nota eliminada' });
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
