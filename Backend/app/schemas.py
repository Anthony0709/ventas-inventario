from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


# ==== AUTH ====
class UserBase(BaseModel):
    username: str
    email: str
    is_admin: bool


class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    class Config:
        orm_mode = True



# ==== STORES ====
class StoreBase(BaseModel):
    name: str
    location: str | None = None

class StoreCreate(StoreBase):
    pass

class StoreUpdate(BaseModel):
    name: str | None = None
    location: str | None = None

class StoreOut(StoreBase):
    id: int
    created_at: datetime
    updated_at: datetime | None
    creator: UserOut
    updater: UserOut | None
    class Config:
        orm_mode = True


# ==== PRODUCTS ====
class ProductBase(BaseModel):
    name: str
    price: float
    stock: int
    store_id: int

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: str | None = None
    price: float | None = None
    stock: int | None = None

class ProductOut(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime | None
    creator: UserOut
    updater: UserOut | None
    class Config:
        orm_mode = True



# ==== SALES ====
class SaleBase(BaseModel):
    product_id: int
    store_id: int
    quantity: int

class SaleUpdate(BaseModel):
    product_id: Optional[int] = None
    store_id: Optional[int] = None
    quantity: Optional[int] = None


class SaleCreate(SaleBase):
    pass

class SaleOut(SaleBase):
    id: int
    subtotal: float
    tax: float
    total: float
    created_at: Optional[datetime]  # 👈 acepta None sin romper
    updated_at: datetime | None
    user: UserOut
    product: ProductOut
    store: StoreOut

    class Config:
        orm_mode = True


from pydantic import BaseModel

class SaleByMonth(BaseModel):
    mes: str
    total: float


class DashboardMetrics(BaseModel):
    productos: int
    tiendas: int
    ventas: int
    usuarios: int

