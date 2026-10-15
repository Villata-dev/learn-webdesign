from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Learn WebDesign API")

# Configuración CORS: Permite que Next.js (puerto 3000) consulte esta API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Definimos qué datos esperamos recibir del frontend
class PeticionValidacion(BaseModel):
    codigo: str

@app.get("/")
def leer_raiz():
    return {"estado": "ok", "mensaje": "API en línea 🚀"}

@app.post("/api/validar")
def validar_codigo(peticion: PeticionValidacion):
    # Convertimos el código a minúsculas para facilitar la búsqueda
    codigo = peticion.codigo.lower()
    
    # 1. Comprobar si existe la etiqueta
    if "<h1>" not in codigo or "</h1>" not in codigo:
        return {"exito": False, "mensaje": "❌ Error: Te falta incluir la etiqueta <h1>."}
    
    # 2. Comprobar si cambió el texto original
    if "¡hola mundo!" in codigo:
        return {"exito": False, "mensaje": "❌ Error: Aún dice '¡Hola Mundo!'. Cámbialo por tu nombre."}

    # Si pasa las pruebas
    return {"exito": True, "mensaje": "✅ ¡Reto completado! Código perfecto."}