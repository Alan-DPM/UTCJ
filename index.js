// Importar las dependencias necesarias
const express = require('express');
const path = require('path');
const mysql = require('mysql2'); // Requiere el paquete mysql2 para conectar MySQL

// Crear una instancia de Express
const app = express();
const port = 3000; // Configuración del puerto

// Middleware para permitir el uso de JSON en las solicitudes
app.use(express.json());

// Configuración de la conexión a la base de datos MySQL en XAMPP
const db = mysql.createConnection({
    host: 'localhost',      // Host de XAMPP (puede ser '127.0.0.1')
    user: 'root',           // Usuario por defecto de MySQL en XAMPP
    password: '',           // Contraseña vacía en XAMPP (cambiar si has configurado una)
    database: 'carrera_db'  // Nombre de la base de datos
});

// Verificar conexión a la base de datos
db.connect((err) => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');
});

// Ruta para obtener todos los registros en "carrera"
app.get('/api/carrera', (req, res) => {
    db.query('SELECT * FROM carrera', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Ruta para servir el archivo HTML principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para crear un nuevo registro en "carrera"
app.post('/carrera', (req, res) => {
    const { noControl, name, materia } = req.body;
    const query = 'INSERT INTO carrera (noControl, name, materia) VALUES (?, ?, ?)';
    
    db.query(query, [noControl, name, materia], (err, result) => {
        if (err) throw err;
        res.status(201).json({ mensaje: 'Usuario creado', usuario: { noControl, name, materia } });
    });
});

// Ruta para obtener un registro específico por número de control
app.get('/carrera/:noControl', (req, res) => {
    const { noControl } = req.params;
    const query = 'SELECT * FROM carrera WHERE noControl = ?';
    
    db.query(query, [noControl], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ mensaje: 'Elemento no encontrado' });
        }
    });
});

// Ruta para actualizar un registro existente por número de control
app.put('/carrera/:noControl', (req, res) => {
    const { noControl } = req.params;
    const { name, materia } = req.body;
    const query = 'UPDATE carrera SET name = ?, materia = ? WHERE noControl = ?';

    db.query(query, [name, materia, noControl], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
            res.json({ mensaje: 'Elemento actualizado', usuario: { noControl, name, materia } });
        } else {
            res.status(404).json({ mensaje: 'Elemento no encontrado' });
        }
    });
});

// Ruta para eliminar un registro existente por número de control
app.delete('/carrera/:noControl', (req, res) => {
    const { noControl } = req.params;
    const query = 'DELETE FROM carrera WHERE noControl = ?';

    db.query(query, [noControl], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
            res.json({ mensaje: 'Elemento eliminado' });
        } else {
            res.status(404).json({ mensaje: 'Elemento no encontrado' });
        }
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`);
});
