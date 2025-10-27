import requests
import json

base_url = "https://legion-riddle.onrender.com/api/pages"
total_pages = 14
urls = []

for page in range(1, total_pages + 1):
    url = f"{base_url}?page={page}&limit=50"
    print(f"Fetching: {url}")

    try:
        response = requests.get(url)
        response.raise_for_status()

        data = response.json()
        if "pages" in data:
            for item in data["pages"]:
                if "id" in item and "url" in item:
                    if "fake" not in item["id"].lower():
                        urls.append(item["url"])
        else:
            print("Unexpected data format:", data)
            break

    except requests.exceptions.RequestException as e:
        print(f"Error fetching page {page}: {e}")
        break

print(len(urls))
output_data = {"urls": urls}

with open("urls.json", "w") as f:
    json.dump(output_data, f, indent=2)

print(f"\n✅ Saved {len(urls)} real URLs to urls.json")
