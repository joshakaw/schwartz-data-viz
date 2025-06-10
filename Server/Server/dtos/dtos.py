from typing import (    Generic,    List,    Literal,    Optional,    TypeAlias,    TypeVar,    TypedDict,    Union,)
from pydantic import BaseModel

"""
A list with a single item.
"""
SingleItemList: TypeAlias = List


class MailchimpUsersRequestDTO(BaseModel):
    pageIndex: SingleItemList[int]
    pageSize: SingleItemList[int]
    studentNameSearchKeyword: Union[SingleItemList[str], None]
    minNumberOfSessions: Union[SingleItemList[str], None]
    maxNumberOfSessions: Union[SingleItemList[str], None]
    accountType: Union[List[str], None]
    startDate: Union[SingleItemList[str], None]
    endDate: Union[SingleItemList[str], None]


class SignupsByCategoryRequestDTO(BaseModel):
    signupMethodCategories: Union[List[str], None]
    accountType: Union[List[str], None]
    startDate: Union[SingleItemList[str], None]
    endDate: Union[SingleItemList[str], None]


class DetailedSignupRequestDTO(BaseModel):
    signupMethodCategories: Union[List[str], None] # TODO: Does the Flask parser turn nulls/Nones from client into an empty list?
    freeResponseSearchKeyword: Union[SingleItemList[str], None]
    startDate: Union[SingleItemList[str], None]
    endDate: Union[SingleItemList[str], None]
    accountType: Union[List[str], None]
    educationLevel: Union[List[str], None]


# TODO: Markup lists that should only contain one element after query param interpretation