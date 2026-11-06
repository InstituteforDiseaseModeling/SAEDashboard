from pathlib import Path
import pandas as pd
from service.schemas.EventsSchema import EventsListSchema
from service.helpers.controller_helpers import ControllerException
from fastapi import APIRouter, HTTPException

router = APIRouter()


@router.get("/events/", response_model=EventsListSchema)
async def get_events():
    try:
        csv_path = Path(__file__).parent.parent / 'data' / 'events.csv'
        df = pd.read_csv(csv_path)
        data = {}
        for _, row in df.iterrows():
            data[row['event']] = {
                'event': row['event'],
                'start_date': row['start_date'],
                'end_date': row['end_date'],
            }
        return list(data.values())
    except ControllerException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")
