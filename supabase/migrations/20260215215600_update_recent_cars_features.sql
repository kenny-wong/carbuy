-- Update horsepower and features for the 4 recently added cars
UPDATE public.cars SET horsepower = 99, has_carplay = false, has_rear_camera = false WHERE url LIKE '%202602029620485%';
UPDATE public.cars SET horsepower = NULL, has_carplay = false, has_rear_camera = true WHERE url LIKE '%202601058937681%';
UPDATE public.cars SET horsepower = 115, has_carplay = false, has_rear_camera = true WHERE url LIKE '%202602139893164%';
UPDATE public.cars SET horsepower = 136, has_carplay = false, has_rear_camera = true WHERE url LIKE '%202601239379206%';
