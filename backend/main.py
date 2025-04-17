
# main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2AuthorizationCodeBearer
import httpx
import os
from typing import Dict, Any

app = FastAPI(title="API del Clima")

# Configuración CORS para permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://clima.cloud-it.com.ar"],  # URL del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Esquema de autenticación OAuth2 con flujo de código de autorización
# Este es solo un placeholder, APISIX manejará la autenticación real
oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl="https://keycloak.cloud-it.com.ar/realms/myrealm/protocol/openid-connect/auth",
    tokenUrl="https://keycloak.cloud-it.com.ar/realms/myrealm/protocol/openid-connect/token",
)

# Función para verificar el token JWT (en producción, verificaría la firma)
async def get_current_user(token: str = Depends(oauth2_scheme)):
    # En una implementación real, verificaríamos el token JWT aquí
    # Como APISIX se encargará de esto, simplemente devolvemos un usuario ficticio
    return {"sub": "usuario123", "name": "Usuario de Ejemplo"}

# API para obtener datos del clima
@app.get("/api/weather", summary="Obtener datos del clima")
async def get_weather(user: Dict[str, Any] = Depends(get_current_user)):
    """
    Obtiene los datos del clima actual para una ubicación predeterminada (Buenos Aires).
    Requiere autenticación.
    """
    try:
        # URL de la API del clima (OpenWeatherMap como ejemplo)
        weather_api_key = os.environ.get("WEATHER_API_KEY", "tu_api_key_aqui")
        location = "Buenos Aires"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.openweathermap.org/data/2.5/weather?q={location}&appid={weather_api_key}&units=metric"
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="No se pudo obtener la información del clima",
                )
                
            weather_data = response.json()
            
            # Simplificamos la respuesta para el frontend
            return {
                "location": location,
                "temperature": weather_data["main"]["temp"],
                "description": weather_data["weather"][0]["description"],
                "humidity": weather_data["main"]["humidity"],
                "user": user["name"]  # Incluimos el nombre del usuario autenticado
            }
    except Exception as e:
        # Para simplificar, si hay un error con la API del clima, usamos datos ficticios
        return {
            "location": "Buenos Aires",
            "temperature": 22.5,
            "description": "Cielo despejado",
            "humidity": 65,
            "user": user["name"]
        }

# Ruta para verificar el estado de la API
@app.get("/api/health", summary="Verificar estado de la API")
async def health_check():
    """
    Verifica que la API esté funcionando correctamente.
    No requiere autenticación.
    """
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)2AuthorizationCodeBearer(
    authorizationUrl="http://localhost:8080/auth/realms/myrealm/protocol/openid-connect/auth",
    tokenUrl="http://localhost:8080/auth/realms/myrealm/protocol/openid-connect/token",
)

# Función para verificar el token JWT (en producción, verificaría la firma)
async def get_current_user(token: str = Depends(oauth2_scheme)):
    # En una implementación real, verificaríamos el token JWT aquí
    # Como APISIX se encargará de esto, simplemente devolvemos un usuario ficticio
    return {"sub": "usuario123", "name": "Usuario de Ejemplo"}

# API para obtener datos del clima
@app.get("/api/weather", summary="Obtener datos del clima")
async def get_weather(user: Dict[str, Any] = Depends(get_current_user)):
    """
    Obtiene los datos del clima actual para una ubicación predeterminada (Buenos Aires).
    Requiere autenticación.
    """
    try:
        # URL de la API del clima (OpenWeatherMap como ejemplo)
        weather_api_key = os.environ.get("WEATHER_API_KEY", "tu_api_key_aqui")
        location = "Buenos Aires"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.openweathermap.org/data/2.5/weather?q={location}&appid={weather_api_key}&units=metric"
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="No se pudo obtener la información del clima",
                )
                
            weather_data = response.json()
            
            # Simplificamos la respuesta para el frontend
            return {
                "location": location,
                "temperature": weather_data["main"]["temp"],
                "description": weather_data["weather"][0]["description"],
                "humidity": weather_data["main"]["humidity"],
                "user": user["name"]  # Incluimos el nombre del usuario autenticado
            }
    except Exception as e:
        # Para simplificar, si hay un error con la API del clima, usamos datos ficticios
        return {
            "location": "Buenos Aires",
            "temperature": 22.5,
            "description": "Cielo despejado",
            "humidity": 65,
            "user": user["name"]
        }

# Ruta para verificar el estado de la API
@app.get("/api/health", summary="Verificar estado de la API")
async def health_check():
    """
    Verifica que la API esté funcionando correctamente.
    No requiere autenticación.
    """
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
