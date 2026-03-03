from pydantic import BaseModel
from typing import List, Optional
from decimal import Decimal
from datetime import datetime


# =========================
# PRODUCT SCHEMAS
# =========================

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: Decimal
    stock: int


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    stock: Optional[int] = None


class ProductResponse(ProductBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# =========================
# ORDER ITEM SCHEMAS
# =========================

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: Decimal

    class Config:
        from_attributes = True


# =========================
# ORDER SCHEMAS
# =========================

class OrderCreate(BaseModel):
    customer_name: str
    items: List[OrderItemCreate]


class OrderResponse(BaseModel):
    id: int
    customer_name: str
    total_amount: Decimal
    created_at: datetime
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True