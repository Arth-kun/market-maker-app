-- Places
INSERT INTO places (id, name, address, city, country, latitude, longitude, additional_info, is_active) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Marché Bonsecours', '350 Rue Saint-Paul Est', 'Montreal', 'Canada', 45.5082, -73.5521, 'Historic market building in Old Montreal', true),
    ('22222222-2222-2222-2222-222222222222', 'Place des Arts', '175 Rue Sainte-Catherine Ouest', 'Montreal', 'Canada', 45.5077, -73.5694, 'Cultural complex with multiple halls', true),
    ('33333333-3333-3333-3333-333333333333', 'Olympic Stadium', '4545 Avenue Pierre-de Coubertin', 'Montreal', 'Canada', 45.5579, -73.5515, 'Massive indoor space', true);

-- Maker Categories
INSERT INTO maker_categories (id, name, description) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Jewelry', 'Handmade jewelry and accessories'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Ceramics', 'Pottery, ceramic art, and functional pieces'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Textiles', 'Handwoven and printed textiles, clothing'),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Woodworking', 'Handcrafted wooden items and furniture'),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Food', 'Artisanal food products'),
    ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Art', 'Paintings, prints, and visual arts');

-- Markets
INSERT INTO markets (id, name, description, is_active) VALUES
    ('44444444-4444-4444-4444-444444444444', 'Downtown Artisan Market', 'Weekly market in the heart of downtown', true),
    ('55555555-5555-5555-5555-555555555555', 'Seasonal Makers Fair', 'Quarterly seasonal celebration of local makers', true),
    ('66666666-6666-6666-6666-666666666666', 'Night Market', 'Evening market with food and crafts', true);

-- Market Editions
INSERT INTO market_editions (id, market_id, place_id, name, start_date, end_date, is_active) VALUES
    ('77777777-7777-7777-7777-777777777777', '44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111',
     'Spring Downtown Market 2024', '2024-04-15', '2024-04-17', true),
    ('88888888-8888-8888-8888-888888888888', '55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222',
     'Summer Makers Fair 2024', '2024-07-01', '2024-07-03', true),
    ('99999999-9999-9999-9999-999999999999', '66666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333',
     'Winter Night Market 2024', '2024-12-10', '2024-12-12', true);

-- Makers
INSERT INTO makers (id, name, description, contact_email, phone, website, social_media, is_active) VALUES
    ('aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa', 'Sarah''s Ceramics', 'Modern minimalist ceramics', 'sarah@example.com', '555-0101', 'www.sarahceramics.com', '@sarahceramics', true),
    ('bbbbbbbb-2222-2222-2222-bbbbbbbbbbbb', 'Woodland Crafts', 'Sustainable wooden homeware', 'info@woodland.com', '555-0102', 'www.woodland-crafts.com', '@woodlandcrafts', true),
    ('cccccccc-3333-3333-3333-cccccccccccc', 'Silver & Stone', 'Contemporary jewelry designs', 'hello@silverstone.com', '555-0103', 'www.silverandstonestudio.com', '@silverandstone', true),
    ('dddddddd-4444-4444-4444-dddddddddddd', 'Urban Textiles', 'Modern textile art and accessories', 'contact@urbantextiles.com', '555-0104', 'www.urbantextiles.com', '@urbantextiles', true),
    ('eeeeeeee-5555-5555-5555-eeeeeeeeeeee', 'Sweet & Savory', 'Artisanal jams and preserves', 'hello@sweetandsavory.com', '555-0105', 'www.sweet-savory.com', '@sweetandsavory', true);

-- Maker Categories Junction
INSERT INTO maker_categories_junction (maker_id, category_id) VALUES
    ('aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
    ('bbbbbbbb-2222-2222-2222-bbbbbbbbbbbb', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
    ('cccccccc-3333-3333-3333-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
    ('dddddddd-4444-4444-4444-dddddddddddd', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
    ('eeeeeeee-5555-5555-5555-eeeeeeeeeeee', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'),
    ('aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa', 'ffffffff-ffff-ffff-ffff-ffffffffffff');

-- Market Edition Makers
INSERT INTO market_edition_makers (market_edition_id, maker_id, booth_number, special_notes) VALUES
    ('77777777-7777-7777-7777-777777777777', 'aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa', 'A1', 'Corner booth with demo space'),
    ('77777777-7777-7777-7777-777777777777', 'bbbbbbbb-2222-2222-2222-bbbbbbbbbbbb', 'B2', 'Needs power outlet'),
    ('88888888-8888-8888-8888-888888888888', 'cccccccc-3333-3333-3333-cccccccccccc', 'C3', 'Display case needed'),
    ('88888888-8888-8888-8888-888888888888', 'dddddddd-4444-4444-4444-dddddddddddd', 'D4', 'Double booth space'),
    ('99999999-9999-9999-9999-999999999999', 'eeeeeeee-5555-5555-5555-eeeeeeeeeeee', 'E5', 'Requires refrigeration');