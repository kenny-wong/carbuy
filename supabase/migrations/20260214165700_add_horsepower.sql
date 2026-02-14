-- Add horsepower column to cars table
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS horsepower INTEGER;

-- Bulk update horsepower values
UPDATE public.cars SET horsepower = 115 WHERE url LIKE '%202509266651017%';
UPDATE public.cars SET horsepower = 109 WHERE url LIKE '%202507304951000%';
UPDATE public.cars SET horsepower = 115 WHERE url LIKE '%202510036865579%';
UPDATE public.cars SET horsepower = 99 WHERE url LIKE '%202601269428585%';
UPDATE public.cars SET horsepower = 122 WHERE url LIKE '%202601089001350%';
UPDATE public.cars SET horsepower = 109 WHERE url LIKE '%202512098481105%';
UPDATE public.cars SET horsepower = 115 WHERE url LIKE '%202601309533799%';
UPDATE public.cars SET horsepower = 105 WHERE url LIKE '%202512218737311%';
UPDATE public.cars SET horsepower = 114 WHERE url LIKE '%202601199244933%';
UPDATE public.cars SET horsepower = 122 WHERE url LIKE '%202601269426880%';
UPDATE public.cars SET horsepower = 109 WHERE url LIKE '%202503170255350%';
UPDATE public.cars SET horsepower = 115 WHERE url LIKE '%202509156347333%';
UPDATE public.cars SET horsepower = 115 WHERE url LIKE '%202601269425826%';
UPDATE public.cars SET horsepower = 105 WHERE url LIKE '%202511167931805%';
UPDATE public.cars SET horsepower = 120 WHERE url LIKE '%202511218057507%';
UPDATE public.cars SET horsepower = 98 WHERE url LIKE '%202512068426357%';
UPDATE public.cars SET horsepower = 137 WHERE url LIKE '%202601239381264%';
UPDATE public.cars SET horsepower = 98 WHERE url LIKE '%202512298831654%';
UPDATE public.cars SET horsepower = 84 WHERE url LIKE '%202601179228917%';
UPDATE public.cars SET horsepower = 98 WHERE url LIKE '%202602089767547%';
UPDATE public.cars SET horsepower = 98 WHERE url LIKE '%202602029619766%';
