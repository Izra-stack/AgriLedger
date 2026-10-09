CREATE SEQUENCE IF NOT EXISTS farmer_code_seq;

SELECT setval(
  'farmer_code_seq',
  COALESCE(MAX(code_number), 1),
  MAX(code_number) IS NOT NULL
)
FROM (
  SELECT MAX((substring(farmer_code FROM '^FRM-([0-9]+)$'))::bigint) AS code_number
  FROM farmers
  WHERE farmer_code ~ '^FRM-[0-9]+$'
) existing_codes;
