# CHANGELOG

This log is intended to keep track of backwards-incompatible changes, including
but not limited to API changes and file location changes. Minor behavioral
changes may not be included if they are not expected to break existing code.

## v2.2.0

- Corrección de respuesta compatible con CORS
- Los datos de cada línea saca un valor individual de pasajeros por mes y año

## v2.1.0

- Se llamaba la antigua función ~~getJson~~, en vez de **getData** en la función **_getAll_**
- Carácter sin funcionalidad eliminado
- Ajustes de despliegue automático

## v2.0.0

- Las funciones se han separado en archivos
- Las funciones principales trabajan de forma más ágil
- Despliegue automático mediante GitHub Actions
- Actualización de la dependencias con Dependabot y GitHub Actions
- La función de **_scraping_** se ha generalizado para trabajar con los siguientes
 tipos de dato que se solicitan de los elementos HTML
  - Textos
  - Atributos
  - Elemento HTML
- El selector de _scraping_ trabaja con CSS del fichero HTML sin alterar
- Los nombres de las columnas de datos se obtienen del fichero Excel
- Los datos del Excel se agrupan en arrays simples
  - El primer array tiene los nombres de las columnas
- Los datos se ordenan del más antiguo al más reciente
- Nuevas constantes de extracción de datos
- Se ha agregado un función que consigue los datos de la red de FGV de MetroValencia
 ubicada en _/all_
- Las tablas de datos de la red tienen 2 clases (metro y m\*). **\*** es un número

## v1.0.0

- Consigue los datos de viajeros del Excel de FGV y los transforma a un JSON
- Se asignan nombres a las columnas
- Se filtran las filas si en Total Valencia no tiene ningún pasajero
- Las filas de Mes solo el año más antiguo tiene el campo con datos, se ha añadido
 un función que traslada el dato al siguiente año si no tiene datos:

  - Excel

    | Mes | Año | Total Líneas |
    | :--- | :---: | ---: |
    | Enero | 2021 | 2513928 |
    | | 2022 | 3667891 |
    | Febrero | 2021 | 2360436 |
    | | 2022 | 4358995 |

  - Salida

    | Mes | Año | Total Líneas |
    | :--- | :---: | ---: |
    | Enero | 2021 | 2513928 |
    | Enero | 2022 | 3667891 |
    | Febrero | 2021 | 2360436 |
    | Febrero | 2022 | 4358995 |
