from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests
import math


def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = math.sin(delta_phi / 2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2)**2
    return round(R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a)), 2)

_cache = {}

mood_mapping = {

    'Cafes'    : ('amenity', 'cafe'),
    'Foodie'    : ('amenity', 'restaurant'),
    'Outdoors': ('leisure', 'park'),
    'Fast Food'  : ('amenity', 'fast_food'),
    'Chill'   : ('amenity', 'cinema'),      
}      



@api_view(['GET'])
def get_places(request):
    places = []

    mood = request.query_params.get('mood', None)
    filter = request.query_params.get('filter', None)
    lat  = request.query_params.get('lat', None)
    lng  = request.query_params.get('lng', None)

    if not lat or not lng:
        return Response({'error': 'Missing latitude or longitude'}, status=400)

    try:
        user_lat = float(lat)
        user_lng = float(lng)

    except ValueError:

        return Response({'error': 'Invalid coordinates'}, status=400)

    mood_key = mood
    tag = mood_mapping.get(mood_key)

    if not tag:
        return Response({'error': 'Invalid or Missing Mood'}, status = 400)
    
    key, val = tag
    cache_key = f"{mood_key}_{round(user_lat, 3)}_{round(user_lng, 3)}"
    if cache_key in _cache:
        return Response(_cache[cache_key])

    overpass_query = f"""
    [out:json][timeout:10];
    (
      node["{key}"="{val}"](around:8000,{user_lat},{user_lng});
      way["{key}"="{val}"](around:8000,{user_lat},{user_lng});
    );
    out body center 20;
    """

    url = 'https://overpass.kumi.systems/api/interpreter'
    headers = {
        "User-Agent" : "PlaceRecApp/1.0"
    }
    timeout = 15

    response = requests.post(url = url,data = overpass_query, headers = headers, timeout = timeout)
    data = response.json()
    

    result = process(data.get('elements',[]), user_lat, user_lng,val)
    _cache[cache_key] = result
    return Response(result)



def process(elements, user_lat, user_lng, val):
    if not elements:
        return []
    
    first = elements[0]
    rest = process(elements[1:], user_lat,user_lng, val)

    tags = first.get('tags',{})
    name = tags.get('name','')

    if not name:
        return rest

    if first.get('type') == 'node':
        element_lat = first.get('lat')
        element_lng = first.get('lon')

    else:
        element_lat = first.get('center',{}).get('lat')
        element_lng = first.get('center',{}).get('lon')

    if not element_lat or not element_lng:
        return rest

    id = first.get('id')
    distance = haversine_distance(user_lat,user_lng,element_lat,element_lng)
    street = tags.get('addr:street','')
    city = tags.get('addr:city','')
    address = f"{street}, {city}".strip(', ') or "Address Unavailable"

    place = {
        'id' : id,
        'name' : name,
        'type' : val.replace('_', " ").title(),
        'distance' : distance,
        'address' : address
    }


    return [place] + rest