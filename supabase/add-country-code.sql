-- Migration: Add country_code column to city_logs
-- ISO 3166-1 alpha-2 country code (e.g. "DK", "JP", "IT")
-- This replaces the emoji-based flag_emoji field for SVG flag rendering.

ALTER TABLE city_logs
ADD COLUMN IF NOT EXISTS country_code TEXT DEFAULT '';

-- Optional: Backfill country_code for existing rows based on known mappings.
-- Uncomment and adjust as needed:
-- UPDATE city_logs SET country_code = 'DK' WHERE city = 'Copenhagen';
-- UPDATE city_logs SET country_code = 'JP' WHERE city IN ('Kyoto', 'Osaka', 'Niseko');
-- UPDATE city_logs SET country_code = 'IT' WHERE city IN ('Milan', 'Palermo');
-- UPDATE city_logs SET country_code = 'GR' WHERE city IN ('Milos', 'Santorini');
-- UPDATE city_logs SET country_code = 'GB' WHERE city = 'London';
-- UPDATE city_logs SET country_code = 'CN' WHERE city IN ('Hong Kong', 'Shanghai');
-- UPDATE city_logs SET country_code = 'MA' WHERE city IN ('Marrakech', 'Fez');
-- UPDATE city_logs SET country_code = 'IS' WHERE city = 'Reykjavik';
-- UPDATE city_logs SET country_code = 'AR' WHERE city = 'Buenos Aires';
-- UPDATE city_logs SET country_code = 'PT' WHERE city IN ('Lisbon', 'Porto');
-- UPDATE city_logs SET country_code = 'KR' WHERE city = 'Seoul';
-- UPDATE city_logs SET country_code = 'ZA' WHERE city = 'Cape Town';
-- UPDATE city_logs SET country_code = 'AT' WHERE city = 'Vienna';
-- UPDATE city_logs SET country_code = 'CU' WHERE city = 'Havana';
-- UPDATE city_logs SET country_code = 'BE' WHERE city = 'Bruges';
-- UPDATE city_logs SET country_code = 'IN' WHERE city = 'Jaipur';
-- UPDATE city_logs SET country_code = 'TW' WHERE city = 'Taipei';
-- UPDATE city_logs SET country_code = 'NO' WHERE city = 'Bergen';
-- UPDATE city_logs SET country_code = 'JO' WHERE city = 'Petra';
-- UPDATE city_logs SET country_code = 'MX' WHERE city = 'Oaxaca';
-- UPDATE city_logs SET country_code = 'HR' WHERE city = 'Dubrovnik';
-- UPDATE city_logs SET country_code = 'LA' WHERE city = 'Luang Prabang';
-- UPDATE city_logs SET country_code = 'AE' WHERE city = 'Dubai';
