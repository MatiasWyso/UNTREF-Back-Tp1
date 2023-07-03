const fs = require("fs");

const read = filePath => {
	let f = undefined;
	try {
		 f = fs.readFileSync(filePath.trim(), "utf8");
	}
	catch(err) {
		console.log(err);
	}
	return f;
}

const save = (filePath, data) => {
	try {
		fs.writeFileSync(filePath.trim(), data); 
	}
	catch(err) {
		console.log(err);
	}
}

module.exports = {read, save};