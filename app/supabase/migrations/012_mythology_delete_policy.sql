-- Add DELETE policy for mythologies table
-- This allows students to delete their own mythologies
-- Required for the deletion feature to work

CREATE POLICY "Students can delete own mythologies"
  ON public.mythologies FOR DELETE
  USING (created_by = auth.uid());

-- Also allow teachers to delete mythologies from their classrooms
CREATE POLICY "Teachers can delete classroom mythologies"
  ON public.mythologies FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'teacher'
      AND mythologies.classroom_id IN (
        SELECT id FROM public.classrooms WHERE teacher_id = auth.uid()
      )
    )
  );
