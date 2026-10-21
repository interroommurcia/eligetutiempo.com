-- 001: estado de venta por reloj (Disponible / Reservado / Vendido)
ALTER TABLE relojes
  ADD COLUMN IF NOT EXISTS estado_venta TEXT NOT NULL DEFAULT 'Disponible'
  CHECK (estado_venta IN ('Disponible','Reservado','Vendido'));

CREATE INDEX IF NOT EXISTS relojes_estado_venta_idx ON relojes(estado_venta);
