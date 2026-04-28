import requests
import math
from rest_framework.decorators import api_view
from rest_framework.response import Response

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = math.sin(delta_phi / 2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2)**2
    return round(R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a)), 2)

# Simple in-memory cache with size limit
_cache = {}
MAX_CACHE_SIZE = 100

mood_mapping = {
    'Cafes': ('amenity', 'cafe'),
    'Foodie': ('amenity', 'restaurant'),
    'Outdoors': ('leisure', 'park'),
    'Fast Food': ('amenity', 'fast_food'),
    'Chill': ('amenity', 'cinema'),
}

@api_view(['GET'])
def get_places(request):
    mood = request.query_params.get('mood', None)
    lat = request.query_params.get('lat', None)
    lng = request.query_params.get('lng', None)

    if not lat or not lng:
        return Response({'error': 'Missing latitude or longitude'}, status=400)

    try:
        user_lat = float(lat)
        user_lng = float(lng)
    except ValueError:
        return Response({'error': 'Invalid coordinates'}, status=400)

    tag = mood_mapping.get(mood)
    if not tag:
        return Response({'error': 'Invalid or Missing Mood'}, status=400)
    
    key, val = tag
    cache_key = f"{mood}_{round(user_lat, 3)}_{round(user_lng, 3)}"
    if cache_key in _cache:
        return Response(_cache[cache_key])

    overpass_query = f"""
    [out:json][timeout:10];
    (
      node["{key}"="{val}"](around:9000,{user_lat},{user_lng});
      way["{key}"="{val}"](around:9000,{user_lat},{user_lng});
    );
    out body center 20;
    """

    url = 'https://overpass.kumi.systems/api/interpreter'
    headers = {"User-Agent": "PlaceRecApp/1.0"}
    
    try:
        # Added timeout to prevent Gunicorn worker kill
        response = requests.post(url=url, data=overpass_query, headers=headers, timeout=15)
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.RequestException as e:
        return Response({'error': f'Failed to fetch data from Overpass API: {str(e)}'}, status=502)

    result = process_elements(data.get('elements', []), user_lat, user_lng, val)
    
    # Simple cache eviction
    if len(_cache) >= MAX_CACHE_SIZE:
        _cache.pop(next(iter(_cache)))
    _cache[cache_key] = result
    
    return Response(result)

@api_view(['GET'])
def ping(request):
    return Response({"status": "ok"})

def process_elements(elements, user_lat, user_lng, val):
    places = []
    for element in elements:
        tags = element.get('tags', {})
        name = tags.get('name', '')

        if not name:
            continue

        if element.get('type') == 'node':
            element_lat = element.get('lat')
            element_lng = element.get('lon')
        else:
            element_lat = element.get('center', {}).get('lat')
            element_lng = element.get('center', {}).get('lon')

        if not element_lat or not element_lng:
            continue

        id = element.get('id')
        distance = haversine_distance(user_lat, user_lng, element_lat, element_lng)
        street = tags.get('addr:street', '')
        city = tags.get('addr:city', '')
        address = f"{street}, {city}".strip(', ') or "Address Unavailable"

        places.append({
            'id': id,
            'name': name,
            'type': val.replace('_', " ").title(),
            'distance': distance,
            'address': address
        })
    return places

