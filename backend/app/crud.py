from sqlalchemy.orm import Session
from . import models, schemas
from decimal import Decimal


# -------------------------
# PRODUCT CRUD
# -------------------------

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def get_products(db: Session):
    return db.query(models.Product).all()


def get_product_by_id(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()


def update_product(db: Session, product_id: int, product_data: schemas.ProductUpdate):
    db_product = get_product_by_id(db, product_id)
    if not db_product:
        return None

    for key, value in product_data.model_dump(exclude_unset=True).items():
        setattr(db_product, key, value)

    db.commit()
    db.refresh(db_product)
    return db_product


def delete_product(db: Session, product_id: int):
    db_product = get_product_by_id(db, product_id)
    if not db_product:
        return None

    db.delete(db_product)
    db.commit()
    return db_product


# -------------------------
# ORDER CRUD
# -------------------------

def create_order(db: Session, order: schemas.OrderCreate):
    try:
        total_amount = Decimal("0.00")
        db_order = models.Order(customer_name=order.customer_name)
        db.add(db_order)
        db.flush()

        for item in order.items:
            product = db.query(models.Product).filter(
                models.Product.id == item.product_id
            ).first()

            if not product:
                raise ValueError(f"Product ID {item.product_id} not found")

            if product.stock < item.quantity:
                raise ValueError(f"Insufficient stock for product {product.name}")

            item_total = product.price * item.quantity
            total_amount += item_total

            product.stock -= item.quantity

            db_item = models.OrderItem(
                order_id=db_order.id,
                product_id=product.id,
                quantity=item.quantity,
                price=product.price
            )
            db.add(db_item)

        db_order.total_amount = total_amount
        db.commit()
        db.refresh(db_order)
        return db_order

    except Exception:
        db.rollback()
        raise


def get_orders(db: Session):
    return db.query(models.Order).all()