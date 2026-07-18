from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate
from app.services.auth import hash_password


def create_user(db: Session, user: UserCreate):
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