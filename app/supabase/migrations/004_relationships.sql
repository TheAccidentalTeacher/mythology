-- Create relationships table for character connections
CREATE TABLE IF NOT EXISTS relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mythology_id UUID NOT NULL REFERENCES mythologies(id) ON DELETE CASCADE,
  character_1_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  character_2_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL CHECK (relationship_type IN (
    'parent', 'child', 'sibling', 'spouse', 'rival', 'ally', 'enemy',
    'mentor', 'student', 'creator', 'creation', 'friend', 'romantic'
  )),
  description TEXT,
  strength INTEGER DEFAULT 5 CHECK (strength >= 1 AND strength <= 10),
  is_mutual BOOLEAN DEFAULT true,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_relationships_mythology ON relationships(mythology_id);
CREATE INDEX idx_relationships_char1 ON relationships(character_1_id);
CREATE INDEX idx_relationships_char2 ON relationships(character_2_id);
CREATE INDEX idx_relationships_type ON relationships(relationship_type);

-- Prevent duplicate relationships (same characters, same type)
CREATE UNIQUE INDEX idx_relationships_unique ON relationships(
  LEAST(character_1_id, character_2_id),
  GREATEST(character_1_id, character_2_id),
  relationship_type
) WHERE is_mutual = true;

-- Row Level Security (RLS) Policies
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read relationships from their mythologies
CREATE POLICY "Users can view relationships from their mythologies"
  ON relationships FOR SELECT
  USING (
    mythology_id IN (
      SELECT id FROM mythologies
      WHERE created_by = auth.uid()
      OR visibility = 'public'
    )
  );

-- Allow users to create relationships for their own mythologies
CREATE POLICY "Users can create relationships for their mythologies"
  ON relationships FOR INSERT
  WITH CHECK (
    mythology_id IN (
      SELECT id FROM mythologies WHERE created_by = auth.uid()
    )
    AND created_by = auth.uid()
  );

-- Allow users to update their own relationships
CREATE POLICY "Users can update their own relationships"
  ON relationships FOR UPDATE
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Allow users to delete their own relationships
CREATE POLICY "Users can delete their own relationships"
  ON relationships FOR DELETE
  USING (created_by = auth.uid());

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_relationships_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_relationships_timestamp
  BEFORE UPDATE ON relationships
  FOR EACH ROW
  EXECUTE FUNCTION update_relationships_updated_at();

-- Comment on table
COMMENT ON TABLE relationships IS 'Stores connections between characters (parent, sibling, rival, ally, etc.)';
