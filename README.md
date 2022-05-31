# MetroValencia Recolector

Esta es la aplicación encargada de recoger datos de Ferrocarriles de la Generalidad Valenciana (FGV en adelante).

Se usará AWS Lambda para solicitar los datos, por la alta disponibilidad que aporta.

Coge los datos de la web de FGV y los transforma de **_excel_** a **JSON** para un manejo más fácil.

URL de datos del Excel: [5yic5dar2a.execute-api.eu-central-1.amazonaws.com](https://5yic5dar2a.execute-api.eu-central-1.amazonaws.com/)

URL de todos los datos de FGV: [5yic5dar2a.execute-api.eu-central-1.amazonaws.com/all](https://5yic5dar2a.execute-api.eu-central-1.amazonaws.com/all)

## Requisitos de despliegue con AWS

- Tener una cuenta de AWS
- Crear credenciales en el IAM con los permisos mínimos para su despliegue o crear con permisos de Administrador
  - IAMFullAccess
  - AmazonS3FullAccess
  - CloudWatchFullAccess
  - AWSCloudFormationFullAccess
  - AWSLambda_FullAccess
  - AmazonAPIGatewayInvokeFullAccess
- Almacenar la clave de la API del usuario de AWS y la clave secreta (mantenerla a salvo)

## Estructura de data

La estructura varía dependiendo que función se esta usando, si se llama a la URL de los _datos del Excel_ solo proporcionará **_data.doc_**, y _data.red_ no aparecerá.

```jsonc
"data": {
  "doc": {
    "date": "Date", // Fecha de la última modificación del Excel
    "meses": "[Array]", // El primer array tiene el nombre de las columnas (en meses y acumulado)
    "acumulado": "[Array]"
  },
  "red": {
    "generales": {
      "titulo": "String", // Título de la tabla
      "tabla": "String" // Tabla de HTML sin los estilos de FGV
    },
    "linea": {
      "titulo": "String",
      "tabla": "String"
    },
    "PM": {
      "titulo": "String",
      "tabla": "String"
    }
  }
}
```

La tabla tiene dos clases incorporadas (metro y m*), **m\*** hace la distinción para aplicar un estilo concreto a esa tabla

\*: Es igual al nivel que tiene en red del 1 al 3. _generales_ tiene la class m1, _linea_ m2, _PM_ m3
