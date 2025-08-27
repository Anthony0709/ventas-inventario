from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app import crud, schemas, database, models
from app.dependencies import get_current_user

router = APIRouter(prefix="/sales", tags=["Sales"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# CRUD
@router.post("/", response_model=schemas.SaleOut)
def create_sale(
    sale: schemas.SaleCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return crud.create_sale(db, sale, current_user["id"])

@router.get("/", response_model=list[schemas.SaleOut])
def list_sales(db: Session = Depends(get_db)):
    return crud.get_sales(db)

@router.get("/{sale_id}", response_model=schemas.SaleOut)
def get_sale(sale_id: int, db: Session = Depends(get_db)):
    sale = crud.get_sale(db, sale_id)
    if not sale:
        raise HTTPException(status_code=404, detail="Venta no encontrada")
    return sale

@router.delete("/{sale_id}")
def delete_sale(
    sale_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    sale = crud.delete_sale(db, sale_id)
    if not sale:
        raise HTTPException(status_code=404, detail="Venta no encontrada")
    return {"detail": "Venta cancelada y stock restaurado"}


@router.put("/{sale_id}", response_model=schemas.SaleOut)
def update_sale(
    sale_id: int,
    sale: schemas.SaleUpdate,   # esquema que ahora definimos
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    updated = crud.update_sale(db, sale_id, sale, current_user["id"])
    if not updated:
        raise HTTPException(status_code=404, detail="Venta no encontrada")
    return updated
