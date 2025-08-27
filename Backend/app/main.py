from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import dashboard
from app.routers import products, stores, sales, users

app = FastAPI(title="Sistema Ventas & Inventario")

# 1️⃣ CORS primero, antes de registrar los routers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 👈 En desarrollo aceptamos todos los orígenes
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos HTTP
    allow_headers=["*"],  # Permitir todas las cabeceras
)

# 2️⃣ Registrar routers después

app.include_router(users.router)
app.include_router(products.router)
app.include_router(stores.router)
app.include_router(sales.router)
app.include_router(dashboard.router)  # ✅ aquí montas el router



# 3️⃣ Ruta base opcional
@app.get("/")
def home():
    return {"message": "API Ventas e Inventario funcionando"}