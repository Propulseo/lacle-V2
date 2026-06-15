-- =============================================================================
-- 05_enrollment_vault
-- Inscription / contrat / coffre-fort documentaire du LMS La Cle Institut.
-- Possede: enrollments, vault_documents, course_item_vault_links,
--          vault_unlocks, vault_signatures, user_documents.
-- Reference (deja applique): profiles (02), formations (02), course_items (02).
-- Enums utilises (crees en 01): student_status, payment_status,
--   document_category, unlock_rule, student_status, unlock_trigger,
--   document_type, upload_source.
-- RLS: NON activee ici (centralisee en 09_rls.sql).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- enrollments : inscription d'un eleve a une formation (cycle d'essai -> certif)
-- -----------------------------------------------------------------------------
CREATE TABLE enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  formation_id uuid NOT NULL REFERENCES formations(id) ON DELETE CASCADE,
  status student_status NOT NULL DEFAULT 'decouverte',
  trial_started_at timestamptz,
  trial_ends_at timestamptz,
  contract_signed boolean NOT NULL DEFAULT false,
  contract_signed_at timestamptz,
  cgv_accepted boolean NOT NULL DEFAULT false,
  cgv_accepted_at timestamptz,
  payment_status payment_status NOT NULL DEFAULT 'trial',
  payment_confirmed_at timestamptz,
  enrolled_at timestamptz,
  certified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT enrollments_learner_formation_unique UNIQUE (learner_id, formation_id)
);

CREATE INDEX enrollments_status_idx ON enrollments (status);
CREATE INDEX enrollments_payment_status_idx ON enrollments (payment_status);

COMMENT ON TABLE enrollments IS 'Inscription d''un eleve a une formation : statut pedagogique + etat contractuel et de paiement. Ecritures via RPC/webhook/staff uniquement.';
COMMENT ON COLUMN enrollments.status IS 'Statut pedagogique de l''eleve sur cette formation (decouverte|inscrit|bloque|certifie).';
COMMENT ON COLUMN enrollments.trial_started_at IS 'Server-only : horodatage de debut de periode d''essai, pose par RPC/webhook.';
COMMENT ON COLUMN enrollments.trial_ends_at IS 'Server-only : fin calculee de la periode d''essai, pose par RPC/webhook.';
COMMENT ON COLUMN enrollments.contract_signed_at IS 'Server-only Qualiopi : horodatage de signature du contrat de formation. NULL = non signe.';
COMMENT ON COLUMN enrollments.cgv_accepted_at IS 'Server-only Qualiopi : horodatage d''acceptation des CGV. NULL = non acceptees.';
COMMENT ON COLUMN enrollments.payment_status IS 'Etat de paiement Stripe (trial|active|failed|cancelled), distinct du statut pedagogique.';
COMMENT ON COLUMN enrollments.payment_confirmed_at IS 'Server-only : horodatage de confirmation de paiement, pose par le webhook Stripe.';
COMMENT ON COLUMN enrollments.enrolled_at IS 'Server-only : horodatage de bascule en statut inscrit (apres paiement/contrat).';
COMMENT ON COLUMN enrollments.certified_at IS 'Server-only Qualiopi : horodatage de certification de l''eleve. NULL = non certifie.';

-- -----------------------------------------------------------------------------
-- vault_documents : documents du coffre-fort, rattaches a une formation
-- -----------------------------------------------------------------------------
CREATE TABLE vault_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_id uuid NOT NULL REFERENCES formations(id) ON DELETE CASCADE,
  category document_category NOT NULL,
  title text NOT NULL,
  file_url text,
  signature_required boolean NOT NULL DEFAULT false,
  unlock_rule unlock_rule NOT NULL DEFAULT 'status',
  available_from student_status,
  visible_when_locked boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX vault_documents_formation_category_idx ON vault_documents (formation_id, category);

