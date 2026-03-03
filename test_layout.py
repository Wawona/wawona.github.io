import urllib.request
import time

try:
    req = urllib.request.urlopen("http://127.0.0.1:1111/")
    print("Zola dev server running!")
    html = req.read().decode('utf-8')
    if "features-track" in html:
        print("Track ID found in HTML")
except Exception as e:
    print(f"Error accessing 1111: {e}")

