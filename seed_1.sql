-- seed.sql: starter data. Run it again any time to reset the data.

truncate reporters, incidents restart identity;

insert into reporters (name, phone, community, code) values
  ('Barine Nwiado',  '08031234567', 'K-Dere', '418302'),
  ('Comfort Deezia', '08037654321', 'Bori',   '290047'),
  ('Ledum Kpone',    '08034567890', 'Bomu',   '735119'),
  ('Nedam Gbarale',  '08039876543', 'Kpean',  '561283');

insert into incidents
  (title, type, community, lga, description, severity, photo, status, status_reason, reporter_code, reported_on)
values
  ('Burnt drums at Eleme roadside',
   'Waste dumping', 'Akpajo', 'Eleme',
   'Burnt drums and ash dumped along the roadside, with a strong chemical smell.',
   'Low', 'images/akpajo-drums.webp', 'Not an incident', 'This is a council waste-burning point, not a spill.', '561283', '2026-08-25'),
  ('Well water tastes of fuel at Sime',
   'Water contamination', 'Sime', 'Tai',
   'Two household wells close to each other now taste of fuel.',
   'High', 'images/sime-well.webp', 'Resolved', 'Wells capped and a new borehole drilled.', '418302', '2026-08-28'),
  ('Brown water at Bori borehole',
   'Water contamination', 'Bori', 'Khana',
   'Borehole water running brown with a strong smell.',
   'Medium', 'images/bori-water.webp', 'Resolved', 'Borehole flushed and retested. Water clear.', '418302', '2026-09-02'),
  ('Drums beside farmland at Nchia',
   'Waste dumping', 'Nchia', 'Eleme',
   'Four metal drums left at the edge of a cassava farm. Contents unknown.',
   'Medium', 'images/nchia-drums.webp', 'Under review', 'Samples taken from the drums for testing.', '735119', '2026-09-04'),
  ('Discoloured stream near Kaa',
   'Water contamination', 'Kaa', 'Khana',
   'The stream that feeds the village turned grey overnight. Dead fish on the surface.',
   'High', 'images/kaa-water.webp', 'New', '', '290047', '2026-09-06'),
  ('Night flaring at Bomu',
   'Gas flaring', 'Bomu', 'Gokana',
   'A flare burning through the night, visible from the village.',
   'Medium', 'images/bomu-flare.webp', 'Under review', 'Operator asked to explain the restart.', '735119', '2026-09-13'),
  ('Sheen on the water at Kono jetty',
   'Oil spill', 'Kono', 'Tai',
   'A thin oily sheen spreading from a pipeline crossing near the jetty.',
   'Medium', 'images/kono-sheen.webp', 'Under review', 'A HYPREP team visits the jetty on Friday.', '290047', '2026-09-16'),
  ('Flare stack restarted at Kpean',
   'Gas flaring', 'Kpean', 'Gokana',
   'The old flare stack was relit after months quiet. Ash is settling on rooftops.',
   'High', 'images/kpean-flare.webp', 'New', '', '561283', '2026-09-19'),
  ('Crude spill at K-Dere creek',
   'Oil spill', 'K-Dere', 'Gokana',
   'Oil across the surface of the creek for roughly 200 metres.',
   'High', 'images/kdere-spill.webp', 'New', '', '418302', '2026-09-22');