COMMENT ON TABLE vault_documents IS 'Definition d''un document du coffre-fort (catalogue). Le deverrouillage par eleve est materialise dans vault_unlocks.';
COMMENT ON COLUMN vault_documents.unlock_rule IS 'Strategie de deverrouillage : status (selon le student_status), progressive (declenche par evenement), always (toujours dispo).';
COMMENT ON COLUMN vault_documents.available_from IS 'Pour unlock_rule = status : statut eleve minimal donnant acces au document. NULL = pas de seuil de statut.';
COMMENT ON COLUMN vault_documents.visible_when_locked IS 'true : le document apparait cadenasse tant que verrouille ; false : il reste totalement invisible jusqu''au deverrouillage.';

-- -----------------------------------------------------------------------------
-- course_item_vault_links : un item de cours peut deverrouiller / annoncer un doc
-- -----------------------------------------------------------------------------
CREATE TABLE course_item_vault_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES course_items(id) ON DELETE CASCADE,
  vault_document_id uuid NOT NULL REFERENCES vault_documents(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT course_item_vault_links_item_doc_unique UNIQUE (item_id, vault_document_id)
);

COMMENT ON TABLE course_item_vault_links IS 'Liaison entre un course_item (typiquement kind = acces_coffre) et un vault_document a deverrouiller/annoncer.';

-- -----------------------------------------------------------------------------
-- vault_unlocks : deverrouillage effectif d'un document pour un eleve (immuable)
-- -----------------------------------------------------------------------------
CREATE TABLE vault_unlocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vault_document_id uuid NOT NULL REFERENCES vault_documents(id) ON DELETE CASCADE,
  trigger_kind unlock_trigger NOT NULL,
  trigger_ref uuid,
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT vault_unlocks_learner_doc_unique UNIQUE (learner_id, vault_document_id)
);

CREATE INDEX vault_unlocks_learner_idx ON vault_unlocks (learner_id);

COMMENT ON TABLE vault_unlocks IS 'Trace immuable du deverrouillage d''un document pour un eleve. Ecriture exclusivement via RPC SECURITY DEFINER.';
COMMENT ON COLUMN vault_unlocks.trigger_kind IS 'Evenement ayant declenche le deverrouillage (video_completion|question_correct|exam_passed|status_change|manual).';
COMMENT ON COLUMN vault_unlocks.trigger_ref IS 'Reference optionnelle de l''objet declencheur (video, question, exam...) selon trigger_kind. NULL si non applicable.';

-- -----------------------------------------------------------------------------
-- vault_signatures : signature d'un document par un eleve (immuable)
-- -----------------------------------------------------------------------------
CREATE TABLE vault_signatures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vault_document_id uuid NOT NULL REFERENCES vault_documents(id) ON DELETE CASCADE,
  signed_at timestamptz NOT NULL DEFAULT now(),
  signature_meta jsonb,
  CONSTRAINT vault_signatures_learner_doc_unique UNIQUE (learner_id, vault_document_id)
);

COMMENT ON TABLE vault_signatures IS 'Trace immuable de la signature d''un document (Qualiopi). Ecriture exclusivement via RPC SECURITY DEFINER.';
COMMENT ON COLUMN vault_signatures.signature_meta IS 'Metadonnees de preuve de signature (ip, user-agent, hash, methode...) au format JSON.';

-- -----------------------------------------------------------------------------
-- user_documents : documents nominatifs deposes pour un eleve (factures, etc.)
-- -----------------------------------------------------------------------------
CREATE TABLE user_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type document_type NOT NULL,
  title text NOT NULL,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_size int,
  uploaded_by upload_source NOT NULL DEFAULT 'admin',
  uploaded_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX user_documents_learner_idx ON user_documents (learner_id);

COMMENT ON TABLE user_documents IS 'Documents nominatifs deposes pour un eleve (facture, contrat, attestation...). Ecriture is_staff() ou systeme.';
COMMENT ON COLUMN user_documents.uploaded_by IS 'Origine du depot : admin (depose par le staff) ou system (genere automatiquement).';
COMMENT ON COLUMN user_documents.file_size IS 'Taille du fichier en octets. NULL si inconnue.';
