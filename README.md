# 🚀 DevRadar

<p align="center">
  <strong>Explora el mundo del desarrollo desde un solo lugar.</strong><br>
  Una plataforma web que reúne recursos tecnológicos, noticias, repositorios y conceptos de programación mediante distintas APIs.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/APIs-Integraciones-6C63FF" alt="Integración de APIs">
  <img src="https://img.shields.io/badge/Estado-En%20desarrollo-orange" alt="Estado del proyecto">
</p>

---

## 📌 Sobre el proyecto

**DevRadar** es una aplicación web pensada para estudiantes, desarrolladores y personas interesadas en la tecnología. Permite buscar un tema y consultar información relacionada desde una interfaz centralizada, evitando tener que visitar múltiples páginas para comenzar a investigar.

La aplicación integra servicios externos para reunir recursos útiles y presentar resultados relacionados con el término buscado. Además, muestra noticias tecnológicas recientes de forma predeterminada y permite consultar contenido específico cuando el usuario realiza una búsqueda.

## ✨ Funcionalidades principales

- 🔎 **Búsqueda por tema:** consulta tecnologías, herramientas y conceptos de programación.
- 📰 **Noticias tecnológicas:** muestra noticias recientes por defecto y permite buscar noticias relacionadas con un tema.
- 💻 **Repositorios de código:** facilita el descubrimiento de proyectos y recursos para aprender o colaborar.
- 📚 **Consulta de conceptos:** obtiene artículos y resúmenes de Wikipedia, con búsqueda por relevancia y respaldo en inglés cuando no hay resultados en español.
- 🔌 **Integración de APIs:** reúne información de distintos servicios externos desde una sola interfaz.
- 🧩 **Interfaz basada en React:** organiza los resultados en componentes reutilizables.
- ⚙️ **Backend con Node.js:** centraliza las consultas y la lógica de integración con los servicios externos.

> La disponibilidad y el contenido de los resultados dependen de cada API externa y de sus condiciones de servicio.

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| **React** | Construcción de la interfaz de usuario |
| **Node.js** | Ejecución del servidor backend |
| **Express** | Gestión de rutas HTTP, si está configurado en el proyecto |
| **JavaScript** | Lógica de frontend y backend |
| **APIs externas** | Obtención de noticias, repositorios y artículos |
| **CSS / HTML** | Estructura visual y estilos de la aplicación |

## 🗂️ Organización del proyecto

La estructura puede variar según la versión desplegada. La separación principal distingue el servidor y la interfaz:

```text
DevRadar/
├── servidor/
│   ├── apis/           # Integraciones con APIs externas
│   ├── rutas/          # Endpoints del backend
│   ├── servicios/      # Funciones compartidas y peticiones HTTP
│   └── server.js       # Inicio del servidor
├── interfaz/
│   └── src/
│       ├── componentes/ # Elementos reutilizables de la interfaz
│       ├── servicios/   # Comunicación con el backend
│       ├── estilos/    # Estilos visuales
│       ├── App.jsx      # Componente principal
│       └── main.jsx     # Punto de entrada de React
└── README.md
```

> Ajusta los nombres de las carpetas de este esquema si tu repositorio contiene una estructura diferente.

## 🚀 Instalación y ejecución local

### Requisitos

- [Node.js](https://nodejs.org/) instalado.
- npm, incluido con Node.js.
- Conexión a internet para consultar las APIs externas.

### 1. Clonar el repositorio

```bash
git clone URL_DE_TU_REPOSITORIO
cd DevRadar
```

Reemplaza `URL_DE_TU_REPOSITORIO` por la dirección real de tu repositorio de GitHub.

### 2. Instalar y ejecutar el backend

Abre una terminal:

```bash
cd servidor
npm install
npm run dev
```

Si el proyecto no tiene el script `dev`, revisa `servidor/package.json` y utiliza el comando definido allí, por ejemplo `npm start`.

### 3. Instalar y ejecutar el frontend

Abre una segunda terminal desde la carpeta raíz del proyecto:

```bash
cd interfaz
npm install
npm run dev
```

Vite mostrará en la terminal la dirección local de la aplicación, normalmente `http://localhost:5173`.

> Si el frontend necesita la URL del backend, configura la variable correspondiente en el archivo `.env` que indique el proyecto. No publiques credenciales ni claves privadas.

## 🔍 Ejemplo de uso

1. Ingresa a DevRadar desde el navegador.
2. Explora las noticias recientes que aparecen inicialmente.
3. Escribe un tema, por ejemplo `Java`, `React` o `árboles binarios`.
4. Revisa los resultados y abre los recursos que te interesen.
5. Prueba diferentes términos para descubrir artículos, repositorios y noticias relacionadas.

## 🔐 Variables de entorno y seguridad

Si alguna integración necesita claves de API:

- Guarda las claves en variables de entorno.
- No subas archivos `.env` con credenciales a GitHub.
- Incluye un `.env.example` con nombres de variables y valores de ejemplo no sensibles.
- Configura las variables necesarias también en la plataforma donde despliegues el backend.
- Consulta los límites de uso y las condiciones de cada servicio externo.

## 🌐 Despliegue

DevRadar está diseñado para separar la interfaz React del backend Node.js, por lo que ambos pueden desplegarse en servicios compatibles con sus tecnologías.

Para una publicación correcta:

1. Despliega el backend y verifica que sus endpoints respondan.
2. Configura en el frontend la URL pública del backend.
3. Despliega la interfaz React.
4. Comprueba que las peticiones entre frontend y backend estén permitidas por la configuración CORS.
5. Prueba las búsquedas desde la URL pública.

**Demo:** agrega aquí la URL pública cuando quieras compartir la aplicación.

**Repositorio:** agrega aquí la URL de GitHub.

## 🎯 Objetivo del proyecto

Centralizar recursos de consulta para el aprendizaje y la exploración de tecnologías, conectando información de distintas fuentes en una sola experiencia de búsqueda. DevRadar también sirve como proyecto práctico para trabajar con React, Node.js, APIs REST y organización modular del código.

## 🤝 Contribuciones

Las sugerencias y mejoras son bienvenidas:

1. Haz un fork del repositorio.
2. Crea una rama para tu cambio.
3. Realiza los cambios y pruébalos.
4. Envía un pull request con una explicación clara de la mejora.

## 📄 Licencia

Si deseas permitir la reutilización del código, agrega una licencia, por ejemplo MIT, y el archivo `LICENSE`. Si el proyecto todavía no tiene licencia, no se debe asumir que el código puede reutilizarse libremente.

---

<p align="center">
  Hecho con 💙 para explorar, aprender y desarrollar.
</p>
