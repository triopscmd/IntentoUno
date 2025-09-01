# Configuración del Proyecto

Este documento describe los archivos de configuración clave del proyecto y su propósito.

## Archivos de Configuración del Backend

*   `backend/package.json`: Este archivo define los metadatos de tu proyecto Node.js, incluyendo el nombre, la versión, las dependencias del proyecto (tanto de producción como de desarrollo) y los scripts que se pueden ejecutar (ej. `start`, `test`, `dev`). Será crucial para gestionar librerías como Express.js y el ORM.
*   `src/config/database.js`: Contiene la configuración específica para la conexión a la base de datos (ej. tipo de base de datos, host, puerto, nombre de usuario, contraseña). Permite centralizar los parámetros de conexión y adaptarlos fácilmente a diferentes entornos (desarrollo, producción).

## Archivos de Configuración del Frontend

El frontend utiliza Vite para el bundling y TypeScript para el desarrollo, lo que implica varios archivos de configuración importantes:

*   `frontend/package.json`: Similar al `package.json` del backend, este archivo gestiona las dependencias y scripts para el entorno de desarrollo frontend. Incluirá dependencias para React, Vite, TypeScript y posiblemente otras librerías de UI/styling.
*   `frontend/tsconfig.json`: El archivo de configuración principal de TypeScript para el frontend. Define las opciones del compilador de TypeScript, como la versión de ECMAScript a la que se compila el código, la gestión de módulos, rutas de inclusión/exclusión, etc. Es fundamental para garantizar la robustez y tipado del código JavaScript.
*   `frontend/tsconfig.node.json`: Un archivo de configuración de TypeScript complementario, a menudo utilizado para configurar TypeScript para el entorno de Node.js, específicamente para archivos de configuración de Vite que se ejecutan en Node.js, como `vite.config.ts`. Ayuda a diferenciar la configuración para el código cliente y el código de herramientas.
*   `frontend/vite.config.ts`: Este es el archivo de configuración de Vite. Aquí se definen aspectos como el servidor de desarrollo, cómo se empaquetan los assets, la configuración de los plugins (ej. para React), los alias de rutas y otras opciones de construcción y desarrollo. Es el cerebro detrás del proceso de compilación y servidor de desarrollo del frontend.