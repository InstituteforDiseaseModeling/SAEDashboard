from collections import defaultdict
from service.helpers.dot_name import DotName
from service.helpers.controller_helpers import get_shapes, get_shape_info, read_dot_names, read_admin_level, read_upfill, ControllerException, get_all_countries_for_shapes, read_shape_version, detect_shape_versions
from service.schemas.ShapesInfoSchema import ShapesInfoListSchema
from fastapi import APIRouter, Request, HTTPException

router = APIRouter()


@router.get("/shapes")
async def get_features(request: Request):
    try:
        dot_names = read_dot_names(request=request)
        requested_admin_level = read_admin_level(request=request)
        shape_version = read_shape_version(request=request)
        upfill = read_upfill(request=request)

        shapes_by_dot_name = defaultdict(lambda: {"type": "FeatureCollection", "features": []})

        for dot_name in dot_names:
            dot_name = DotName(dot_name_str=dot_name)
            if requested_admin_level < dot_name.admin_level:
                raise ControllerException('Cannot request an admin_level shallower than the provided dot_name.')
            countries = [dot_name.country] if dot_name.country else get_all_countries_for_shapes()

            for country in countries:
                admin_level = requested_admin_level
                dn = dot_name if dot_name.country else DotName.from_parts([dot_name.continent, country])
                version = shape_version
                try:
                    shapes = get_shapes(dot_name=dn, admin_level=admin_level, version=version)
                except HTTPException:
                    available = detect_shape_versions(country)
                    if not available:
                        continue
                    version = int(available[0])
                    try:
                        shapes = get_shapes(dot_name=dn, admin_level=admin_level, version=version)
                    except HTTPException:
                        continue
                while upfill and len(shapes['features']) == 0 and admin_level > dot_name.admin_level:
                    admin_level -= 1
                    try:
                        shapes = get_shapes(dot_name=dn, admin_level=admin_level, version=version)
                    except HTTPException:
                        break
                shapes_by_dot_name[str(dot_name)]["features"].extend(shapes["features"])

        return shapes_by_dot_name
    except ControllerException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/shapes/info", response_model=ShapesInfoListSchema)
async def get_shapes_info(request: Request):
    country = request.query_params.get("country")
    admin_level = request.query_params.get("admin_level")
    version = request.query_params.get("version")
    include = request.query_params.get("include", "summary")
    admin_level_int = int(admin_level) if admin_level is not None else None
    version_int = int(version) if version is not None else None
    shapes = get_shape_info(
        country=country,
        admin_level=admin_level_int,
        version=version_int,
        include_admin_names=(include == "admin_names"),
    )
    return {"shapes": shapes}
