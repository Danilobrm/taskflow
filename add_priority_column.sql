-- Adicionar coluna priority na tabela tasks
-- Execute este SQL no SQL Editor do Supabase

ALTER TABLE tasks 
ADD COLUMN priority VARCHAR(10) CHECK (priority IN ('baixa', 'media', 'alta'));

-- Comentário sobre a coluna
COMMENT ON COLUMN tasks.priority IS 'Prioridade da tarefa: baixa, media, alta'; 