import json

# Output SQL file
output_file = r'c:\Users\kaiya\github\carbuy\seed.sql'
# Input JSON file
input_file = r'c:\Users\kaiya\github\carbuy\car_data.json'

try:
    with open(input_file, 'r', encoding='utf-8') as f:
        cars = json.load(f)

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("-- Seed data for cars table\n")
        f.write("INSERT INTO public.cars (url, title, price, mileage, transmission, engine_fuel, image_url)\nVALUES\n")
        
        values = []
        for car in cars:
            # Escape single quotes in values
            def clean(val):
                if val is None: return ''
                return str(val).replace("'", "''")

            url = clean(car.get('url'))
            title = clean(car.get('title'))
            price = clean(car.get('price'))
            mileage = clean(car.get('mileage'))
            transmission = clean(car.get('transmission'))
            engine_fuel = clean(car.get('engine_fuel'))
            image_url = clean(car.get('image_url'))
            
            value_str = f"('{url}', '{title}', '{price}', '{mileage}', '{transmission}', '{engine_fuel}', '{image_url}')"
            values.append(value_str)
        
        f.write(",\n".join(values))
        f.write("\nON CONFLICT (url) DO NOTHING;\n")

    print(f"Successfully generated {output_file} w/ {len(cars)} rows")

except Exception as e:
    print(f"Error generating seed file: {e}")
