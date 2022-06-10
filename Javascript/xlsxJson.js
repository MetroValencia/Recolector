const { WorkBook, utils, read } = require('xlsx');

/**
 * Lee el archivo excel y transforma los datos a JSON
 * @param {Date} date Última fecha publicada del archivo
 * @param {WorkBook} document Archivo excel que contiene los datos de MetroValencia
 * @returns Datos en formato JSON
 */
function getDataExcel(date, document) {
	const workBook = read(document);

	const { meses, acumulado } = wBtoJson(workBook);

	const doc = { date, meses, acumulado };

	return { doc };
}

/**
 * Transforma los datos del archivo a JSON
 * La forma de extraer los datos es que las columnas tengan un encabezado al crear el JSON
 * @param {WorkBook} workBook Archivo que puede ser leído
 * @returns {{meses: Array<JSON>, acumulado: Array<JSON>}} JSON de las hojas del documento
 */
function wBtoJson(workBook) {
	const workSheets = {};

	const header = getTitlesSheet(workBook.Strings);
	const propMes = header[0];
	const total = header[header.length - 1]; // TOTAL VALENCIA

	for (const sheetName of workBook.SheetNames) {
		workSheets[sheetName] = utils.sheet_to_json(workBook.Sheets[sheetName], {
			header, // Se asignan nombre a las columnas
			defval: '', // Valor por defecto para las celdas con null o undefined
		});

		let mes; // Asigna el mes a la siguiente fila si esta vacía
		workSheets[sheetName].forEach((e) => (!e?.[propMes] ? (e[propMes] = mes) : (mes = e[propMes])));

		// Se descartan las filas que que no tienen datos o pasajeros
		workSheets[sheetName] = workSheets[sheetName].filter((e) => e[total] >= 1 && !isNaN(e[total]));
	}

	// Se desestructura el json y se asignan a unas constantes fáciles de manejar
	const { 'B21 por meses': mes, 'B21 acumulado': acumula } = workSheets;

	header.pop();

	const meses = structuredData(mes, header);
	const acumulado = structuredData(acumula, header);

	return { meses, acumulado };
}

/**
 * @param {JSON} json JSON sacado de los datos del Excel
 * @param {Array} titles Titulo de todos los campos
 * @returns Datos ordenados de menos a más años y cada linea muestra los pasajeros
 * en otro array por cada mes
 */
function structuredData(json, titles) {
	const arr = [];
	const arr2 = [['Mes', 'Año', 'Linea', 'Pasajeros']];
	const values = json.map(filterObject);

	arr.push(...values.sort((a, b) => a[1] - b[1]));

	for (const i in arr) {
		for (const j in arr[i]) {
			if (j == 0 || j == 1) continue;

			arr2.push([arr[i][0], arr[i][1], titles[j], arr[i][j]]);
		}
	}

	return arr2;
}

/**
 * Transforma un JSON y extrae a un array los valores
 * @param {JSON} item Elemento que recibe de una función en formato JSON
 * @returns Array de todos los valores de `item` menos el último
 */
const filterObject = (item) => Object.values(item).filter((_, i, arr) => i != arr.length - 1);

/**
 * Se establece el límite de las columnas de MetroValencia
 * @param {Array} arrStr Strings del Excel
 * @returns Todas las columnas hasta TOTAL VALENCIA del Excel
 */
const getTitlesSheet = (arrStr) => {
	let noTotal = true;

	const valencia = arrStr.filter((el) => {
		if (el.t == '%') noTotal = false; // % es el string que precede a TOTAL VALENCIA
		return noTotal;
	});

	return valencia.map((el) => el.t);
};

module.exports = { getDataExcel };
