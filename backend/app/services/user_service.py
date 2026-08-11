from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.services.auth import hash_password, verify_password


def create_user(db: Session, user: UserCreate):
    # Check if email already exists
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="Email already registered"
        )

    hashed_password = hash_password(user.password)

    new_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        return None

    if not verify_password(password, user.password):
        return None

    return user


def update_user(
    db: Session,
    current_user: User,
    user_data: UserUpdate
):
    if user_data.username is not None:
        current_user.username = user_data.username

    if user_data.email is not None:
        current_user.email = user_data.email

    db.commit()
    db.refresh(current_user)

    return current_user
