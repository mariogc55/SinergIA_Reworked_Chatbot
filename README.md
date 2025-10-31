# SinergIA: Plataforma de Integración y Orquestación con IA sobre la API de Jira para la Gestión de proyectos TI

SinergIA es un orquestador inteligente diseñado para automatizar la gestión de proyectos de Tecnología de la Información (TI). Integra la **Jira REST API** con la **Gemini API** a través de una interfaz de chat, utilizando **ServiceNow** para una autenticación segura de credenciales.

Nuestra arquitectura se basa en una **Arquitectura Orientada a Servicios (SOA)** implementada mediante un modelo de **Microservicios Desacoplados** y la **Arquitectura en Capas de Dominio (Hexagonal Ports / Adapters)**. Este enfoque garantiza la **escalabilidad, mantenibilidad, robusteza** y el **aislamiento de dependencias externas**.

---

## Logo del Proyecto

Puedes añadir el logo de SinergIA aquí usando un enlace a la imagen:

<img width="737" height="651" alt="Logotipo SInergIA" src="https://github.com/user-attachments/assets/402a0e1c-6ed4-4787-8428-af405538650d" />

---

## Estructura del Proyecto y Arquitectura

SinergIA se estructura en capas lógicas para segregar la lógica del negocio de la integración de sistemas externos. El backend constituye el **SinergIA Core** donde se aplica la **Arquitectura en Capas de Dominio (Hexagonal)**, aislando la lógica de negocio del dominio de las APIs externas.

### Vista Lógica y en Capas

| Componente | Capa Lógica | Rol Principal | Tecnologías |
| :--- | :--- | :--- | :--- |
| **Frontend Vue.js** | Presentación | Interfaz de Chat/Dashboard (UX) | Vue.js, Pinia, Axios |
| **MS-Orquestador** | Orquestación (Core) | **API Gateway** y Gestor de Flujo Central. Contiene la Lógica de Negocio y aplica el Patrón **Strategy**. | Node.js (Express/NestJS) |
| **MS-Integración** | Adaptadores/Integración | Adaptadores para **APIs Externas** (Jira, Gemini, ServiceNow/Auth). Implementa Patrones **Adapter** y **Facade**. | Node.js (Express/NestJS), Axios, @google/genai |
| **MS-Métricas** | PSP/Monitoreo | Cálculo y reporte de métricas de calidad y desempeño (PSP/ISO/EVM). | Node.js (Express/NestJS), PostgreSQL (`pg`) |

### Patrones de Diseño Aplicados

| Patrón | Aplicación Específica en SinergIA |
| :--- | :--- |
| **Singleton** | Asegura una única instancia para la gestión de la **Gemini API Key** y las credenciales críticas de **ServiceNow/Jira**, centralizando el control de seguridad (PETs). |
| **Adapter** | Normaliza las respuestas JSON de **Jira REST API** y **Gemini API** para que la Capa de Orquestación maneje objetos de dominio consistentes. |
| **Strategy** | Aplicar diferentes **estrategias de respuesta** de la IA, por ejemplo, para "Resumir Tareas" o "Analizar Riesgos". |
| **Facade** | Crea una interfaz simplificada para ocultar la complejidad de las múltiples llamadas necesarias a la **Jira REST API** (ej. `SinergiaFacade.crear_issue()`). |

---

## Flujo de Orquestación con Gemini (Ejemplo)

**Escenario de Uso:** Un usuario solicita por chat: *"Crea una tarea urgente en el proyecto SINERGIA para investigar el error X y asigna el riesgo como 'Medio'*.

1.  **Entrada y Autenticación:** El Chat envía la solicitud al **Motor de Solicitudes** de SinergIA. El motor consulta el **Adaptador ServiceNow** para autenticar y autorizar al usuario.
2.  **Llamada a Gemini (IA):** El **Gestor de Flujo** envía la solicitud al **Adaptador Gemini**.
3.  **Análisis de IA:** Gemini utiliza su modelo de `function calling` e identifica la función `crear_issue_jira`.
4.  **Respuesta de Gemini:** El modelo devuelve una respuesta estructurada (JSON) especificando los argumentos de la función, como `{"function": "crear_issue_jira", "args": {"titulo": "Investigar error X", "proyecto": "SINERGIA", "prioridad": "Urgente", "riesgo": "Medio"}}`.
5.  **Ejecución de Acción (Jira):** El **Gestor de Function Calling** recibe el JSON, utiliza el patrón **Adapter** para transformar los argumentos al formato exacto de la **Jira REST API**, y llama al **Adaptador Jira REST API** para crear la tarea.
6.  **Respuesta al Usuario:** El Gestor de Flujo formula una respuesta clara al usuario ("Tarea SINERGIA-123 creada y clasificada con riesgo medio").

