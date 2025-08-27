from datetime import date
from fastapi import Query

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import extract, func

from app import database
from app.models import Sale, Product, Store, User
from app.schemas import SaleByMonth, DashboardMetrics

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/metricas", response_model=DashboardMetrics)
def obtener_metricas(db: Session = Depends(get_db)):
    total_productos = db.query(Product).count()
    total_tiendas = db.query(Store).count()
    total_ventas = db.query(Sale).count()
    total_usuarios = db.query(User).count()

    return {
        "productos": total_productos,
        "tiendas": total_tiendas,
        "ventas": total_ventas,
        "usuarios": total_usuarios
    }

@router.get("/ventas-por-mes-filtrado", response_model=list[SaleByMonth])
def ventas_por_mes_filtrado(
    start: date = Query(...),
    end: date = Query(...),
    db: Session = Depends(get_db)
):
    resultados = (
        db.query(
            extract('month', Sale.created_at).label('mes'),
            func.sum(Sale.total).label('total')
        )
        .filter(Sale.created_at >= start, Sale.created_at <= end)
        .group_by(extract('month', Sale.created_at))
        .order_by(extract('month', Sale.created_at))
        .all()
    )

    def convertir_mes(numero):
        nombres = {
            1: "Enero", 2: "Febrero", 3: "Marzo", 4: "Abril",
            5: "Mayo", 6: "Junio", 7: "Julio", 8: "Agosto",
            9: "Septiembre", 10: "Octubre", 11: "Noviembre", 12: "Diciembre"
        }
        return nombres.get(numero, f"Mes {numero}")

    return [{"mes": convertir_mes(m), "total": t} for m, t in resultados]




@router.get("/ventas-por-mes", response_model=list[SaleByMonth])
def ventas_por_mes(db: Session = Depends(get_db)):
    resultados = (
        db.query(
            extract('month', Sale.created_at).label('mes'),
            func.sum(Sale.total).label('total')
        )
        .group_by(extract('month', Sale.created_at))
        .order_by(extract('month', Sale.created_at))
        .all()
    )

    def convertir_mes(numero):
        nombres = {
            1: "Enero", 2: "Febrero", 3: "Marzo", 4: "Abril",
            5: "Mayo", 6: "Junio", 7: "Julio", 8: "Agosto",
            9: "Septiembre", 10: "Octubre", 11: "Noviembre", 12: "Diciembre"
        }
        return nombres.get(numero, f"Mes {numero}")

    return [{"mes": convertir_mes(m), "total": t} for m, t in resultados]

router = APIRouter(prefix="/api/metrics", tags=["metrics"])


@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    ventas_dia = db.query(func.sum(Sale.total))\
        .filter(func.date(Sale.created_at) == func.current_date())\
        .scalar() or 0

    compras_dia = 0  # Cambia cuando tengas tabla de compras
    inventario_valor = db.query(func.sum(Product.price * Product.stock)).scalar() or 0
    productos_registrados = db.query(func.count(Product.id)).scalar() or 0
    proveedores = 0
    categorias = 0
    vencimientos_stock = 0
    clientes = db.query(func.count(User.id)).scalar() or 0

    return {
        "ventasDia": float(ventas_dia),
        "comprasDia": float(compras_dia),
        "inventarioValor": float(inventario_valor),
        "productosRegistrados": productos_registrados,
        "proveedores": proveedores,
        "categorias": categorias,
        "vencimientosStock": vencimientos_stock,
        "clientes": clientes
    }


@router.get("/sales/monthly")
def get_sales_monthly(year: int, db: Session = Depends(get_db)):
    data = db.query(
        extract('month', Sale.created_at).label('month'),
        func.sum(Sale.total).label('ventas')
    ).filter(extract('year', Sale.created_at) == year) \
        .group_by('month') \
        .order_by('month') \
        .all()

    meses = {m: 0 for m in range(1, 13)}
    for mes, total in data:
        meses[int(mes)] = float(total)

    return [
        {"month": f"{year}-{str(m).zfill(2)}", "ventas": meses[m], "compras": 0}
        for m in range(1, 13)
    ]

