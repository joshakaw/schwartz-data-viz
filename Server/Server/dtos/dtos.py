from typing import Generic, List, Literal, Optional, TypeVar, TypedDict, Union
from pydantic import BaseModel


class RequestDTO(BaseModel):
    """
    Base Request DTO.
    """

    pass


class DetailedSignupRequestDTO(RequestDTO):
    """
    Request body DTO for filtering
    GET ---------
    """

    signupMethodCategories: Union[List[str], None]
    freeResponseSearchKeyword: Union[str, None]
    startDate: Union[str, None]
    endDate: Union[str, None]
    accountType: Union[List[str], None]
    educationLevel: Union[List[str], None]


class MailchimpUsersRequestDTO(RequestDTO):
    """
    Request body DTO for filtering
    GET /mailchimpDashboard/users
    """

    studentNameSearchKeyword: Union[str, None]
    minNumberOfSessions: Union[int, None]
    maxNumberOfSessions: Union[int, None]
    accountType: Union[List[str], None]
    startDate: Union[str, None]
    endDate: Union[str, None]


class SignupsByCategoryRequestDTO(RequestDTO):
    """
    Request body DTO for filtering
    GET /signupDashboard/signupsByCategory
    """

    signupMethodCategories: Union[List[str], None]
    startDate: Union[str, None]
    endDate: Union[str, None]


T = TypeVar("T")


class ApiPaginatedRequest(BaseModel, Generic[T]):
    """
    Request interface for getting a paginated response.
    Filter is an object that extends RequestDTO (e.g. MailchimpUsersRequestDTO)
    """

    pageIndex: int
    pageSize: int
    filter: T  # Request DTO


class FlatMailchimpPaginated(BaseModel):
    pageIndex: List[int]
    pageSize: List[int]
    studentNameSearchKeyword: Union[List[str], None]
    minNumberOfSessions: Union[List[str], None]
    maxNumberOfSessions: Union[List[str], None]
    accountType: Union[List[str], None]
    startDate: Union[List[str], None]
    endDate: Union[List[str], None]

class FlatSignups(BaseModel):
    signupMethodCategories: Union[List[str], None]
    startDate: Union[List[str], None]
    endDate: Union[List[str], None]