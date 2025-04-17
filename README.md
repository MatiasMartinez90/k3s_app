# Aplicación de Clima con Autenticación

Este proyecto es una aplicación simple que demuestra la integración de varias tecnologías:

- **Frontend**: Next.js
- **Backend**: FastAPI
- **API Gateway**: Apache APISIX
- **Autenticación**: Keycloak

La aplicación permite a los usuarios autenticarse y ver información del clima.

## Estructura del Proyecto

```
/
├── backend/                 # Servicio de backend con FastAPI
│   ├── main.py              # Código principal de la API
│   ├── requirements.txt     # Dependencias de Python
│   └── Dockerfile           # Configuración para construir la imagen Docker
│
├── frontend/                # Aplicación frontend con Next.js
│   ├── contexts/            # Contextos de React
│   │   └── AuthContext.js   # Contexto para la autenticación con Keycloak
│   ├── pages/               # Páginas de Next.js
│   │   ├── _app.js          # Componente raíz de la aplicación
│   │   ├── index.js         # Página de inicio
│   │   ├── login.js         # Página de inicio de sesión
│   │   └── dashboard.js     # Dashboard principal (protegido)
│   ├── package.json         # Dependencias de Node.js
│   └── Dockerfile           # Configuración para construir la imagen Docker
│
├── apisix-config.yaml       # Configuración para Apache APISIX
├── docker-compose.yml       # Configuración para Docker Compose
└── README.md                # Este archivo
```

## Requisitos Previos

- Docker y Docker Compose
- Cuenta en OpenWeatherMap (opcional, para obtener una API key real)

## Configuración Inicial

1. Clona este repositorio
   ```bash
   git clone <url-del-repositorio>
   cd <nombre-del-repositorio>
   ```

2. Actualiza la API key del clima en el archivo `docker-compose.yml`
   ```yaml
   backend:
     environment:
       - WEATHER_API_KEY=tu_api_key_aqui  # Reemplazar con tu clave de API real
   ```

## Ejecución de la Aplicación

1. Inicia todos los servicios con Docker Compose
   ```bash
   docker-compose up -d
   ```

2. Configura Keycloak siguiendo las instrucciones en el archivo `keycloak-config.md`

3. Una vez que todos los servicios estén en funcionamiento, accede a la aplicación:
   - Frontend: http://localhost:3000
   - Keycloak: http://localhost:8080
   - APISIX Dashboard (si está habilitado): http://localhost:9000
   - API Backend (directamente): http://localhost:8000/docs

## Flujo de la Aplicación

1. El usuario accede a la aplicación en `http://localhost:3000`
2. Al no estar autenticado, es redirigido a la página de login
3. Al hacer clic en "Iniciar Sesión con Keycloak", es redirigido a la pantalla de login de Keycloak
4. Después de iniciar sesión con éxito, el usuario es redirigido al dashboard
5. El frontend solicita datos del clima a través de APISIX (`http://localhost:9080/api/weather`)
6. APISIX verifica el token JWT y, si es válido, redirige la solicitud al backend
7. El backend procesa la solicitud, obtiene datos del clima y los devuelve al frontend
8. El frontend muestra los datos del clima en el dashboard

## Interacción de Componentes

```
Usuario <-> Frontend (Next.js) <-> APISIX <-> Backend (FastAPI)
                 ^                   ^
                 |                   |
                 +----- Keycloak ----+
```

1. **Frontend (Next.js)**:
   - Proporciona la interfaz de usuario
   - Gestiona la autenticación del lado del cliente con Keycloak
   - Comunica con el backend a través de APISIX

2. **APISIX (API Gateway)**:
   - Actúa como puerta de enlace para todas las solicitudes API
   - Verifica tokens JWT con Keycloak
   - Enruta las solicitudes autenticadas al backend

3. **Backend (FastAPI)**:
   - Proporciona endpoints API para obtener datos del clima
   - Se comunica con servicios externos (API del clima)
   - Procesa y devuelve datos al frontend

4. **Keycloak**:
   - Gestiona la autenticación y autorización
   - Emite tokens JWT para usuarios autenticados
   - Proporciona funcionalidad de inicio y cierre de sesión

## Solución de Problemas

- **CORS**: Si experimentas problemas de CORS, verifica la configuración en FastAPI y APISIX
- **Autenticación**: Asegúrate de que los clientes en Keycloak estén configurados correctamente
- **Tokens**: Verifica que los tokens JWT se pasen correctamente entre componentes
- **Logs**: Revisa los logs de cada servicio para identificar problemas específicos

## Próximos Pasos

Para expandir esta aplicación, considera:

1. Añadir más endpoints API en el backend
2. Implementar autorización basada en roles (RBAC)
3. Añadir persistencia de datos con una base de datos
4. Mejorar la interfaz de usuario con más funcionalidades
5. Implementar pruebas automatizadas

## Licencia

Este proyecto se distribuye bajo la licencia MIT.