---

## Integrantes del Equipo y Roles (PSP)

La siguiente tabla detalla la asignación de roles y responsabilidades clave del equipo de desarrollo, siguiendo las directrices de Ingeniería y Gestión de Proyectos TI:

| Integrante | Rol Principal (Título) | Foco de Responsabilidad |
| :--- | :--- | :--- |
| **Daniel** | Tester / Gestor de Calidad y Riesgos | Definición de Pruebas de Integración (Adaptadores) y el cumplimiento de las fórmulas PSP (PSPCalculator.js). Asegura el estándar ISO 9001 en el manejo de datos sensibles. |
| **Hilan** | Diseño - Analista / Gestor de Interesados | Diseño del Dashboard PSP/Métricas y la interfaz de Chatbot (Frontend). Documentación de Puertos e Interfaces (IEEE 29148). |
| **Mario** | Desarrollador / Gestor de Innovación y Arquitectura TI | Diseño e implementación del **MS-Orquestador** (Lógica Core/Strategy) y es **Accountable** (A) para el diseño del **MS-Métricas**. |
| **Raúl** | Planeador / Director del Proyecto / Gestor de Alcance y Cronograma | Liderazgo del proyecto, aplicación de PSP (Guía de Ejecución), y cálculo de métricas EVM (Valor Ganado). |

---

## Activación del Proyecto

El proyecto se organiza como un **Monorepo** que simula la separación de servicios. Debes instalar e iniciar cada componente en el siguiente orden para asegurar que el flujo de datos (Frontend -> Orquestador -> Adaptadores/Métricas) funcione bien.

### 1. Instalación de Dependencias:

Ejecuta `npm install` en la carpeta raíz de cada microservicio y el frontend:

| Componente | Carpeta (Ubicación) | Comando de Instalación |
| :--- | :--- | :--- |
| MS-Orquestador | `/ms-orquestador` | `cd ms-orquestador && npm install` |
| MS-Integración | `/ms-integracion` | `cd ms-integracion && npm install` |
| MS-Métricas | `/ms-metricas` | `cd ms-metricas && npm install` |
| Frontend Vue.js | `/frontend-vue` | `cd frontend-vue && npm install` |

### 2. Orden de Inicialización Paso a Paso:

Nota: // Recuerda colocar tus credenciales .env secrets de Gemini y Jira, son necesarias para que funcione. //

Abre **cuatro** (4) terminales separadas desde la carpeta raíz del proyecto (`/SinergIA`) y sigue el orden:

#### Paso 1: Inicializar Servicios de Soporte (Terminales 1 y 2):

| # | Componente | Propósito Arquitectónico | Puerto | Comando |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **MS-Integración** | Suministra Adaptadores (Gemini, Jira, ServiceNow). | 3001 | `cd ms-integracion && npm run dev` |
| **2** | **MS-Métricas** | Persistencia y lógica de PSP/PMBOK (PostgreSQL). | 3002 | `cd ms-metricas && npm run dev` |

#### Paso 2: Inicializar el API Gateway (Terminal 3):

| # | Componente | Propósito Arquitectónico | Puerto | Comando |
| :--- | :--- | :--- | :--- | :--- |
| **3** | **MS-Orquestador** | API Gateway y Lógica de Flujo. Debe estar arriba para recibir peticiones del Frontend. | **3000** | `cd ms-orquestador && npm run dev` |

#### Paso 3: Inicializar la Interfaz de Usuario (Terminal 4):

| # | Componente | Propósito Arquitectónico | Puerto | Comando |
| :--- | :--- | :--- | :--- | :--- |
| **4** | **Frontend Vue.js** | Capa de Presentación (Chatbot). Consumirá el puerto 3000. | 5173 | `cd frontend-vue && npm run dev` |

Una vez que los cuatro componentes estén corriendo, accede a la URL proporcionada por VITE (generalmente `http://localhost:5173/`) en tu navegador para comenzar a interactuar con SinergIA.
