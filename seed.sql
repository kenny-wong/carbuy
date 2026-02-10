-- Seed data for cars table
INSERT INTO public.cars (url, title, price, mileage, transmission, engine_fuel, image_url)
VALUES
('https://www.autotrader.co.uk/car-details/202512218737311', '2014 Ford B-Max', '£4,990', '44,287 miles', 'Automatic', '1.6L Petrol', 'https://m.atcdn.co.uk/a/media/4c82ad4540a64bb6926d17ac1263915c.jpg'),
('https://www.autotrader.co.uk/car-details/202601199244933', '2012 Nissan Juke', '£5,990', '37,717 miles', 'Automatic', '1.5L Petrol', 'https://m.atcdn.co.uk/a/media/aa53899fc2e74f7da7741ca6016df77e.jpg'),
('https://www.autotrader.co.uk/car-details/202601269426880', '2012 Mercedes-Benz B Class', '£6,495', '33,520 miles', 'Automatic', '1.6L Petrol', 'https://m.atcdn.co.uk/a/media/33312c3fcb3d4471bd1392447d9d01d3.jpg'),
('https://www.autotrader.co.uk/car-details/202503170255350', '2013 Nissan Cube', '£6,495', '36,000 miles', 'Automatic', '1.6L Petrol', 'https://m.atcdn.co.uk/a/media/2ae3bb502a1d4e36abd86efaef2ed8e6.jpg'),
('https://www.autotrader.co.uk/car-details/202509156347333', '2013 Nissan Juke', '£6,495', '42,376 miles', 'Automatic', '1.6L Petrol', 'https://m.atcdn.co.uk/a/media/35b98c77f32e48fcb8bdb81687a4a379.jpg'),
('https://www.autotrader.co.uk/car-details/202601269425826', '2014 Nissan Juke', '£6,949', '42,000 miles', 'Automatic', '1.6L Petrol', 'https://m.atcdn.co.uk/a/media/2b99e5a034b5466b9361b2a6b09ab1b4.jpg'),
('https://www.autotrader.co.uk/car-details/202601159173422', 'Unavailable', '', '', '', '', ''),
('https://www.autotrader.co.uk/car-details/202511167931805', '2012 Ford B-Max', '£5,620', '32,000 miles', 'Automatic', '1.6L Petrol', 'https://m.atcdn.co.uk/a/media/1e9949df55ec47718fa7add3beedbeca.jpg'),
('https://www.autotrader.co.uk/car-details/202511218057507', '2014 Citroen C3 Picasso', '£6,199', '45,500 miles', 'Automatic', '1.6L Petrol', 'https://m.atcdn.co.uk/a/media/dbef9e580b56449eaea372ecef5f0e04.jpg'),
('https://www.autotrader.co.uk/car-details/202512298823547', '2014 Nissan Serena', '£7,250', '54,172 miles', 'Automatic', '2.0L Petrol Hybrid', 'https://m.atcdn.co.uk/a/media/5290f35bb24343fcbef1b93298fc1d3c.jpg'),
('https://www.autotrader.co.uk/car-details/202512068426357', '2013 Honda Jazz', '£5,990', '44,614 miles', 'Automatic', '1.3L Petrol Hybrid', 'https://m.atcdn.co.uk/a/media/cc34a6da9ee64abba36f4f322d061022.jpg'),
('https://www.autotrader.co.uk/car-details/202601239381264', '2014 Honda Fit', '£6,999', '39,842 miles', 'Automatic', '1.5L Petrol Hybrid', 'https://m.atcdn.co.uk/a/media/c52ba6ed8c884f2381c89afcc916c071.jpg'),
('https://www.autotrader.co.uk/car-details/202512298831654', '2012 Nissan Note', '£5,490', '23,000 miles', 'Automatic', '1.2L Petrol', 'https://m.atcdn.co.uk/a/media/9a1bad66e4f845268bf4549f47b1e76d.jpg'),
('https://www.autotrader.co.uk/car-details/202601269434868', 'Unavailable', '', '', '', '', ''),
('https://www.autotrader.co.uk/car-details/202601179228917', '2012 Mazda Mazda2', '£5,390', '31,505 miles', 'Automatic', '1.3L Petrol', 'https://m.atcdn.co.uk/a/media/w800/6b77f3dce90a482ab26a43342e8847a1.jpg'),
('https://www.autotrader.co.uk/car-details/202602089767547', '2014 Nissan Note', '£6,285', '24,000 miles', 'Automatic', '1.2L Petrol', 'https://m.atcdn.co.uk/a/media/w800/2558be3321fa4e7cb8e16a3dff37806c.jpg'),
('https://www.autotrader.co.uk/car-details/202602029619766', '2015 Nissan Note', '£6,290', '37,209 miles', 'Automatic', '1.2L Petrol', 'https://m.atcdn.co.uk/a/media/w800/e99eb5cc21b04573a406d4868f4904d3.jpg')
ON CONFLICT (url) DO NOTHING;
