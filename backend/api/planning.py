import json

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from backend.models.planning import PlanTripRequest, RefineDayRequest, RefinedDayPlan, TripPlan
from backend.services import planning_service

router = APIRouter(prefix="/planning", tags=["planning"])


@router.post("/plan", response_model=TripPlan)
async def plan_trip(payload: PlanTripRequest) -> TripPlan:
    return await planning_service.build_trip_plan(
        destination=payload.destination,
        dates=payload.dates,
        profile=payload.profile,
        include_flights=payload.includeFlights,
        origin=payload.origin,
        total_days=payload.totalDays,
    )


@router.post("/day/refine", response_model=RefinedDayPlan)
async def refine_day(payload: RefineDayRequest) -> RefinedDayPlan:
    return await planning_service.refine_day(payload)


@router.post("/plan/stream")
async def plan_trip_stream(payload: PlanTripRequest) -> StreamingResponse:
    async def event_source():
        async for event in planning_service.stream_trip_plan(
            destination=payload.destination,
            dates=payload.dates,
            profile=payload.profile,
            include_flights=payload.includeFlights,
            origin=payload.origin,
            total_days=payload.totalDays,
        ):
            yield f"data: {json.dumps(event)}\n\n"

    return StreamingResponse(event_source(), media_type="text/event-stream")
