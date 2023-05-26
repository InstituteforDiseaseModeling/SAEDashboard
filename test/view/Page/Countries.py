# Calling the API directly
import time
import requests

my_url = 'https://sae-dev.20.69.119.9.nip.io/api/dot_names?dot_name=Africa'
countries = [{"text": "None"}]

try:
    r = requests.get(my_url, verify=False)
    time.sleep(2)
    temp = r.json()
    # Fill up countries information
    countries = temp["dot_names"]
except:
    print("FAILED to load countries data - API too slow or not responsive")
    countries = [{"text": "API request timed out"}]
finally:
    print(countries)
