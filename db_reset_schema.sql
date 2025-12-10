-- DANGER: This script deletes all existing data!
DROP TABLE IF EXISTS quiz_results;

-- Create table for quiz results
CREATE TABLE quiz_results (
    id SERIAL PRIMARY KEY,
    ps_number VARCHAR(255) NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    feedback INTEGER, -- 0-3 scale
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add index for PS Number to speed up duplicate checks
CREATE INDEX idx_ps_number ON quiz_results(ps_number);

-- Output confirmation
SELECT 'Database reset successfully. Table quiz_results recreated.' as message;
