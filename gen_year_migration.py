import json

def main():
    with open('car_data.json', 'r', encoding='utf-8') as f:
        cars = json.load(f)

    sql_statements = []
    
    # Optional: Disable RLS for the cars table to be absolutely sure
    # sql_statements.append("ALTER TABLE public.cars DISABLE ROW LEVEL SECURITY;")

    for car in cars:
        if car.get('title') == 'Unavailable' or not car.get('url'):
            continue
            
        url = car['url']
        year = car.get('year')
        
        if year:
            # Escape single quotes in URL just in case
            safe_url = url.replace("'", "''")
            sql = f"UPDATE public.cars SET year = '{year}' WHERE url = '{safe_url}';"
            sql_statements.append(sql)

    # Re-enable RLS if we disabled it
    # sql_statements.append("ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;")

    with open('supabase/migrations/20260215023500_update_car_years_data.sql', 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_statements))
    
    print(f"Generated migration with {len(sql_statements)} update statements.")

if __name__ == "__main__":
    main()
