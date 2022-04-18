const axios = require('axios');
const { WorkBook, utils, read } = require('xlsx');
const { load } = require('cheerio');

const URLHtml = 'https://www.fgv.es/transparencia/categoria.php?id=8';
const selectorP = '#cat-8 > div > ul > li:nth-child(1) > ul > ';
const selectorURL = `${selectorP}li:nth-child(1) > a`;
const selectorDate = `${selectorP}li:nth-child(2) > div > div:nth-child(2) > span`;

/**
 * Transforma los datos del archivo a JSON
 * @param {WorkBook} workBook Archivo que puede ser leído
 * @returns {{meses: Array<JSON>, acumulado: Array<JSON>}} JSON de las hojas del documento
 */
function wBtoJson(workBook) {
	const workSheets = {};

	for (const sheetName of workBook.SheetNames) {
		workSheets[sheetName] = utils.sheet_to_json(workBook.Sheets[sheetName], {
			// Se asignan nombre a las columnas
			header: ['Mes', 'Any', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'Total'],
			defval: '',
		});

		// Asigna el mes a la siguiente fila si esta vacía
		let mes;
		workSheets[sheetName].forEach((e) => {
			!e?.Mes ? (e.Mes = mes) : (mes = e.Mes);
		});

		// Se descartan las filas que que no tienen datos
		workSheets[sheetName] = workSheets[sheetName].filter((e) => e.Total >= 1 && !isNaN(e.Total));
	}

	const { 'B21 por meses': meses, 'B21 acumulado': acumulado } = workSheets;
	return { meses, acumulado };
}

/**
 * Función que lee el archivo excel y transforma los datos a JSON
 * @param {Date} date Última fecha publicada del archivo
 * @param {WorkBook} document Archivo excel que contiene los datos de MetroValencia
 * @returns Datos en formato JSON
 */
function getData(date, document) {
	const workBook = read(document);

	const { meses, acumulado } = wBtoJson(workBook);

	return { date, meses, acumulado };
}

/**
 * Función principal para conseguir los datos de MetroValencia
 * @returns Respuesta de datos en formato JSON
 */
async function getJson() {
	try {
		const { url, date } = await scrapeData(URLHtml);

		const doc = await axios({
			url,
			method: 'get',
			responseType: 'arraybuffer',
		});

		if (doc.status >= 200 && doc.status <= 299) {
			const body = getData(date, doc.data);

			return JSON.stringify({ status: 200, statusCode: 200, statusText: 'Ok', body });
		}

		throw new Error();
	} catch (e) {
		return JSON.stringify({ status: 502, statusCode: 502, statusText: 'Bad Gateway', body: 'Can not get data' });
	}
}

/**
 * @param {URL} urlHtml URL de la página dónde se encuentra el enlace del documento excel
 * @returns {Promise<{date:Date, url:URL}>} Devuelve un JSON que contiene la fecha y url del excel
 */
async function scrapeData(urlHtml) {
	const { data, status } = await axios({
		url: urlHtml,
		method: 'get',
	});

	if (status >= 200 && status <= 299) {
		const $ = load(data);

		const url = $(selectorURL).attr('href');
		const date = $(selectorDate).text();

		return { url, date };
	}

	throw new Error();
}

module.exports.getJson = getJson;
