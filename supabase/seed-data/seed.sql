-- Places
INSERT INTO places (name, address, city, country, latitude, longitude, additional_info, is_active) VALUES
    ('Marché Bonsecours', '350 Rue Saint-Paul Est', 'Montreal', 'Canada', 45.5082, -73.5521, 'Historic market building in Old Montreal', true),
    ('Place des Arts', '175 Rue Sainte-Catherine Ouest', 'Montreal', 'Canada', 45.5077, -73.5694, 'Cultural complex with multiple halls', true),
    ('Olympic Stadium', '4545 Avenue Pierre-de Coubertin', 'Montreal', 'Canada', 45.5579, -73.5515, 'Massive indoor space', true);

-- Maker Categories
INSERT INTO maker_categories (name, description) VALUES
    ('Jewelry', 'Handmade jewelry and accessories'),
    ('Ceramics', 'Pottery, ceramic art, and functional pieces'),
    ('Textiles', 'Handwoven and printed textiles, clothing'),
    ('Woodworking', 'Handcrafted wooden items and furniture'),
    ('Food', 'Artisanal food products'),
    ('Art', 'Paintings, prints, and visual arts');

-- Markets
INSERT INTO markets (name, description, is_active) VALUES
    ('Downtown Artisan Market', 'Weekly market in the heart of downtown', true),
    ('Seasonal Makers Fair', 'Quarterly seasonal celebration of local makers', true),
    ('Night Market', 'Evening market with food and crafts', true);

-- Market Editions (updated to use place_id)
INSERT INTO market_editions (market_id, place_id, name, start_date, end_date, is_active) VALUES
    ((SELECT id FROM markets WHERE name = 'Downtown Artisan Market'), 
     (SELECT id FROM places WHERE name = 'Marché Bonsecours'),
     'Spring Downtown Market 2024', '2024-04-15', '2024-04-17', true),
    ((SELECT id FROM markets WHERE name = 'Seasonal Makers Fair'),
     (SELECT id FROM places WHERE name = 'Place des Arts'),
     'Summer Makers Fair 2024', '2024-07-01', '2024-07-03', true),
    ((SELECT id FROM markets WHERE name = 'Night Market'),
     (SELECT id FROM places WHERE name = 'Olympic Stadium'),
     'Winter Night Market 2024', '2024-12-10', '2024-12-12', true);

-- Makers
INSERT INTO makers (name, description, contact_email, phone, website, social_media, is_active) VALUES
    ('Sarah''s Ceramics', 'Modern minimalist ceramics', 'sarah@example.com', '555-0101', 'www.sarahceramics.com', '@sarahceramics', true),
    ('Woodland Crafts', 'Sustainable wooden homeware', 'info@woodland.com', '555-0102', 'www.woodland-crafts.com', '@woodlandcrafts', true),
    ('Silver & Stone', 'Contemporary jewelry designs', 'hello@silverstone.com', '555-0103', 'www.silverandstonestudio.com', '@silverandstone', true),
    ('Urban Textiles', 'Modern textile art and accessories', 'contact@urbantextiles.com', '555-0104', 'www.urbantextiles.com', '@urbantextiles', true),
    ('Sweet & Savory', 'Artisanal jams and preserves', 'hello@sweetandsavory.com', '555-0105', 'www.sweet-savory.com', '@sweetandsavory', true);

-- Maker Categories Junction
INSERT INTO maker_categories_junction (maker_id, category_id) VALUES
    ((SELECT id FROM makers WHERE name = 'Sarah''s Ceramics'), (SELECT id FROM maker_categories WHERE name = 'Ceramics')),
    ((SELECT id FROM makers WHERE name = 'Woodland Crafts'), (SELECT id FROM maker_categories WHERE name = 'Woodworking')),
    ((SELECT id FROM makers WHERE name = 'Silver & Stone'), (SELECT id FROM maker_categories WHERE name = 'Jewelry')),
    ((SELECT id FROM makers WHERE name = 'Urban Textiles'), (SELECT id FROM maker_categories WHERE name = 'Textiles')),
    ((SELECT id FROM makers WHERE name = 'Sweet & Savory'), (SELECT id FROM maker_categories WHERE name = 'Food')),
    ((SELECT id FROM makers WHERE name = 'Sarah''s Ceramics'), (SELECT id FROM maker_categories WHERE name = 'Art'));

-- Market Edition Makers
INSERT INTO market_edition_makers (market_edition_id, maker_id, booth_number, special_notes) VALUES
    ((SELECT id FROM market_editions WHERE name = 'Spring Downtown Market 2024'), 
     (SELECT id FROM makers WHERE name = 'Sarah''s Ceramics'),
     'A1', 'Corner booth with demo space'),
    ((SELECT id FROM market_editions WHERE name = 'Spring Downtown Market 2024'),
     (SELECT id FROM makers WHERE name = 'Woodland Crafts'),
     'B2', 'Needs power outlet'),
    ((SELECT id FROM market_editions WHERE name = 'Summer Makers Fair 2024'),
     (SELECT id FROM makers WHERE name = 'Silver & Stone'),
     'C3', 'Display case needed'),
    ((SELECT id FROM market_editions WHERE name = 'Summer Makers Fair 2024'),
     (SELECT id FROM makers WHERE name = 'Urban Textiles'),
     'D4', 'Double booth space'),
    ((SELECT id FROM market_editions WHERE name = 'Winter Night Market 2024'),
     (SELECT id FROM makers WHERE name = 'Sweet & Savory'),
     'E5', 'Requires refrigeration');