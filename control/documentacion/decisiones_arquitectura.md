# Decisiones de Arquitectura Clave

Este documento detalla las decisiones arquitectónicas fundamentales tomadas para el proyecto "Generador de Exámenes Primaria".

## 1. Estructura del Proyecto: Monorepo Lógico

Se ha optado por una estructura de repositorio que organiza el backend y el frontend en carpetas separadas (`backend/` y `frontend/`). Aunque no es un monorepo estricto con herramientas como Lerna o Nx, lógicamente permite mantener ambos componentes del proyecto en un mismo repositorio para facilitar la colaboración, el control de versiones y el despliegue coherente. Esto simplifica la gestión de dependencias compartidas y el versionado conjunto.

## 2. Tecnologías del Backend

*   **Node.js & Express.js:** Se eligió Node.js por su rendimiento en operaciones I/O intensivas (perfecto para un servidor API) y Express.js como framework web minimalista y flexible. Esta combinación permite construir APIs RESTful de manera eficiente y escalable.
*   **Base de Datos Relacional (PostgreSQL/MySQL):** La naturaleza estructurada de los datos del proyecto (usuarios, asignaturas, preguntas, respuestas, exámenes, resultados) se adapta perfectamente a un modelo relacional. Esto asegura integridad referencial, transacciones ACID y consultas complejas eficientes. La elección específica entre PostgreSQL o MySQL dependerá de requisitos futuros, pero ambos son opciones robustas.
*   **ORM (Object-Relational Mapping):** Se utilizará un ORM (ej., Sequelize o TypeORM) para interactuar con la base de datos. Esto abstrae la lógica SQL, facilita el desarrollo, reduce errores y permite un manejo más orientado a objetos de los modelos de datos.
*   **Autenticación/Autorización:** Se implementará un sistema de autenticación basado en sesiones o tokens (como JWT) para gestionar el acceso de usuarios y asegurar que solo los roles autorizados puedan realizar ciertas acciones. Esto será gestionado mediante middleware en Express.js.

## 3. Tecnologías del Frontend

*   **Vite:** Se eligió Vite como herramienta de construcción y servidor de desarrollo para el frontend. Vite ofrece una experiencia de desarrollo extremadamente rápida gracias a su enfoque de "no-bundle" durante el desarrollo y su uso de ES Modules nativos del navegador. Esto acelera el feedback del desarrollador.
*   **React:** Como biblioteca principal para la interfaz de usuario. React permite construir interfaces interactivas y reactivas mediante un modelo basado en componentes, facilitando la modularidad y el mantenimiento del código UI.
*   **TypeScript:** Se utilizará TypeScript para todo el desarrollo frontend. La tipificación estática mejora la detectabilidad de errores en tiempo de desarrollo, aumenta la legibilidad del código y facilita el refactoring, lo que es crucial para proyectos a gran escala y equipos colaborativos.
*   **HTML/CSS/JavaScript con EJS:** Aunque el `Plan del Proyecto` menciona EJS, la presencia de `App.tsx`, `main.tsx`, `vite.config.ts`, y `tsconfig.json` indica una preferencia por un Single Page Application (SPA) con React/TypeScript. Las vistas EJS podrían ser consideradas para páginas sencillas o si se decide una arquitectura híbrida, pero el core del desarrollo frontend se orientará a React.

## 4. Estructura de APIs RESTful

El backend expondrá una API RESTful para la comunicación con el frontend. Se seguirán los principios REST para la definición de rutas, métodos HTTP y formatos de respuesta (JSON). Esto garantiza una interfaz de comunicación clara, predecible y escalable entre el cliente y el servidor.

## 5. Desarrollo Guiado por Pruebas (TDD)

Se ha adoptado TDD como metodología principal de desarrollo. Esto implica escribir pruebas unitarias y de integración antes de escribir el código de implementación. Esta decisión asegura una alta cobertura de pruebas, reduce la introducción de bugs, mejora la calidad del diseño del código y facilita el refactoring.

## 6. Integración Continua (CI)

Se implementará un pipeline de CI para automatizar la construcción, prueba y validación del código en cada cambio. Esto incluye la ejecución automática de pruebas unitarias/integración, análisis de calidad de código y despliegue a entornos de staging/previsualización. La CI es fundamental para detectar errores tempranamente y mantener un estado de código siempre desplegable.