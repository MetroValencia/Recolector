const axios = require('axios');
const Con = require('./Javascript/constants');
const { getDataExcel } = require('./Javascript/xlsxJson');
const { scrapeDataUrl } = require('./Javascript/scrape');
const { tableJson } = require('./Javascript/tableJson');

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

	return JSON.stringify({ status, statusCode: status, ok, statusText, data });
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

		const excel = JSON.parse(await getData());

		if (excel.ok) {
			data = excel.data;

			data.red = tableJson(DRED);
		} else throw new Error();
	} catch (e) {
		status = 502;
		ok = false;
		statusText = 'Bad Gateway';
		data = 'Can not get all data';
	}

	return JSON.stringify({ status, statusCode: status, ok, statusText, data });
}

module.exports = { getData, getAll };
