-- ============================================================================
-- 02_identity_hierarchy
-- Owns: profiles, is_staff(uuid), handle_new_user() + trigger,
--        formations, blocs, cours, course_items
--
-- Depends on: 01 (enums app_role, formation_lifecycle, access_level,
--             access_tier, course_item_kind) deja appliquees.
-- RLS: NON activee ici (centralisee dans 09_rls.sql).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- profiles
-- PK = auth.users.id (1 profil par compte d'authentification).
-- ----------------------------------------------------------------------------
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'eleve',
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  profession text,
  is_active boolean NOT NULL DEFAULT true,
  must_change_password boolean NOT NULL DEFAULT false,
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX profiles_role_idx ON profiles (role);

COMMENT ON TABLE profiles IS 'Profil applicatif lie 1:1 a auth.users. Cree automatiquement par le trigger handle_new_user a l''inscription.';
COMMENT ON COLUMN profiles.role IS 'Role applicatif. admin ET formateur sont consideres "staff" via is_staff(). Aucune attribution automatique : tout le monde nait eleve.';
COMMENT ON COLUMN profiles.must_change_password IS 'Force le changement de mot de passe a la prochaine connexion (comptes provisionnes par l''admin).';
COMMENT ON COLUMN profiles.last_login_at IS 'Renseigne cote serveur (auth hook) ; ne pas faire confiance a une ecriture client.';

-- ----------------------------------------------------------------------------
-- is_staff(uuid)
-- Helper central pour la RLS. plpgsql STABLE SECURITY DEFINER pour pouvoir
-- lire profiles sans declencher recursivement les policies sur profiles.
-- Cree APRES profiles (reference la table dans son corps).
-- ----------------------------------------------------------------------------
CREATE FUNCTION is_staff(uid uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  is_staff_member boolean;
BEGIN
  IF uid IS NULL THEN
    RETURN false;
  END IF;

  SELECT (p.role IN ('admin', 'formateur'))
    INTO is_staff_member
  FROM public.profiles p
  WHERE p.id = uid;

  RETURN COALESCE(is_staff_member, false);
END;
$$;

COMMENT ON FUNCTION is_staff(uuid) IS 'Vrai si le profil a le role admin ou formateur. Utilise dans toutes les policies RLS. SECURITY DEFINER pour eviter la recursion des policies sur profiles.';

-- ----------------------------------------------------------------------------
-- handle_new_user()
-- Trigger AFTER INSERT ON auth.users : cree le profil applicatif depuis
-- raw_user_meta_data (first_name / last_name) et l'email du nouvel utilisateur.
-- SECURITY DEFINER pour ecrire dans public.profiles malgre la RLS.
-- ----------------------------------------------------------------------------
CREATE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_role public.app_role := 'eleve';
BEGIN
  -- A2 : le role provient de raw_app_meta_data (app_metadata) — settable
  -- UNIQUEMENT par le service_role / Admin API / seed, JAMAIS par un signup
  -- public (raw_user_meta_data est manipulable par l'utilisateur ; app_metadata
  -- ne l'est pas). Cela permet le bootstrap admin par seed SANS UPDATE post-INSERT
  -- (donc sans buter sur le trigger anti-elevation), tout en empechant un signup
  -- public de s'auto-promouvoir admin.
  BEGIN
    v_role := COALESCE((NEW.raw_app_meta_data ->> 'role')::public.app_role, 'eleve');
  EXCEPTION WHEN invalid_text_representation THEN
    v_role := 'eleve';  -- metadata invalide -> on ne casse jamais l'INSERT auth.users
  END;

  INSERT INTO public.profiles (id, role, first_name, last_name, email)
  VALUES (
    NEW.id,
    v_role,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION handle_new_user() IS 'Cree le profil a chaque INSERT auth.users. role lu depuis raw_app_meta_data (server-only : pas d''auto-promotion au signup public). first_name/last_name depuis raw_user_meta_data.';

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ----------------------------------------------------------------------------
-- protect_profile_privilege_cols() [B1 - anti-elevation de privileges]
-- La policy RLS "profiles_update_self" autorise un eleve a modifier SA ligne
-- mais ne peut pas restreindre les COLONNES. Sans ce garde-fou, un eleve
-- pourrait faire UPDATE profiles SET role='admin' WHERE id=auth.uid() et
-- devenir staff. Ce trigger BEFORE UPDATE fige role + must_change_password
-- (et is_active) sauf si l'appelant est deja staff. Les RPC/handlers staff
-- passent is_staff() ; les jobs service_role bypassent la RLS et ce trigger
-- ne les gene pas (is_staff l'autorise via leur propre role, ou ils ecrivent
-- en SQL direct hors session authentifiee).
-- ----------------------------------------------------------------------------
CREATE FUNCTION protect_profile_privilege_cols()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- On ne fige les colonnes sensibles QUE pour un utilisateur authentifie non-staff.
  -- auth.uid() IS NULL = contexte seed / service_role / migration (de confiance) :
  -- on le laisse promouvoir un role (sinon le bootstrap du 1er admin et les
  -- promotions par Server Action service_role seraient impossibles). Un client
  -- authentifie a TOUJOURS un uid ; un anon est deja bloque par la RLS UPDATE.
  IF auth.uid() IS NOT NULL AND NOT public.is_staff(auth.uid()) THEN
    NEW.role := OLD.role;
    NEW.must_change_password := OLD.must_change_password;
    NEW.is_active := OLD.is_active;
  END IF;
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION protect_profile_privilege_cols() IS 'B1: empeche un eleve authentifie d''elever son role / desactiver must_change_password / se reactiver via UPDATE self. Laisse passer le service_role/seed (auth.uid() NULL).';

CREATE TRIGGER trg_profiles_protect_priv
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION protect_profile_privilege_cols();

-- ----------------------------------------------------------------------------
-- enforce_profile_role_on_insert() [A4 - anti-elevation a l'INSERT]
-- protect_profile_privilege_cols ne couvre que l'UPDATE. Ce garde BEFORE INSERT
-- force role='eleve' pour tout INSERT en session authentifiee non-staff (defense
-- en profondeur ; en pratique aucun INSERT direct n'est expose aux clients par la
-- RLS). auth.uid() IS NULL (handle_new_user au signup, seed, service_role) =>
-- le role pose (depuis raw_app_meta_data) est conserve.
-- ----------------------------------------------------------------------------
CREATE FUNCTION enforce_profile_role_on_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.is_staff(auth.uid()) THEN
    NEW.role := 'eleve';
  END IF;
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION enforce_profile_role_on_insert() IS 'A4: force role=eleve a l''INSERT pour un authentifie non-staff. Laisse passer handle_new_user/seed/service_role (auth.uid() NULL).';

CREATE TRIGGER trg_profiles_enforce_role_insert
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION enforce_profile_role_on_insert();

-- ----------------------------------------------------------------------------
-- formations
-- Racine de la hierarchie de contenu. Multi-formation : FK formation_id partout.
-- ----------------------------------------------------------------------------
CREATE TABLE formations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  position numeric NOT NULL DEFAULT 0,
  lifecycle formation_lifecycle NOT NULL DEFAULT 'projet',
  requires_positioning boolean NOT NULL DEFAULT true,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON COLUMN formations.requires_positioning IS 'Si vrai, le bloc 1 reste verrouille tant qu''un positioning_results n''existe pas pour cet eleve (regle en attente de confirmation client).';
COMMENT ON COLUMN formations.position IS 'Ordre d''affichage. numeric pour inserer entre deux formations sans renumeroter.';

-- ----------------------------------------------------------------------------
-- blocs
-- Niveau 1 de la hierarchie pedagogique (formation > bloc > cours > item).
-- ----------------------------------------------------------------------------
CREATE TABLE blocs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_id uuid NOT NULL REFERENCES formations (id) ON DELETE CASCADE,
  numero int NOT NULL,
  titre text NOT NULL,
  description text,
  position numeric NOT NULL,
  access_level access_level NOT NULL DEFAULT 'all',
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (formation_id, numero)
);

CREATE INDEX blocs_formation_position_idx ON blocs (formation_id, position);

COMMENT ON COLUMN blocs.position IS 'Ordre d''affichage dans la formation. numeric pour inserer entre deux blocs sans renumeroter.';
COMMENT ON COLUMN blocs.access_level IS 'Niveau d''acces requis au bloc (all/valide/certifie).';

-- ----------------------------------------------------------------------------
-- cours
-- Niveau 2 de la hierarchie pedagogique.
-- ----------------------------------------------------------------------------
CREATE TABLE cours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bloc_id uuid NOT NULL REFERENCES blocs (id) ON DELETE CASCADE,
  numero int NOT NULL,
  titre text,
  position numeric NOT NULL,
  access_tier access_tier NOT NULL DEFAULT 'inscrit',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (bloc_id, numero)
);

CREATE INDEX cours_bloc_position_idx ON cours (bloc_id, position);

COMMENT ON COLUMN cours.access_tier IS 'Gating par defaut : decouverte (libre), inscrit (paye), certifie (post-examen). En attente confirmation client.';
COMMENT ON COLUMN cours.position IS 'Ordre d''affichage dans le bloc. numeric pour inserer entre deux cours sans renumeroter.';

-- ----------------------------------------------------------------------------
-- course_items
-- Niveau 3 : sequence ordonnee d'elements d'un cours (video, question,
-- acces_coffre, fin_cours). Un seul item 'fin_cours' par cours.
-- ----------------------------------------------------------------------------
CREATE TABLE course_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cours_id uuid NOT NULL REFERENCES cours (id) ON DELETE CASCADE,
  kind course_item_kind NOT NULL,
  position numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (cours_id, position)
);

CREATE INDEX course_items_cours_position_idx ON course_items (cours_id, position);

-- Un seul item de cloture (fin_cours) par cours.
CREATE UNIQUE INDEX course_items_fin_cours_unique_idx
  ON course_items (cours_id)
  WHERE kind = 'fin_cours';

COMMENT ON COLUMN course_items.position IS 'Ordre de l''item dans le cours. numeric pour inserer entre deux items sans renumeroter.';
COMMENT ON COLUMN course_items.kind IS 'Nature de l''item : video, question, acces_coffre (deblocage document) ou fin_cours (cloture, unique par cours).';
