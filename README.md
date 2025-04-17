# Aplicación de Clima con Autenticación

Este proyecto es una aplicación que demuestra la integración de varias tecnologías:

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
│   ├── components/          # Componentes de React
│   │   └── WeatherCard.js   # Componente para mostrar datos del clima
│   ├── contexts/            # Contextos de React
│   │   └── AuthContext.js   # Contexto para la autenticación con Keycloak
│   ├── pages/               # Páginas de Next.js
│   │   ├── _app.js          # Componente raíz de la aplicación
│   │   ├── index.js         # Página de inicio
│   │   ├── login.js         # Página de inicio de sesión
│   │   └── dashboard.js     # Dashboard principal (protegido)
│   ├── styles/              # Estilos CSS
│   │   └── globals.css      # Estilos globales
│   ├── public/              # Archivos públicos
│   │   └── silent-check-sso.html  # Página para silent check-sso de Keycloak
│   ├── package.json         # Dependencias de Node.js
│   ├── tailwind.config.js   # Configuración de Tailwind CSS
│   └── Dockerfile           # Configuración para construir la imagen Docker
│
├── kubernetes/              # Configuración para despliegue en Kubernetes
│   ├── backend/             # Recursos de Kubernetes para el backend
│   │   ├── deployment.yaml  # Deployment del backend
│   │   ├── service.yaml     # Servicio para el backend
│   │   └── configmap.yaml   # ConfigMap para variables de entorno
│   ├── frontend/            # Recursos de Kubernetes para el frontend
│   │   ├── deployment.yaml  # Deployment del frontend
│   │   ├── service.yaml     # Servicio para el frontend
│   │   └── ingress.yaml     # Ingress para exponer el frontend
│   └── apisix/              # Recursos de Kubernetes para APISIX
│       ├── deployment.yaml  # Deployment de APISIX
│       ├── service.yaml     # Servicio para APISIX
│       ├── ingress.yaml     # Ingress para exponer APISIX
│       └── configmap.yaml   # ConfigMap para la configuración de APISIX
│
└── README.md                # Este archivo
```

## Descripción de los Componentes

### Backend (FastAPI)

El backend es una API RESTful construida con FastAPI que proporciona:
- Endpoint para obtener datos del clima
- Verificación de tokens JWT emitidos por Keycloak
- Integración con una API externa de clima

### Frontend (Next.js)

El frontend es una aplicación web construida con Next.js que ofrece:
- Interfaz de usuario con Tailwind CSS
- Autenticación con Keycloak usando OpenID Connect
- Dashboard para mostrar datos del clima

### API Gateway (APISIX)

APISIX actúa como puerta de enlace para todas las solicitudes API:
- Verifica tokens JWT con Keycloak
- Enruta solicitudes autenticadas al backend
- Gestiona políticas CORS y seguridad

### Servidor de Autenticación (Keycloak)

Keycloak es utilizado como proveedor de identidad y acceso:
- Gestiona usuarios y roles
- Proporciona flujos de autenticación OAuth2/OpenID Connect
- Emite tokens JWT para usuarios autenticados

## Despliegue en Kubernetes

Este proyecto está configurado para ser desplegado en un clúster de Kubernetes (k3s). Los archivos de configuración se encuentran en el directorio `kubernetes/`.

### Requisitos previos

- Acceso a un clúster de Kubernetes (k3s)
- Keycloak instalado y configurado en `https://keycloak.cloud-it.com.ar`
- Ingress controller (como Traefik) configurado
- Cert-manager para certificados SSL (opcional pero recomendado)

### Despliegue

Para desplegar la aplicación:

1. Construir y publicar las imágenes Docker:
```bash
# Backend
docker build -t /clima-app-backend:latest ./backend
docker push /clima-app-backend:latest

# Frontend
docker build -t /clima-app-frontend:latest ./frontend
docker push /clima-app-frontend:latest
```

2. Aplicar configuraciones de Kubernetes:
```bash
kubectl apply -f kubernetes/backend/
kubectl apply -f kubernetes/apisix/
kubectl apply -f kubernetes/frontend/
```

3. Configurar Keycloak:
   - Crear un reino (realm) llamado `myrealm`
   - Crear un cliente para el frontend y otro para APISIX
   - Configurar los redirects URLs correctamente
   - Crear usuarios de prueba

## Flujo de la Aplicación

1. El usuario accede a la aplicación
2. Si no está autenticado, es redirigido a la página de login
3. Al iniciar sesión, es redirigido a Keycloak para autenticarse
4. Después de autenticarse, vuelve al dashboard de la aplicación
5. El frontend solicita datos del clima a través de APISIX
6. APISIX verifica el token JWT y redirige la solicitud al backend
7. El backend obtiene datos del clima y los devuelve al frontend
8. El frontend muestra los datos del clima en el dashboard

## Próximos Pasos

- Implementar más endpoints API
- Añadir base de datos para persistencia
- Implementar autorización basada en roles (RBAC)
- Mejorar la interfaz de usuario
- Añadir pruebas automatizadas


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
