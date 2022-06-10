const axios = require('axios');
const Con = require('./Javascript/constants');
const { getDataExcel } = require('./Javascript/xlsxJson');
const { scrapeDataUrl } = require('./Javascript/scrape');
const { tableJson } = require('./Javascript/tableJson');

const headers = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Method': 'GET',
	'Content-Type': 'application/vnd.api+json',
};

/**
 * Función principal para conseguir los datos de MetroValencia almacenado en el Excel
 * @returns Respuesta de datos en formato JSON
 */
async function getData() {
	let status = 200;
	let ok = true;
	let statusText = 'Ok';
	let data;

	try {
		const url = await scrapeDataUrl(Con.URLExcel, Con.selectorExcel, 'attr', 'href');

		const doc = await axios({
			url,
			method: 'get',
			responseType: 'arraybuffer',
		});

		const date = new Date(doc.headers['last-modified']);

		if (doc.status >= 200 && doc.status <= 299) {
			data = getDataExcel(date, doc.data);
		} else throw new Error();
	} catch (e) {
		status = 502;
		ok = false;
		statusText = 'Bad Gateway';
		data = 'Can not get data';
	}

	return { headers, status, statusCode: status, ok, statusText, body: JSON.stringify(data) };
}

/**
 * Obtiene los datos del Excel devuelve los datos de la infraestructura de MetroValencia
 * @returns Respuesta de datos en formato JSON
 */
async function getAll() {
	let status = 200;
	let ok = true;
	let statusText = 'Ok';
	let data;

	try {
		const DRED = (await scrapeDataUrl(Con.URLData, Con.selectorData)).toString();

		const resp = await getData();

		if (resp.ok) {
			data = JSON.parse(resp.body);

			data.red = tableJson(DRED);
		} else throw new Error();
	} catch (e) {
		status = 502;
		ok = false;
		statusText = 'Bad Gateway';
		data = 'Can not get all data';
	}

	return { headers, status, statusCode: status, ok, statusText, body: JSON.stringify(data) };
}

module.exports = { getData, getAll };
