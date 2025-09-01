# Proyecto: Generador de Exámenes Primaria

## 1. Visión General del Proyecto

Este proyecto tiene como objetivo desarrollar una aplicación web para generar exámenes tipo test válidos para asignaturas de primaria (matemáticas, biología, geología, física, química, etc.), desde primero hasta sexto grado. La aplicación permitirá preguntas con una o varias respuestas correctas, siempre con 5 opciones posibles por pregunta. Al completar un examen, el usuario recibirá feedback de mejora y una puntuación.

El plan de desarrollo se estructura en fases lógicas, siguiendo las dependencias entre las distintas funcionalidades para asegurar una implementación coherente y robusta.

## 2. Fases del Proyecto y Características Detalladas

### Fase 1: Configuración Core y Modelo de Datos

Esta fase sienta las bases de la aplicación, estableciendo el modelo de datos fundamental y la persistencia.

#### Característica: Core Data Model & Persistence (ID: `data-model`)

*   **Descripción:** Define el esquema de la base de datos fundamental y proporciona métodos para el almacenamiento y recuperación de datos para todas las entidades de la aplicación. Servirá como la espina dorsal para todas las demás características que requieran interactuar con la base de datos.
*   **Archivos Clave:**
    *   `src/database/schema.sql`: Definición del esquema de la base de datos (tablas para usuarios, asignaturas, grados, preguntas, respuestas, exámenes, resultados de exámenes).
    *   `src/models/index.js`: Configuración del ORM (Object-Relational Mapping) y asociaciones entre los diferentes modelos de datos.
    *   `src/config/database.js`: Configuración de la conexión a la base de datos.

### Fase 2: Gestión de Usuarios y Contenido

Esta fase se centra en la gestión de usuarios, asignaturas, grados y el banco de preguntas, construyendo sobre el modelo de datos.

#### Característica: User Authentication & Authorization (ID: `user-auth`)

*   **Descripción:** Gestiona el registro de usuarios, el inicio de sesión, la administración de sesiones y el control de acceso para diferentes roles de usuario. Es crucial para asegurar que solo los usuarios autorizados puedan acceder a ciertas funcionalidades.
*   **Dependencias:** `data-model`
*   **Archivos Clave:**
    *   `src/routes/auth.js`: Rutas API para el registro y el inicio de sesión de usuarios.
    *   `src/controllers/authController.js`: Lógica de negocio para las operaciones de autenticación (registro, login, logout).
    *   `src/models/User.js`: Definición del modelo de usuario en la base de datos.
    *   `src/middleware/authMiddleware.js`: Middleware para la gestión de tokens JWT o sesiones y la verificación de autenticación.

#### Característica: Subject & Grade Management (ID: `subject-grade-mgmt`)

*   **Descripción:** Permite la creación, edición y organización de las asignaturas de primaria y sus correspondientes niveles de grado (de primero a sexto). Es esencial para clasificar las preguntas y los exámenes.
*   **Dependencias:** `data-model`
*   **Archivos Clave:**
    *   `src/routes/subjects.js`: Rutas API para la gestión de asignaturas y grados.
    *   `src/controllers/subjectController.js`: Lógica de negocio para la creación, lectura, actualización y eliminación de asignaturas y grados.
    *   `src/models/Subject.js`: Definición del modelo para las asignaturas.
    *   `src/models/Grade.js`: Definición del modelo para los grados (niveles de primaria).

#### Característica: Question Bank Management (ID: `question-bank-mgmt`)

*   **Descripción:** Proporciona una interfaz para crear, editar y organizar preguntas tipo test, incluyendo cinco posibles respuestas y la marcación de una o varias como correctas. Este será el corazón del contenido de los exámenes.
*   **Dependencias:** `data-model`, `subject-grade-mgmt`
*   **Archivos Clave:**
    *   `src/routes/questions.js`: Rutas API para la gestión de preguntas.
    *   `src/controllers/questionController.js`: Lógica de negocio para la creación, lectura, actualización y eliminación de preguntas y sus respuestas.
    *   `src/models/Question.js`: Definición del modelo para las preguntas del examen.
    *   `src/models/Answer.js`: Definición del modelo para las opciones de respuesta de cada pregunta.

