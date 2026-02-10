import json

file_path = r'c:\Users\kaiya\github\carbuy\autotrader_data.json'

new_cars = [
    {
        "url": "https://www.autotrader.co.uk/car-details/202601179228917",
        "title": "2012 Mazda Mazda2",
        "price": "£5,390",
        "mileage": "31,505 miles",
        "transmission": "Automatic",
        "engine_fuel": "1.3L Petrol",
        "image_url": "https://m.atcdn.co.uk/a/media/w800/6b77f3dce90a482ab26a43342e8847a1.jpg"
    },
    {
        "url": "https://www.autotrader.co.uk/car-details/202602089767547",
        "title": "2014 Nissan Note",
        "price": "£6,285",
        "mileage": "24,000 miles",
        "transmission": "Automatic",
        "engine_fuel": "1.2L Petrol",
        "image_url": "https://m.atcdn.co.uk/a/media/w800/2558be3321fa4e7cb8e16a3dff37806c.jpg"
    },
    {
        "url": "https://www.autotrader.co.uk/car-details/202602029619766",
        "title": "2015 Nissan Note",
        "price": "£6,290",
        "mileage": "37,209 miles",
        "transmission": "Automatic",
        "engine_fuel": "1.2L Petrol",
        "image_url": "https://m.atcdn.co.uk/a/media/w800/e99eb5cc21b04573a406d4868f4904d3.jpg"
    }
]

with open(file_path, 'r', encoding='utf-8') as f:
    existing_data = json.load(f)

# Create a set of existing URLs for fast lookup
existing_urls = set(car['url'].split('?')[0] for car in existing_data)

added_count = 0
for car in new_cars:
    if car['url'] not in existing_urls:
        existing_data.append(car)
        added_count += 1
    else:
        print(f"Skipping duplicate: {car['url']}")

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(existing_data, f, indent=4)

print(f"Added {added_count} new cars.")
