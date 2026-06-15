// scripts/test-rls-crud.mjs
// Tests RLS/CRUD post-migration (chemin JWT reel) : login des comptes seed,
// anti-escalade de privilege, isolation eleve, secret des reponses, tables
// immuables, droits staff. A lancer APRES apply des migrations + seed.
//
// Usage : node scripts/test-rls-crud.mjs
// Env   : SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
//         (la service_role ne sert QU'au check/cleanup, jamais a asserter la RLS)
import { createClient } from "@supabase/supabase-js";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

const URL = process.env.SUPABASE_URL;
const ANON = process.env.SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
assert.ok(URL && ANON && SERVICE, "SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY requis");

const admin = createClient(URL, SERVICE, { auth: { persistSession: false } });
let passed = 0, failed = 0;

async function test(name, fn) {
  try { await fn(); passed++; console.log(`  PASS  ${name}`); }
  catch (e) { failed++; console.log(`  FAIL  ${name}\n        ${e.message}`); }
}
function anonClient() { return createClient(URL, ANON, { auth: { persistSession: false } }); }
async function signIn(email, password) {
  const c = anonClient();
  const { data, error } = await c.auth.signInWithPassword({ email, password });
  assert.ok(!error, `login ${email}: ${error?.message}`);
  return { client: c, uid: data.user.id };
}

console.log("--- RLS / CRUD La Cle ---");

// 0. Login des comptes seed (prouve le seed auth : crypt cost 10 + auth.identities)
const adminS = await signIn("marien@la-cle.com", "Password");
const eleveS = await signIn("client@lacle.com", "Password");

// 1. Roles attendus (handle_new_user a lu raw_app_meta_data.role)
await test("seed: marien=admin, client=eleve", async () => {
  const { data: a } = await admin.from("profiles").select("role").eq("email", "marien@la-cle.com").single();
  const { data: c } = await admin.from("profiles").select("role").eq("email", "client@lacle.com").single();
  assert.equal(a.role, "admin");
  assert.equal(c.role, "eleve");
});

// 2. Anti-escalade UPDATE (trigger B1) : un eleve ne peut pas se promouvoir
await test("anti-escalade: eleve UPDATE role=admin neutralise", async () => {
  await eleveS.client.from("profiles").update({ role: "admin" }).eq("id", eleveS.uid);
  const { data } = await admin.from("profiles").select("role").eq("id", eleveS.uid).single();
  assert.equal(data.role, "eleve", "le role est passe admin malgre B1 !");
});

// 3. Isolation lecture : l'eleve ne voit que SES video_progress
await test("isolation: video_progress self only", async () => {
  const { data } = await eleveS.client.from("video_progress").select("learner_id");
  for (const r of data ?? []) assert.equal(r.learner_id, eleveS.uid);
});

// 4. Isolation ecriture (WITH CHECK) : learner_id falsifie refuse
await test("isolation: video_progress WITH CHECK bloque learner_id d'autrui", async () => {
  const { error } = await eleveS.client.from("video_progress")
    .insert({ learner_id: adminS.uid, video_id: randomUUID(), last_position_seconds: 1 });
  assert.ok(error, "INSERT avec learner_id != auth.uid() doit etre refuse");
});

// 5. Secret des reponses : tables answers staff-only
await test("secret: question_answers inaccessible eleve", async () => {
  const { data, error } = await eleveS.client.from("question_answers").select("*").limit(1);
  assert.ok(error || (data && data.length === 0), "un eleve a lu question_answers !");
});
await test("secret: video_overlay_answers inaccessible eleve", async () => {
  const { data, error } = await eleveS.client.from("video_overlay_answers").select("*").limit(1);
  assert.ok(error || (data && data.length === 0));
});

// 6. RPC sure : get_cours_questions ne renvoie jamais correct_answer/explanation
await test("rpc get_cours_questions ne fuite pas correct_answer", async () => {
  const { data, error } = await eleveS.client.rpc("get_cours_questions", { p_cours_id: randomUUID() });
  if (!error && Array.isArray(data)) {
    for (const q of data) {
      assert.ok(!("correct_answer" in q), "correct_answer expose par la RPC !");
    }
  }
});

// 7. Tables immuables (DENY M5) : INSERT direct exam_attempts refuse
await test("immuable: INSERT direct exam_attempts refuse", async () => {
  const { error } = await eleveS.client.from("exam_attempts")
    .insert({ learner_id: eleveS.uid, exam_kind: "bloc", attempt_number: 1, score: 0, passed: false });
  assert.ok(error, "exam_attempts doit refuser tout INSERT authenticated (RPC seulement)");
});

// 8. Staff : l'admin lit la progression de tous
await test("staff: admin lit video_progress (tous)", async () => {
  const { error } = await adminS.client.from("video_progress").select("learner_id").limit(5);
  assert.ok(!error, error?.message);
});

// 9. Contenu : eleve ne cree pas de formation, admin oui
await test("contenu: eleve ne peut PAS creer une formation", async () => {
  const { error } = await eleveS.client.from("formations").insert({ slug: `t-${Date.now()}`, title: "x" });
  assert.ok(error, "un eleve a pu creer une formation !");
});
await test("contenu: admin PEUT creer+supprimer une formation", async () => {
  const slug = `t-${Date.now()}`;
  const { data, error } = await adminS.client.from("formations")
    .insert({ slug, title: "Test RLS" }).select("id").single();
  assert.ok(!error, error?.message);
  await admin.from("formations").delete().eq("id", data.id); // cleanup via service_role
});

// 10. Storage : un eleve ne telecharge pas le user-uploads d'un autre uid
await test("storage: user-uploads scope par uid", async () => {
  const otherPath = `${adminS.uid}/secret.pdf`;
  const { data, error } = await eleveS.client.storage.from("user-uploads").download(otherPath);
  assert.ok(error || !data, "un eleve a pu telecharger les uploads d'un autre !");
});

console.log(`\n--- ${passed} passed, ${failed} failed ---`);
process.exit(failed > 0 ? 1 : 0);
