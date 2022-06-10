# MetroValencia Recolector

Esta es la aplicación encargada de recoger datos de Ferrocarriles de la Generalidad Valenciana (FGV en adelante).

Se usará AWS Lambda para solicitar los datos, por la alta disponibilidad que aporta.

Coge los datos de la web de FGV y los transforma de **_excel_** a **JSON** para un manejo más fácil.

URL de datos del Excel: [r4tq2dl33k.execute-api.eu-west-1.amazonaws.com](https://r4tq2dl33k.execute-api.eu-west-1.amazonaws.com/)

URL de todos los datos de FGV: [r4tq2dl33k.execute-api.eu-west-1.amazonaws.com/all](https://r4tq2dl33k.execute-api.eu-west-1.amazonaws.com/all)

## Requisitos de despliegue con AWS

- Tener una cuenta de AWS
- Crear credenciales en el IAM usando una de estas dos opciones
  - Permisos mínimos
    - AWSCloudFormationFullAccess
    - AWSLambda_FullAccess
    - AmazonAPIGatewayAdministrator
    - AmazonEventBridgeFullAccess
    - AmazonS3FullAccess
    - CloudWatchFullAccess
    - IAMFullAccess
  - Permisos de Administrador
    - AdministratorAccess
- Almacenar la clave de la API del usuario de AWS y la clave secreta (mantenerla a salvo)

## Estructura de data

La estructura varía dependiendo que función se esta usando, si se llama a la URL de los _datos del Excel_ solo proporcionará **_body.doc_**, y _body.red_ no aparecerá.

### Estructura completa

```jsonc
"body": {
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

- Muestra de datos de **_body > doc > meses_**:

![image](https://user-images.githubusercontent.com/36056518/173154484-e7e2b672-a70c-475c-a0a1-b05d62c69161.png#gh-light-mode-only)
![image](https://user-images.githubusercontent.com/36056518/173154260-dd6ff3f3-2e34-4ccd-ae8d-e3b800826acb.png#gh-dark-mode-only)

- Tablas **_body > red_**:

La tabla tiene dos clases incorporadas (metro y m*), **m\*** hace la distinción para aplicar un estilo concreto a esa tabla

\*: Es igual al nivel que tiene en red del 1 al 3. _generales_ tiene la class m1, _linea_ m2, _PM_ m3
