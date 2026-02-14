-- Mark cars as sold
UPDATE cars SET status = 'SOLD' WHERE url IN (
    'http://www.autotrader.co.uk/car-details/202601269428585',
    'http://www.autotrader.co.uk/car-details/202601309533799',
    'https://www.autotrader.co.uk/car-details/202512218737311',
    'https://www.autotrader.co.uk/car-details/202511218057507',
    'https://www.autotrader.co.uk/car-details/202512068426357'
);

-- Remove associated votes
DELETE FROM votes WHERE car_url IN (
    'http://www.autotrader.co.uk/car-details/202601269428585',
    'http://www.autotrader.co.uk/car-details/202601309533799',
    'https://www.autotrader.co.uk/car-details/202512218737311',
    'https://www.autotrader.co.uk/car-details/202511218057507',
    'https://www.autotrader.co.uk/car-details/202512068426357'
);
