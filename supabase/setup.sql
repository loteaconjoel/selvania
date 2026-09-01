-- Configuración de Supabase para Selvania Park.
--
-- Cómo ejecutarlo: entra a tu proyecto en supabase.com, abre "SQL Editor",
-- pega todo esto y dale a "Run". Se puede volver a ejecutar sin problema.

-- ---------------------------------------------------------------------------
-- Contenido de la página
-- ---------------------------------------------------------------------------
-- Una sola fila, con id 'main', que guarda todo el contenido como JSON: los
-- textos, las secciones, los colores y las tipografías. El panel la reescribe
-- entera en cada guardado.

create table if not exists public.site_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

-- Se activa la seguridad a nivel de fila y no se crea ninguna política.
-- Efecto: nadie puede leer ni escribir esta tabla con la clave pública. Solo
-- la clave service_role, que vive en el servidor, puede tocarla. El visitante
-- ve el contenido porque se lo sirve la página ya renderizada, no porque tenga
-- acceso a la base de datos.
alter table public.site_content enable row level security;

-- ---------------------------------------------------------------------------
-- Imágenes subidas desde el panel
-- ---------------------------------------------------------------------------
-- Bucket público: los archivos se leen por su URL a través de la CDN, pero
-- subir y borrar sigue requiriendo la clave del servidor.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;
