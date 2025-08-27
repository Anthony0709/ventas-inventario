from datetime import datetime
from http.client import HTTPException
from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql.functions import current_user

from . import models, schemas
from passlib.hash import bcrypt

from .routers.auth import pwd_context


# ==== USERS ====
def create_user(db: Session, user: schemas.UserCreate):
    hashed_pw = pwd_context.hash(user.password)
    # Convertir role textual a booleano
    is_admin = True if getattr(user, "role", "").lower() == "admin" else False

    db_user = models.User(
        username=user.username,
        email=user.email,
        password=hashed_pw,
        is_admin=is_admin
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session):
    return db.query(models.User).all()


def update_user(db: Session, user_id: int, user_data):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        return None
    for key, value in user_data.dict(exclude_unset=True).items():
        if key == "password" and value:
            value = pwd_context.hash(value)
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user

def delete_user(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        return None
    db.delete(user)
    db.commit()
    return True


# ==== STORES ====
def get_stores(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Store).offset(skip).limit(limit).all()

def get_store(db: Session, store_id: int):
    return db.query(models.Store).filter(models.Store.id == store_id).first()

def create_store(db: Session, store: schemas.StoreCreate):
    db_store = models.Store(**store.dict())
    db.add(db_store)
    db.commit()
    db.refresh(db_store)
    return db_store

def update_store(db: Session, store_id: int, store: schemas.StoreCreate):
    db_store = db.query(models.Store).filter(models.Store.id == store_id).first()
    if not db_store:
        return None
    db_store.name = store.name
    db_store.location = store.location
    db.commit()
    db.refresh(db_store)
    return db_store

def delete_store(db: Session, store_id: int):
    db_store = db.query(models.Store).filter(models.Store.id == store_id).first()
    if not db_store:
        return None
    db.delete(db_store)
    db.commit()
    return db_store


# ==== PRODUCTS ====
def create_product(db: Session, product: schemas.ProductCreate, user_id: int):
    db_product = models.Product(**product.dict(), created_by=user_id)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def get_products(db: Session):
    return db.query(models.Product).all()

def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def update_product(db: Session, product_id: int, product: schemas.ProductUpdate, user_id: int):
    db_product = get_product(db, product_id)
    if not db_product:
        return None
    for key, value in product.dict(exclude_unset=True).items():
        setattr(db_product, key, value)
    db_product.updated_by = user_id
    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int, user_id: int):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        return None
    # aquí podrías guardar en tabla audit_logs: user_id, acción, etc.
    db.delete(product)
    db.commit()
    return True









#########################
# ==== SALES ====
TAX_RATE = 0.12  # ajusta si necesitas otro IVA

def create_sale(db: Session, sale: schemas.SaleCreate, user_id: int):
    # Bloquea el producto para evitar carreras
    product = (
        db.query(models.Product)
        .filter(models.Product.id == sale.product_id)
        .with_for_update()
        .first()
    )
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    # Validar tienda
    store = db.query(models.Store).filter(models.Store.id == sale.store_id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Tienda no encontrada")

    # (Opcional pero recomendado) Validar que el producto pertenezca a la misma tienda
    if product.store_id != sale.store_id:

        raise HTTPException(status_code=400, detail="El producto no pertenece a la tienda indicada")

    # Validar stock suficiente
    if product.stock < sale.quantity:
        raise HTTPException(status_code=400, detail="Stock insuficiente")

    # Calcular montos
    subtotal = product.price * sale.quantity
    tax = round(subtotal * TAX_RATE, 2)
    total = round(subtotal + tax, 2)

    try:
        # Descontar stock y registrar venta
        product.stock = product.stock - sale.quantity

        db_sale = models.Sale(
            product_id=sale.product_id,
            store_id=sale.store_id,
            quantity=sale.quantity,
            subtotal=subtotal,
            tax=tax,
            total=total,
            user_id=user_id,
        )

        db.add(db_sale)
        db.commit()
        db.refresh(db_sale)  # asegura created_at y relaciones
        return db_sale
    except Exception:
        db.rollback()
        raise

def get_sales(db: Session):
    return db.query(models.Sale).all()

def get_sale(db: Session, sale_id: int):
    return db.query(models.Sale).filter(models.Sale.id == sale_id).first()

def update_sale(db: Session, sale_id: int, sale_data, user_id: int):
    sale = db.query(models.Sale).filter(models.Sale.id == sale_id).first()
    if not sale:
        return None
    for key, value in sale_data.dict(exclude_unset=True).items():
        setattr(sale, key, value)
    db.commit()
    db.refresh(sale)
    return sale


def delete_sale(db: Session, sale_id: int):
    sale = get_sale(db, sale_id)
    if not sale:
        return None

    # Restaurar stock del producto relacionado
    product = (
        db.query(models.Product)
        .filter(models.Product.id == sale.product_id)
        .with_for_update()
        .first()
    )
    if not product:
        # Si el producto ya no existe, no podemos restaurar; decide tu política
        raise HTTPException(status_code=409, detail="No se puede restaurar stock: producto inexistente")

    try:
        product.stock = product.stock + sale.quantity
        db.delete(sale)
        db.commit()
        return sale
    except Exception:
        db.rollback()
        raise