### Fase 3: Lógica de Examen e Interfaz

Esta fase implementa la generación de exámenes y la interfaz de usuario para realizarlos.

#### Característica: Exam Generation Engine (ID: `exam-generation-engine`)

*   **Descripción:** Implementa la lógica para generar dinámicamente exámenes tipo test seleccionando preguntas basándose en asignaturas y niveles de grado especificados. Esto garantiza la personalización de los exámenes.
*   **Dependencias:** `data-model`, `question-bank-mgmt`
*   **Archivos Clave:**
    *   `src/services/examGenerator.js`: Lógica central para la selección y compilación de preguntas en un examen.
    *   `src/models/Exam.js`: Definición del modelo para una instancia de examen generada (almacena las preguntas específicas para un examen dado).

#### Característica: Exam Taking User Interface (ID: `exam-taking-interface`)

*   **Descripción:** Proporciona una interfaz web intuitiva para que los estudiantes realicen los exámenes tipo test generados y envíen sus respuestas. Esta interfaz debe ser clara y fácil de usar para los niños de primaria.
*   **Dependencias:** `exam-generation-engine`, `user-auth`
*   **Archivos Clave:**
    *   `src/routes/exams.js`: Rutas API para interactuar con los exámenes (iniciar, obtener preguntas, enviar respuestas).
    *   `src/controllers/examController.js`: Lógica para mostrar los exámenes y procesar las respuestas enviadas por los estudiantes.
    *   `src/views/examTaking.ejs`: Plantilla de vista (EJS/HTML) para la interfaz de toma de exámenes.
    *   `public/js/examClient.js`: Código JavaScript frontend para la interacción dinámica del usuario con el examen (temporizador, navegación, etc.).

### Fase 4: Retroalimentación y Reportes

Esta fase se enfoca en proporcionar feedback a los estudiantes y reportes de rendimiento.

#### Característica: Scoring & Feedback System (ID: `scoring-feedback-system`)

*   **Descripción:** Calcula las puntuaciones de los exámenes, proporciona retroalimentación inmediata sobre respuestas correctas/incorrectas y ofrece sugerencias de mejora al estudiante después de completar el examen. Fundamental para el proceso de aprendizaje.
*   **Dependencias:** `exam-taking-interface`, `question-bank-mgmt`
*   **Archivos Clave:**
    *   `src/services/scoreCalculator.js`: Lógica para comparar las respuestas del usuario con las respuestas correctas y calcular la puntuación.
    *   `src/controllers/feedbackController.js`: Lógica para generar y presentar el feedback detallado y las sugerencias de mejora.
    *   `src/models/ExamResult.js`: Definición del modelo para almacenar los resultados del examen de un estudiante.

#### Característica: Performance Reporting (ID: `performance-reporting`)

*   **Descripción:** Muestra el historial de rendimiento del estudiante, rastreando puntuaciones y progreso a lo largo de múltiples exámenes para varias asignaturas. Permite a los padres y educadores monitorizar el avance.
*   **Dependencias:** `scoring-feedback-system`, `user-auth`
*   **Archivos Clave:**
    *   `src/routes/reports.js`: Rutas API para obtener informes de rendimiento.
    *   `src/controllers/reportController.js`: Lógica para generar y filtrar los datos de rendimiento para los informes.
    *   `src/views/performanceReport.ejs`: Plantilla de vista (EJS/HTML) para mostrar los informes de rendimiento.

## 3. Consideraciones Adicionales

*   **Tecnologías:** Se recomienda el uso de Node.js con Express.js para el backend, una base de datos relacional (ej. PostgreSQL o MySQL) y EJS/HTML/CSS/JavaScript para el frontend.
*   **Control de Versiones:** Git y GitHub serán utilizados para el control de versiones del código fuente.
*   **Despliegue:** Se planificará un entorno de desarrollo, staging y producción.

Este plan proporciona una guía clara para el desarrollo de la aplicación, asegurando que todas las funcionalidades críticas sean abordadas de manera estructurada y eficiente.