import urllib.request
import json
import ssl

try:
    url = 'http://127.0.0.1:8000/api/analyze/'
    data = JSON_DATA = json.dumps({
        "target_role": "Python Developer",
        "skills": ["Python", "Django"]
    }).encode('utf-8')

    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    
    # Bypass SSL verification if needed (though http shouldn't need it)
    context = ssl._create_unverified_context()

    print(f"Testing connection to {url}...")
    with urllib.request.urlopen(req, context=context) as response:
        print(f"Status Code: {response.getcode()}")
        print(f"Response Body: {response.read().decode('utf-8')}")

except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code} - {e.read().decode('utf-8')}")
except Exception as e:
    print(f"Connection Failed: {e}")
