import json
import re

def extract_year(title):
    match = re.search(r'\b(20\d{2}|19\d{2})\b', title)
    if match:
        return match.group(1)
    return None

def main():
    try:
        with open('car_data.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading JSON: {e}")
        return

    updated_data = []
    missing_count = 0
    
    for i, car in enumerate(data):
        title = car.get('title', '')
        if title == "Unavailable":
            updated_data.append(car)
            continue
            
        year = extract_year(title)
        if year:
            car['year'] = year
        else:
            print(f"Index {i} missing year: {title}")
            car['year'] = None
            missing_count += 1
        updated_data.append(car)
    
    with open('car_data_with_years.json', 'w', encoding='utf-8') as f:
        json.dump(updated_data, f, indent=4, ensure_ascii=False)
    
    print(f"\nSummary: {len(data) - missing_count} found, {missing_count} missing.")

if __name__ == "__main__":
    main()
