-- =============================================================================
-- 01 — Extensions & Enums
-- LMS La Cle Institut — schema Supabase (Postgres 15)
-- Ce fichier possede: l'extension pgcrypto + les 28 types ENUM du contrat.
-- Aucun autre objet (tables, fonctions, RLS) n'est cree ici.
-- =============================================================================

-- pgcrypto dans le schema dedie 'extensions' (convention Supabase) : fournit
-- crypt()/gen_salt() pour le seed des comptes auth, et evite l'advisor
-- 'extension_in_public'. gen_random_uuid() reste fourni par le core PG15.
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- -----------------------------------------------------------------------------
-- ENUMS (28)
-- -----------------------------------------------------------------------------

-- Roles applicatifs. admin ET formateur = "staff" (helper is_staff()).
CREATE TYPE app_role AS ENUM ('eleve', 'admin', 'formateur');

-- Cycle de vie d'une formation.
CREATE TYPE formation_lifecycle AS ENUM ('available', 'creation', 'projet');

-- Niveau d'acces d'un bloc.
CREATE TYPE access_level AS ENUM ('all', 'valide', 'certifie');

-- Palier d'acces d'un cours (gating essai/inscription/certification).
CREATE TYPE access_tier AS ENUM ('decouverte', 'inscrit', 'certifie');

-- Nature d'un element de cours (sequencement pedagogique).
CREATE TYPE course_item_kind AS ENUM ('video', 'question', 'acces_coffre', 'fin_cours');

-- Portee d'une question (cours vs composition d'examen).
CREATE TYPE question_scope AS ENUM ('cours', 'examen_bloc', 'examen_final');

-- Type pedagogique d'une question (methode La Cle).
CREATE TYPE question_type AS ENUM ('philosophique', 'anticipative', 'validation', 'integration');

-- Format de saisie d'une question.
CREATE TYPE question_format AS ENUM ('qcm', 'vrai_faux', 'texte');

-- Nature d'un examen.
CREATE TYPE exam_kind AS ENUM ('bloc', 'final');

-- Statut de progression de l'examen final (inclut le cas pratique).
CREATE TYPE final_exam_status AS ENUM (
  'not_started',
  'requested',
  'scheduled',
  'passed',
  'failed',
  'practical_case_open',
  'practical_case_passed',
  'practical_case_failed'
);

-- Statut de correction (soumissions a relecture humaine).
CREATE TYPE submission_status AS ENUM ('pending', 'corrected');

-- Statut de relecture / regeneration (scheduled_reviews, relecture reponses).
CREATE TYPE review_status AS ENUM ('pending', 'done', 'superseded');

-- Statut d'un eleve dans une formation (gating contenu).
CREATE TYPE student_status AS ENUM ('decouverte', 'inscrit', 'bloque', 'certifie');

-- Statut de paiement d'une inscription.
CREATE TYPE payment_status AS ENUM ('trial', 'active', 'failed', 'cancelled');

-- Statut d'une transaction de paiement (Stripe).
CREATE TYPE payment_txn_status AS ENUM ('pending', 'succeeded', 'failed', 'refunded');

-- Categorie d'un document du coffre-fort (Qualiopi).
CREATE TYPE document_category AS ENUM ('contractuels', 'financiers', 'pedagogiques', 'qualite', 'pratiques');

-- Type d'un document utilisateur.
CREATE TYPE document_type AS ENUM ('facture', 'contrat', 'attestation', 'autre');

-- Source d'upload d'un document.
CREATE TYPE upload_source AS ENUM ('admin', 'system');

-- Regle de deverrouillage d'un document du coffre-fort.
CREATE TYPE unlock_rule AS ENUM ('status', 'progressive', 'always');

-- Declencheur de deverrouillage d'un document du coffre-fort.
CREATE TYPE unlock_trigger AS ENUM (
  'video_completion',
  'question_correct',
  'exam_passed',
  'status_change',
  'manual'
);

-- Statut de progression generique (cours, blocs).
CREATE TYPE progress_status AS ENUM ('not_started', 'in_progress', 'completed');

-- Statut d'engagement de l'eleve (relances).
CREATE TYPE engagement_status AS ENUM (
  'actif',
  'inactif_7j',
  'inactif_14j',
  'inactif_28j',
  'inactif_42j',
  'abandonne'
);

-- Canal d'une relance d'engagement.
CREATE TYPE reminder_channel AS ENUM ('email', 'call');

-- Type d'enquete de satisfaction (a chaud / a froid).
CREATE TYPE satisfaction_type AS ENUM ('chaud', 'froid');

-- Type de signalement (video / contenu).
CREATE TYPE report_type AS ENUM ('bug', 'incoherence');

-- Statut d'un signalement.
CREATE TYPE report_status AS ENUM ('ouvert', 'en_cours', 'resolu');

-- Type de ressource de revision.
CREATE TYPE revision_resource_type AS ENUM ('pdf', 'question', 'video');

-- Role d'un message de chatbot.
CREATE TYPE chat_role AS ENUM ('user', 'assistant');
