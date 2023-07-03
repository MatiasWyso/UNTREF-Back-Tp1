const fileManager = require("./fileManager.js");
const path        = require("path");
let products      = undefined;
const dotenv	  = require("dotenv");
dotenv.config();
let dbFilePath    = path.join(__dirname, process.env.DATABASE_PATH);
let idDBFilePath  = path.join(__dirname, process.env.ID_DB_PATH);
let idCounter     = undefined;

const getProductByID = id => {
	let productMatch = undefined;
	if(parseInt(id))
		productMatch = products.find(product => product.id == id);
	return productMatch !== undefined ? productMatch : noMatches();
}

const update = (id, prod) => {
	id = parseInt(id);
	let ret = undefined;
	if(hasSameKeys(prod)) {
		prod = {id: id, ...prod};
		let position = products.findIndex(product => product.id == id);
		if(position !== -1) {
			ret = prod;
			products.splice(position, 1, prod);
			fileManager.save(dbFilePath, JSON.stringify(products));
		} else 
			ret = {"id": "error", "status": 404, "descripcion": "No se encontró el producto"};	
	} else 
		ret = {"id": "error", "status": 409, "descripcion": "Producto no actualizado"};
	return ret;
}

const remove = id => {
	let position = products.findIndex(product => product.id == id);
	let ret = {"id": "error", "status": 404, "descripcion": "Producto no encontrado"};
	if(position !== -1) {
		ret = products.splice(position, 1);
		fileManager.save(dbFilePath, JSON.stringify(products));
	}	
	return ret;
}

const load = () => {
	products = JSON.parse(fileManager.read(dbFilePath));
	idCounter = JSON.parse(fileManager.read(idDBFilePath));  
}															

const list = () => products;
	
const getProductsByName = name => {
	const productMatches = products.filter(product => new RegExp(name, "i").test(product.nombre));
	return productMatches.length !== 0 ? productMatches : noMatches();
}

const add = prod => {
	let ret = undefined;
	if(hasSameKeys(prod)) {
		let position = products.findIndex(product => product.nombre == prod.nombre);
		if(position === -1) {
			++idCounter.id;
			prod = {id: idCounter.id, ...prod};
			ret = prod;
			products.push(prod);
			fileManager.save(dbFilePath, JSON.stringify(products));
			fileManager.save(idDBFilePath, JSON.stringify(idCounter)); 
				} else														 
			ret = {"id": "error", "status": 400, "descripcion": "Producto ya existente"};
	} else {
		ret = {"id": "error", "status": 409, "descripcion": "No pudo agregarse el producto"};
	}
	return ret;
}

const noMatches = () => ({"id": "error", "status": 404, "descripcion": "No hay resultados"});


const hasSameKeys = prod => {
	 const mandatoryKeys = ["imagen", "nombre", "importe", "stock"];
	 const prodKeys      = Object.keys(prod);
	 return mandatoryKeys.every((str, index) => str === prodKeys[index]);
}

module.exports = {add, load, getProductsByName, getProductByID, list, update, remove};