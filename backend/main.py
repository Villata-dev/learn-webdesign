from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

# Importamos nuestra base de datos y modelos
from database import engine, SessionLocal
import models

# Crea el archivo database.db y las tablas si no existen
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Learn WebDesign API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Función para abrir y cerrar la conexión a la base de datos en cada petición
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class PeticionValidacion(BaseModel):
    codigo: str
    usuario: str = "Francisco" # Usaremos tu nombre por ahora

@app.get("/api/progreso/{nombre_usuario}")
def obtener_progreso(nombre_usuario: str, db: Session = Depends(get_db)):
    # Buscamos al usuario en la base de datos
    usuario = db.query(models.Usuario).filter(models.Usuario.nombre == nombre_usuario).first()
    
    # Si no existe (es la primera vez que entra), lo creamos con 0%
    if not usuario:
        usuario = models.Usuario(nombre=nombre_usuario, progreso=0)
        db.add(usuario)
        db.commit()
        db.refresh(usuario)
        
    return {"progreso": usuario.progreso}

@app.post("/api/validar")
def validar_codigo(peticion: PeticionValidacion, db: Session = Depends(get_db)):
    codigo = peticion.codigo.lower()
    
    if "<h1>" not in codigo or "</h1>" not in codigo:
        return {"exito": False, "mensaje": "❌ Error: Te falta incluir la etiqueta <h1>."}
    
    if "¡hola mundo!" in codigo:
        return {"exito": False, "mensaje": "❌ Error: Aún dice '¡Hola Mundo!'. Cámbialo por tu nombre."}

    # Si pasa las pruebas, actualizamos su progreso al 100% en la base de datos
    usuario = db.query(models.Usuario).filter(models.Usuario.nombre == peticion.usuario).first()
    if usuario:
        usuario.progreso = 100
        db.commit()

    return {"exito": True, "mensaje": "✅ ¡Reto completado! Progreso guardado en la base de datos."}