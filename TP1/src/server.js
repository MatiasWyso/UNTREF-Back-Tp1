const dotenv     = require('dotenv');
dotenv.config();
const express    = require('express');
const path       = require('path');
const products   = require('./products.js');
const app        = express();
const PORT       = process.env.PORT || 3000;

app.use(express.json())
products.load();

// RUTAS 

app.get("/obtener/:id", (req, res) => {
	const result = products.getProductByID(req.params.id);
	res.status(result.status || 200).json(result);
});

app.put("/actualizar/:id", (req, res) => { 
	const result = products.update(req.params.id, req.body);
	res.status(result.status || 200).json(result);
});

app.delete("/eliminar/:id", (req, res) => {
	const result = products.remove(req.params.id);
	res.status(result.status || 200).json(result);
});


app.post("/agregar", (req, res) => {
	const result = products.add(req.body);
	res.status(result.status || 201).json(result);
});

app.get("/obtener-por-nombre/:nombre", (req, res) => {
	const result = products.getProductsByName(req.params.nombre);
	res.status(result.status || 200).json(result);
});

app.get("/listado", (req, res) => {
	res.status(200).json(products.list());
});

app.all("*", (req, res) => {
	res.status(404).json({"id": "error", "descripcion": "Inexistente"});
});

app.listen(PORT, () => {
	console.log(`Servidor iniciado en el puerto ${PORT}.`);
});