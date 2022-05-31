const { default: axios, AxiosError } = require('axios');
const { load } = require('cheerio');

/**
 * Llama una página consigue el HTML y devuelve los datos solicitados
 * @param {URL} urlHtml URL de la página desde donde sacar la información
 * @param {String} selector Cadena de búsqueda en html
 * @param {String} type Tipo de método que se usará para conseguir los datos, *por defecto **devuelve el elemento del selector***, opciones válidas:
 * - attr : require `attrElem`
 * - text
 * @param {String} attrElem Depende de si el tipo es un atributo
 * @returns Devuelve el contenido solicitado
 */
async function scrapeDataUrl(urlHtml, selector, type = '', attrElem = '') {
	try {
		const { data, status } = await axios({
			url: urlHtml,
			method: 'get',
		});

		if (status >= 200 && status <= 299) {
			return scrapeData(data, selector, type, attrElem);
		}

		throw new AxiosError('El sitio web no funciona', status);
	} catch {}
}

/**
 *  Extrae los datos solicitados de la estructura HTML
 * @param {HTMLElement} html Estructura de HTML
 * @param {String} selector Cadena de búsqueda en html
 * @param {String} type Tipo de método que se usará para conseguir los datos, *por defecto **devuelve el elemento del selector***, opciones válidas:
 * - attr : require `attrElem`
 * - text
 * @param {String} attrElem Depende de si el tipo es un atributo
 * @returns Devuelve el contenido solicitado
 */
function scrapeData(html, selector, type = '', attrElem = '') {
	const $ = load(html);

	switch (type) {
		case 'attr':
			return $(selector).attr(attrElem);

		case 'text':
			return $(selector).text();

		default:
			return $(selector);
	}
}

module.exports = { scrapeData, scrapeDataUrl };
