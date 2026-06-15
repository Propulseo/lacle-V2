-- =============================================================================
-- 20260613001200_site_cms.sql  [Phase 3 - CMS site vitrine]
-- Contenu editable du site vitrine "la-cle-institut" par le staff (Marien).
-- CMS CIBLE + GARDE-FOUS: seuls les contenus structures/valeurs surs sont
-- editables ; le hero anime, les textes legaux et les formulations de
-- conformite restent FIGES dans le code (jamais dans ces tables).
--
-- Depend de: 02 (profiles, is_staff) et 08 (set_updated_at) deja appliques.
-- RLS et triggers inclus DANS ce fichier (concern autonome, ajoute apres le coeur).
-- =============================================================================

-- ----------------------------------------------------------------------------
-- ENUMS
-- ----------------------------------------------------------------------------
-- Types de collections editables (chaque type est rendu par un composant front
-- dedie -> ajouter un type = ajouter du code front, d'ou l'enum).
CREATE TYPE site_collection_type AS ENUM (
  'formations',              -- catalogue (PNL, AT, Systemique)
  'modules_pnl',             -- les 7 modules de la fiche PNL
  'faq',                     -- FAQ PNL
  'sections_concept',        -- sections de la page "Le concept"
  'sections_vocation',       -- sections de la page "Notre vocation"
  'parcours_steps',          -- etapes du parcours (distanciel / certification)
  'team_bios',               -- bios equipe (courtes)
  'contact_blocks',          -- blocs de la page contact
  'accessibilite_procedure', -- etapes de la procedure handicap
  'accessibilite_reseau'     -- reseau de partenaires handicap
);

CREATE TYPE site_media_kind AS ENUM ('image', 'video_link', 'document');

