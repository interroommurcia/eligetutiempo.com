-- 005: alinear el CHECK de 'relojes.estado' con los 4 valores del formulario.
--
-- Síntoma: al crear/editar un reloj desde el backoffice falla con
--   "new row for relation \"relojes\" violates check constraint \"relojes_estado_check\""
-- Causa: el CHECK antiguo esperaba otros nombres (ej. 'Excelente'/'Muy bueno'/'Bueno').
--
-- Este script:
--   1) Normaliza los posibles valores antiguos a los nuevos.
--   2) Reemplaza el CHECK por los 4 valores que usa la UI.
--   3) Es idempotente: puedes relanzarlo sin romper nada.

-- 1) Mapear valores legacy si existieran:
UPDATE relojes SET estado = 'Como nuevo'
  WHERE estado IN ('Excelente', 'Excelente estado');
UPDATE relojes SET estado = 'Muy buen estado'
  WHERE estado IN ('Muy bueno', 'Muy Bueno');
UPDATE relojes SET estado = 'En condiciones aceptables'
  WHERE estado IN ('Bueno', 'Aceptable');

-- Fallback: cualquier valor fuera de los permitidos pasa a 'Como nuevo'
-- (no se pierde la fila; podrás editarla luego).
UPDATE relojes SET estado = 'Como nuevo'
  WHERE estado NOT IN ('Nuevo con etiquetas','Como nuevo','Muy buen estado','En condiciones aceptables');

-- 2) Reemplazar el CHECK por los 4 valores correctos.
ALTER TABLE relojes DROP CONSTRAINT IF EXISTS relojes_estado_check;
ALTER TABLE relojes ADD CONSTRAINT relojes_estado_check
  CHECK (estado IN ('Nuevo con etiquetas','Como nuevo','Muy buen estado','En condiciones aceptables'));
