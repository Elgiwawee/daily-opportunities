-- Add admin role for all existing users
INSERT INTO public.user_roles (user_id, role)
VALUES 
  ('af47dc43-c6ff-45cf-917b-213d27509122', 'admin'),
  ('48176503-51c5-4d70-9ad4-8370cf814756', 'admin'),
  ('1343e1b5-2306-4ef5-8803-77b3137d752d', 'admin'),
  ('10dbf72d-d54e-4323-8519-d34f3e9f62b6', 'admin'),
  ('20836925-56f4-4705-b6e4-2143c6f1ab50', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;