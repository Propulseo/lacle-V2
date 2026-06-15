-- =============================================================================
-- 20260613001400_seed_auth.sql  [B2 - Comptes de bootstrap]
--   marien@la-cle.com  (admin)  /  client@lacle.com  (eleve)   mot de passe: Password
--
-- Methode fallback SQL robuste (GoTrue actuel), regles dures respectees :
--   - encrypted_password = extensions.crypt(pwd, extensions.gen_salt('bf', 10))  -> $2a$10$...
--   - TOUTES les colonnes token string a '' (sinon crash GoTrue au login)
--     (on NE met PAS phone='' : phone est UNIQUE -> deux '' = collision ; on laisse NULL)
--   - email_confirmed_at = now() ; on N'INSERE PAS confirmed_at (colonne GENEREE)
--   - ligne auth.identities OBLIGATOIRE (provider 'email') sinon login impossible
--   - role applicatif via raw_app_meta_data.role -> pose par handle_new_user() patche (A2)
--     => AUCUN UPDATE post-INSERT (donc aucun conflit avec le trigger anti-elevation)
--
-- Prerequis : handle_new_user() patche (A2, fichier 00200) + pgcrypto en schema
-- 'extensions' (fichier 00100). Idempotent (NOT EXISTS) : re-applicable sans doublon.
-- NB : comptes de DEV (mot de passe faible) — a changer en prod.
-- =============================================================================

DO $$
DECLARE
  v_admin_id  uuid := '00000000-0000-0000-0000-000000000a01';
  v_client_id uuid := '00000000-0000-0000-0000-000000000c01';
BEGIN
  -- ---------------- ADMIN : marien@la-cle.com ----------------
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'marien@la-cle.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new,
      email_change_token_current, email_change,
      reauthentication_token, phone_change, phone_change_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_admin_id, 'authenticated', 'authenticated',
      'marien@la-cle.com', extensions.crypt('Password', extensions.gen_salt('bf', 10)),
      now(),
      '{"provider":"email","providers":["email"],"role":"admin"}'::jsonb,
      '{"first_name":"Marien","last_name":"Jesson"}'::jsonb,
      now(), now(),
      '', '', '', '', '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider, identity_data,
      last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_admin_id, v_admin_id::text, 'email',
      jsonb_build_object('sub', v_admin_id::text, 'email', 'marien@la-cle.com', 'email_verified', true),
      now(), now(), now()
    );
  END IF;

  -- ---------------- ELEVE : client@lacle.com ----------------
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'client@lacle.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new,
      email_change_token_current, email_change,
      reauthentication_token, phone_change, phone_change_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_client_id, 'authenticated', 'authenticated',
      'client@lacle.com', extensions.crypt('Password', extensions.gen_salt('bf', 10)),
      now(),
      '{"provider":"email","providers":["email"],"role":"eleve"}'::jsonb,
      '{"first_name":"Client","last_name":"Test"}'::jsonb,
      now(), now(),
      '', '', '', '', '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider, identity_data,
      last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_client_id, v_client_id::text, 'email',
      jsonb_build_object('sub', v_client_id::text, 'email', 'client@lacle.com', 'email_verified', true),
      now(), now(), now()
    );
  END IF;
END $$;

-- Verification post-seed (informative) : roles attendus.
-- SELECT email, role FROM public.profiles WHERE email IN ('marien@la-cle.com','client@lacle.com');
--   marien@la-cle.com -> admin   |   client@lacle.com -> eleve
