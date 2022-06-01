
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
