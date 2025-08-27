from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas, database, models
from app.dependencies import get_current_user
from app.models import Product

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()
##############

@router.post("/", response_model=schemas.ProductOut)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return crud.create_product(db, product, current_user["id"])

@router.get("/", response_model=list[schemas.ProductOut])
def list_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()

@router.put("/{product_id}", response_model=schemas.ProductOut)
def update_product(product_id: int, product: schemas.ProductUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    updated = crud.update_product(db, product_id, product, current_user["id"])
    if not updated:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return updated

@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    deleted = crud.delete_product(db, product_id, current_user["id"])
    if not deleted:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return {"message": "Producto eliminado correctamente"}



'''
router = APIRouter(prefix="/api/products", tags=["products"])

@router.get("/")
def list_products(db: Session = Depends(get_db)):
    return db.query(Product).all()
'''
