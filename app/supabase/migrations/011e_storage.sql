-- ===========================================
-- PART 5: STORAGE BUCKET
-- Run this fifth (in Supabase Dashboard SQL Editor)
-- ===========================================

-- Create the storage bucket for mythology images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'mythology-images',
    'mythology-images',
    TRUE,
    5242880,
    ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for the bucket
CREATE POLICY "Users can upload own images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'mythology-images' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Public read access for mythology images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'mythology-images');

CREATE POLICY "Users can delete own images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'mythology-images' 
        AND (storage.foldername(name))[1] = auth.uid()::text
    );
