from typing import (
    Annotated,
    Any,
    List,
    TypeAlias,
    TypeVar,
    Union,
)
from pydantic import BaseModel, BeforeValidator

# A list with a single item.
SingleItemList: TypeAlias = List


def unpack_single_list_item(v: Any) -> Any:
    """
    Validator to unpack a list with a single item into the item itself,
    or return None if the list is empty or None.
    Otherwise, returns the value as is.
    """
    if isinstance(v, list):
        if len(v) == 1:
            return v[0]
        elif len(v) == 0:
            return None  # Or [] if you prefer empty list for empty input lists
    return v


# Since the data comes back as a List for all keys (via request.args.to_dict(flat=False)),
# the Single type allows us to convert a class member to type rather than List[type]
# so we don't have to do member[0] every time.
T = TypeVar("T")
Single: TypeAlias = Annotated[T, BeforeValidator(unpack_single_list_item)]


class MailchimpUsersRequestDTO(BaseModel):
    pageIndex: SingleItemList[int]
    pageSize: SingleItemList[int]
    limit: Union[Single[int], None] = None
    sortByDesc: Union[Single[str], None] = None
    studentNameSearchKeyword: Union[SingleItemList[str], None] = None
    minNumberOfSessions: Union[SingleItemList[str], None] = None
    maxNumberOfSessions: Union[SingleItemList[str], None] = None
    accountType: Union[List[str], None] = None
    startDate: Union[SingleItemList[str], None] = None
    endDate: Union[SingleItemList[str], None] = None
    schools: Union[List[str], None] = None


class SignupsByCategoryRequestDTO(BaseModel):
    signupMethodCategories: Union[List[str], None] = None
    accountType: Union[List[str], None] = None
    startDate: Union[SingleItemList[str], None] = None
    endDate: Union[SingleItemList[str], None] = None


class DetailedSignupRequestDTO(BaseModel):
    signupMethodCategories: Union[List[str], None] = None
    freeResponseSearchKeyword: Union[Single[str], None] = None
    startDate: Union[Single[str], None] = (
        None  # Single[str] stores first str value in array
    )
    endDate: Union[Single[str], None] = None
    accountType: Union[List[str], None] = None
    educationLevel: Union[List[str], None] = None


class SignupLineChartRequestDTO(BaseModel):
    groupBy: Single[str]
    signupMethodCategories: Union[List[str], None] = None
    accountType: Union[List[str], None] = None
    startDate: Union[Single[str], None] = None
    endDate: Union[Single[str], None] = None


class SignupLineChartResponseDTO(BaseModel):
    date: str
    signupMethodCategory: str
    numberOfSignups: int


class SignupSummaryBoxRequestDTO(BaseModel):
    signupMethodCategories: Union[List[str], None] = None
    accountType: Union[List[str], None] = None
    startDate: Union[Single[str], None] = None
    endDate: Union[Single[str], None] = None


class SignupSummaryBoxResponseDTO(BaseModel):
    signnupCount: int


class TutorLeaderboardRequestDTO(BaseModel):
    startDate: Union[Single[str], None] = None
    endDate: Union[Single[str], None] = None
    sortBy: Union[Single[str], None] = None
    subjects: Union[List[str], None] = None
    locations: Union[List[str], None] = None
    tutorNameSearch: Union[Single[str], None] = None

class TutorInfoRequestDTO(BaseModel):
    id: Single[int]

class TutorDetailKpiRequestDTO(BaseModel):
    id: Single[int]
    startDate: Union[Single[str], None] = None
    endDate: Union[Single[str], None] = None
    pass

class TutorDetailChartRequestDTO(BaseModel):
    id: Single[int]
    groupBy: Single[str]
    startDate: Union[Single[str], None] = None
    endDate: Union[Single[str], None] = None
    pass