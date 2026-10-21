-- 006: fix definitivo del CHECK de 'relojes.estado'.
--
-- La migración 005 no se aplicaba porque hacía los UPDATE *antes* del DROP CHECK:
-- el CHECK viejo (que esperaba 'Mint', 'Very Good', 'Good', 'Fair' en inglés)
-- rechazaba el UPDATE a los valores en español y la transacción abortaba, dejando
-- el CHECK intacto.
--
-- Orden correcto: DROP → UPDATE → ADD. Idempotente.

-- 1) Quitamos el CHECK para poder tocar los valores sin bloqueo.
ALTER TABLE relojes DROP CONSTRAINT IF EXISTS relojes_estado_check;

-- 2) Normalizamos valores legacy (inglés + variantes anteriores en español)
--    al vocabulario actual de 4 valores.
UPDATE relojes SET estado = 'Como nuevo'
  WHERE estado IN ('Mint', 'Excelente', 'Excelente estado');

UPDATE relojes SET estado = 'Muy buen estado'
  WHERE estado IN ('Very Good', 'Muy bueno', 'Muy Bueno');

UPDATE relojes SET estado = 'En condiciones aceptables'
  WHERE estado IN ('Good', 'Fair', 'Poor', 'Bueno', 'Aceptable');

-- Fallback por seguridad: cualquier otro valor desconocido lo normalizamos a
-- 'Como nuevo' (no borra la fila; podrás editarla después).
UPDATE relojes SET estado = 'Como nuevo'
  WHERE estado NOT IN (
    'Nuevo con etiquetas',
    'Como nuevo',
    'Muy buen estado',
    'En condiciones aceptables'
  );

-- 3) Añadimos el CHECK nuevo con los 4 valores correctos.
ALTER TABLE relojes ADD CONSTRAINT relojes_estado_check
  CHECK (estado IN (
    'Nuevo con etiquetas',
    'Como nuevo',
    'Muy buen estado',
    'En condiciones aceptables'
  ));
