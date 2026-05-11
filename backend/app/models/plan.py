from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base


class Plan(Base):

    __tablename__ = "plans"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer )

    subjects = Column(String)

    exam_date = Column(String)
    