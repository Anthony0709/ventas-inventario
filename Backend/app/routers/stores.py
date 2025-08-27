from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas, database, models
from app.dependencies import get_current_user
from app.models import Store

router = APIRouter(prefix="/stores", tags=["Stores"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.StoreOut)
def create_store(store: schemas.StoreCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_store = models.Store(**store.dict(), created_by=current_user["id"])
    db.add(db_store)
    db.commit()
    db.refresh(db_store)
    return db_store

@router.get("/", response_model=list[schemas.StoreOut])
def list_stores(db: Session = Depends(get_db)):
    return db.query(models.Store).all()

@router.put("/{store_id}", response_model=schemas.StoreOut)
def update_store(store_id: int, store: schemas.StoreUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_store = db.query(models.Store).filter(models.Store.id == store_id).first()
    if not db_store:
        raise HTTPException(status_code=404, detail="Tienda no encontrada")
    for key, value in store.dict(exclude_unset=True).items():
        setattr(db_store, key, value)
    db_store.updated_by = current_user["id"]
    db.commit()
    db.refresh(db_store)
    return db_store

@router.delete("/{store_id}")
def delete_store(store_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_store = db.query(models.Store).filter(models.Store.id == store_id).first()
    if not db_store:
        raise HTTPException(status_code=404, detail="Tienda no encontrada")
    db.delete(db_store)
    db.commit()
    return {"detail": "Tienda eliminada correctamente"}

"""
router = APIRouter(prefix="/api/stores", tags=["stores"])

@router.get("/")
def list_stores(db: Session = Depends(get_db)):
    return db.query(Store).all()
"""
