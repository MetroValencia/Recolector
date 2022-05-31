const { load, CheerioAPI } = require('cheerio');

/**
 * Busca en el documento y agrupa los datos de la red de FGV con la tabla y su título
 * @param {Document} html Documento html extraído de FGV
 * @returns Tablas y títulos de los datos de la red de FGV
 */
function tableJson(html) {
	try {
		const $ = load(html);

		const titulo = buscaTitulos($);
		const tabla = buscaTablas($);

		const datosRed = {
			generales: { titulo: titulo[0], tabla: tabla[0] },
			linea: { titulo: titulo[1], tabla: tabla[1] },
			PM: { titulo: titulo[2], tabla: tabla[2] },
		};

		return datosRed;
	} catch {}
}

/**
 * Extrae los elementos table del nodo y quita elemento innecesario devolviendo un array
 * @param {CheerioAPI} node Nodo cargado de cheerio
 * @returns Array de todas las tablas
 */
function buscaTablas(node) {
	const tabla = [];

	node('table').each(function (i, el) {
		tabla[i] = node(this)
			.removeAttr('class summary cellspacing cellpadding border width')
			.toggleClass(`metro m${i + 1}`)
			.toString()
			.replaceAll(/(\n|\*)/g, '') // Elimina el salto de linea y el carácter * del texto
			.replaceAll(',', '.');
	});

	return tabla;
}

/**
 * Extrae los elemento h3 del nodo y devuelve un array
 * @param {CheerioAPI} node Nodo cargado de cheerio
 * @returns Array de todos lo títulos de las tablas
 */
function buscaTitulos(node) {
	const titulo = [];

	node('h3').each(function (i) {
		titulo[i] = node(this).text();
	});

	return titulo;
}

module.exports = { tableJson };
