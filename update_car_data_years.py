import json
import re

def extract_year(title):
    match = re.search(r'\b(20\d{2}|19\d{2})\b', title)
    if match:
        return match.group(1)
    return None

def main():
    with open('car_data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Specific missing years found by browser subagent
    missing_mapping = {
        0: "2015",
        1: "2015",
        2: "2014"
    }

    for i, car in enumerate(data):
        if car.get('title') == "Unavailable":
            car['year'] = None
            continue
            
        if i in missing_mapping:
            car['year'] = missing_mapping[i]
        else:
            year = extract_year(car.get('title', ''))
            car['year'] = year

    with open('car_data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    
    print("Updated car_data.json with years.")

if __name__ == "__main__":
    main()
