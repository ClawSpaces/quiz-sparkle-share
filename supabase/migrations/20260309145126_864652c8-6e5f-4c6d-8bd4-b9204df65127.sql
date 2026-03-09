ALTER TABLE public.categories ADD COLUMN image_url text;

UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop' WHERE slug = 'prosopikotita';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&h=400&fit=crop' WHERE slug = 'diasimotites';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=400&fit=crop' WHERE slug = 'tainies-seires';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1461896836934-bd45ba8c8e36?w=600&h=400&fit=crop' WHERE slug = 'athlitika';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=400&fit=crop' WHERE slug = 'mousiki';
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&h=400&fit=crop' WHERE slug = 'genikes-gnoseis';