-- ----------------------------------------------------------------------------
-- site_content : valeurs simples cle/valeur (le "FACILE" de l'audit)
-- Ex: baseline, email, tarif, stats Qualiopi, date de mise a jour, SEO par page.
-- ----------------------------------------------------------------------------
CREATE TABLE site_content (
  key        text PRIMARY KEY,                       -- ex 'baseline', 'tarif', 'seo:/formations'
  group_name text NOT NULL DEFAULT 'general',        -- regroupement pour l'UI admin
  label      text NOT NULL,                          -- libelle lisible cote admin
  value      jsonb NOT NULL,                         -- string | number | objet (stats)
  updated_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE site_content IS 'Valeurs editables simples du site vitrine (cle/valeur). Lecture publique, ecriture staff.';
COMMENT ON COLUMN site_content.value IS 'jsonb pour accepter texte court, nombre ou objet (ex: stats Qualiopi). Les formulations de conformite NE passent PAS par ici (figees en code).';

-- ----------------------------------------------------------------------------
-- site_collections : items structures ordonnables (le "STRUCTURE" de l'audit)
-- ----------------------------------------------------------------------------
CREATE TABLE site_collections (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type       site_collection_type NOT NULL,
  slug       text,                                   -- identite stable optionnelle (ex 'module-1')
  position   numeric NOT NULL DEFAULT 0,             -- ordre fractionnaire (insert sans renumeroter)
  data       jsonb NOT NULL DEFAULT '{}',            -- champs selon le type (title, text, quote, question, answer...)
  published  boolean NOT NULL DEFAULT true,
  updated_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX site_collections_type_position_idx ON site_collections (type, position);
CREATE UNIQUE INDEX site_collections_type_slug_uidx ON site_collections (type, slug) WHERE slug IS NOT NULL;

COMMENT ON TABLE site_collections IS 'Collections structurees editables du site vitrine (FAQ, modules, sections, bios...). SELECT public si published, ecriture staff.';
COMMENT ON COLUMN site_collections.data IS 'Charge utile structuree selon type. Le front valide/rend chaque type ; pas de HTML libre (garde-fou typo/conformite).';

-- ----------------------------------------------------------------------------
-- site_media : assets (images/documents uploades vers Storage, ou lien video)
-- ----------------------------------------------------------------------------
CREATE TABLE site_media (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind        site_media_kind NOT NULL,
  url         text NOT NULL,                         -- URL publique Storage ou lien video externe
  bucket      text,                                  -- bucket Storage (null si lien externe)
  path        text,                                  -- chemin dans le bucket (null si lien externe)
  title       text,
  alt         text,                                  -- texte alternatif (accessibilite/SEO)
  mime        text,
  width       int,
  height      int,
  bytes       int,
  uploaded_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX site_media_kind_idx ON site_media (kind);

COMMENT ON TABLE site_media IS 'Mediatheque du site vitrine. Images/documents dans Storage (bucket site-media) ; les videos restent des liens externes (YouTube/Vimeo).';

-- ----------------------------------------------------------------------------
-- site_content_versions : historique (snapshot AVANT modification) -> rollback
-- Garde-fou: si Marien casse un contenu, on restaure la version precedente.
-- ----------------------------------------------------------------------------
CREATE TABLE site_content_versions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity      text NOT NULL,                         -- 'site_content' | 'site_collections'
  entity_key  text NOT NULL,                         -- key (site_content) ou id::text (site_collections)
  snapshot    jsonb NOT NULL,                        -- etat AVANT modification
  changed_by  uuid REFERENCES profiles(id) ON DELETE SET NULL,
  changed_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX site_content_versions_lookup_idx ON site_content_versions (entity, entity_key, changed_at DESC);

COMMENT ON TABLE site_content_versions IS 'Historique des modifications du contenu editable (snapshot avant ecriture) pour rollback. Lecture staff, ecriture via trigger SECURITY DEFINER.';

-- ----------------------------------------------------------------------------
-- updated_at : reutilise la fonction generique du fichier 08
-- ----------------------------------------------------------------------------
CREATE TRIGGER trg_site_content_set_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_site_collections_set_updated_at
  BEFORE UPDATE ON site_collections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Versioning + tracage de l'auteur (BEFORE INSERT OR UPDATE)
-- - sur UPDATE: archive l'ancienne ligne dans site_content_versions
-- - dans tous les cas: positionne updated_by = auth.uid()
-- SECURITY DEFINER pour ecrire dans site_content_versions malgre la RLS.
-- ----------------------------------------------------------------------------
CREATE FUNCTION snapshot_site_content_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_key text;
BEGIN
  NEW.updated_by := auth.uid();

  IF TG_OP = 'UPDATE' THEN
    IF TG_TABLE_NAME = 'site_content' THEN
      v_key := OLD.key;
    ELSE
      v_key := OLD.id::text;
    END IF;

    INSERT INTO public.site_content_versions (entity, entity_key, snapshot, changed_by)
    VALUES (TG_TABLE_NAME, v_key, to_jsonb(OLD), auth.uid());
  END IF;

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION snapshot_site_content_change() IS 'Archive la version precedente (UPDATE) dans site_content_versions et trace updated_by. SECURITY DEFINER.';

CREATE TRIGGER trg_site_content_version
  BEFORE INSERT OR UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION snapshot_site_content_change();

CREATE TRIGGER trg_site_collections_version
  BEFORE INSERT OR UPDATE ON site_collections
  FOR EACH ROW EXECUTE FUNCTION snapshot_site_content_change();

-- ----------------------------------------------------------------------------
-- RLS
-- ----------------------------------------------------------------------------
ALTER TABLE site_content          ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_collections      ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_media            ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content_versions ENABLE ROW LEVEL SECURITY;

-- site_content : lecture publique (le site est public), ecriture staff
CREATE POLICY site_content_select_public ON site_content
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY site_content_write_staff ON site_content
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- site_collections : lecture publique des items publies, staff voit tout
CREATE POLICY site_collections_select_published ON site_collections
  FOR SELECT TO anon, authenticated
  USING (published OR public.is_staff(auth.uid()));
CREATE POLICY site_collections_write_staff ON site_collections
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- site_media : lecture publique, ecriture staff
CREATE POLICY site_media_select_public ON site_media
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY site_media_write_staff ON site_media
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- site_content_versions : lecture staff uniquement ; ecriture via trigger DEFINER
CREATE POLICY site_content_versions_select_staff ON site_content_versions
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
