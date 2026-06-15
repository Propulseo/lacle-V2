// scripts/seed-content.mjs
// Seed du contenu pedagogique (mock -> schema nested Supabase).
// Migre la formation "Praticien PNL" : 8 blocs, cours, vidéos + overlays,
// examens de bloc + questions/reponses, coffre, ressources de revision,
// examen final, et une inscription de demo pour client@lacle.fr.
//
// Usage : node --env-file=.env.local scripts/seed-content.mjs
// Idempotent : purge la formation (slug) et les revision_resources avant reinsertion.
import { createClient } from "@supabase/supabase-js";
import assert from "node:assert/strict";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
assert.ok(URL && SERVICE, "NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY requis (.env.local)");

const db = createClient(URL, SERVICE, { auth: { persistSession: false } });
const CLIENT_UID = "00000000-0000-0000-0000-000000000c01"; // eleve seed

function ok(error, ctx) {
  if (error) {
    console.error(`FAIL ${ctx}:`, error.message);
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// DONNEES (transcrites depuis src/data/mock/*)
// ---------------------------------------------------------------------------
const MODULES = [
  { order: 1, title: "Les fondamentaux de la PNL", access: "all", examId: "exam-1",
    description: "Découvrez les bases de la Programmation Neuro-Linguistique : présupposés, systèmes de représentation et premières techniques de communication." },
  { order: 2, title: "Techniques avancées de communication", access: "all", examId: "exam-2",
    description: "Approfondissez les techniques de synchronisation, le méta-modèle linguistique et les stratégies d'ancrage pour une communication efficace." },
  { order: 3, title: "Applications thérapeutiques et coaching", access: "all", examId: "exam-3",
    description: "Maîtrisez les protocoles de changement, la ligne du temps, le recadrage et les applications en coaching professionnel et thérapeutique." },
  { order: 4, title: "Ancrage et états ressources", access: "all", examId: null,
    description: "Installez, déclenchez et combinez des ancres pour mobiliser les états internes utiles au changement." },
  { order: 5, title: "Sous-modalités et transformation du vécu", access: "all", examId: null,
    description: "Explorez la structure fine de l'expérience subjective et les protocoles de changement par les sous-modalités." },
  { order: 6, title: "Stratégies mentales et modélisation", access: "all", examId: null,
    description: "Décodez les stratégies internes de l'excellence et apprenez les bases de la modélisation en PNL." },
  { order: 7, title: "Croyances et valeurs", access: "all", examId: "exam-7",
    description: "Identifiez les croyances limitantes, travaillez les hiérarchies de valeurs et accompagnez leur évolution." },
  { order: 8, title: "Intégration et posture du praticien", access: "valide", examId: null,
    description: "Reliez l'ensemble des techniques dans une pratique cohérente et préparez la certification de praticien." },
];

// Vidéos par module (modules 1-3 detailles dans le mock). q = overlay questions.
const VIDEOS = {
  1: [
    { order: 1, title: "Introduction à la PNL : origines et principes", duration: 900,
      description: "Découvrez l'histoire de la PNL, ses fondateurs et les principes qui guident cette approche.",
      q: [{ ts: 300, fmt: "qcm", question: "Qui sont les cofondateurs de la PNL ?", options: ["Freud et Jung","Bandler et Grinder","Rogers et Maslow","Erickson et Satir"], answer: "Bandler et Grinder", explanation: "Richard Bandler et John Grinder ont cofondé la PNL dans les années 1970." }] },
    { order: 2, title: "Les présupposés de la PNL", duration: 840,
      description: "Explorez les croyances fondamentales qui sous-tendent la pratique de la PNL.",
      q: [{ ts: 420, fmt: "vrai_faux", question: "« La carte n'est pas le territoire » est un présupposé de la PNL.", options: null, answer: "vrai", explanation: "C'est l'un des présupposés fondamentaux, emprunté à Alfred Korzybski." }] },
    { order: 3, title: "Les systèmes de représentation (VAKOG)", duration: 960,
      description: "Apprenez à identifier les canaux sensoriels privilégiés de vos interlocuteurs.",
      q: [
        { ts: 480, fmt: "qcm", question: "Que signifie le K dans VAKOG ?", options: ["Kinesthésique","Kinétique","Kaléidoscopique","Karma"], answer: "Kinesthésique", explanation: null },
        { ts: 800, fmt: "texte", question: "Donnez un exemple de prédicat visuel.", options: null, answer: "voir", explanation: "Exemples : voir, clair, lumineux, envisager, perspective..." }] },
    { order: 4, title: "Premier exercice de calibration", duration: 900,
      description: "Mettez en pratique vos premiers apprentissages avec un exercice guidé de calibration.",
      q: [{ ts: 600, fmt: "vrai_faux", question: "La calibration consiste à observer les changements physiologiques de son interlocuteur.", options: null, answer: "vrai", explanation: null }] },
  ],
  2: [
    { order: 1, title: "La synchronisation et le rapport", duration: 900,
      description: "Maîtrisez les techniques de synchronisation verbale et non-verbale pour établir le rapport.",
      q: [{ ts: 450, fmt: "qcm", question: "Quel est l'objectif principal de la synchronisation ?", options: ["Manipuler","Établir le rapport","Dominer","Impressionner"], answer: "Établir le rapport", explanation: null }] },
    { order: 2, title: "Le méta-modèle linguistique", duration: 960,
      description: "Découvrez les patterns linguistiques et apprenez à questionner avec précision.",
      q: [
        { ts: 500, fmt: "qcm", question: "Que vise le méta-modèle ?", options: ["Généraliser","Préciser le langage","Simplifier","Abstraire"], answer: "Préciser le langage", explanation: null },
        { ts: 800, fmt: "vrai_faux", question: "La nominalisation est une distorsion linguistique.", options: null, answer: "vrai", explanation: null }] },
    { order: 3, title: "Les techniques d'ancrage", duration: 840,
      description: "Apprenez à créer, empiler et enchaîner des ancrages pour le changement émotionnel.",
      q: [{ ts: 420, fmt: "texte", question: "Quelles sont les 4 conditions d'un ancrage efficace ?", options: null, answer: "intensité", explanation: "Intensité de l'état, unicité du stimulus, timing précis, reproductibilité." }] },
  ],
  3: [
    { order: 1, title: "Les protocoles de changement", duration: 900,
      description: "Découvrez la structure des protocoles de changement en PNL et leur application.",
      q: [{ ts: 450, fmt: "qcm", question: "Quelle est la première étape d'un protocole de changement ?", options: ["L'intervention","L'état désiré","L'état présent","La vérification"], answer: "L'état présent", explanation: null }] },
    { order: 2, title: "La ligne du temps", duration: 900,
      description: "Explorez la notion de ligne du temps et son utilisation en thérapie.",
      q: [{ ts: 500, fmt: "vrai_faux", question: "La ligne du temps est identique pour tout le monde.", options: null, answer: "faux", explanation: "Chacun a sa propre représentation spatiale du temps." }] },
    { order: 3, title: "Le recadrage en 6 étapes", duration: 960,
      description: "Maîtrisez le protocole de recadrage pour transformer les comportements indésirables.",
      q: [{ ts: 480, fmt: "qcm", question: "Combien d'étapes comporte le recadrage classique ?", options: ["4","5","6","8"], answer: "6", explanation: null }] },
    { order: 4, title: "Applications en coaching professionnel", duration: 840,
      description: "Adaptez les techniques PNL au contexte du coaching en entreprise.",
      q: [{ ts: 400, fmt: "vrai_faux", question: "Le coaching PNL peut être utilisé en contexte professionnel.", options: null, answer: "vrai", explanation: null }] },
    { order: 5, title: "Intégration et pratique supervisée", duration: 900,
      description: "Synthèse des apprentissages et exercice intégrateur sous supervision.",
      q: [
        { ts: 300, fmt: "texte", question: "Quel protocole utiliseriez-vous pour une phobie simple ?", options: null, answer: "dissociation", explanation: "Le protocole de dissociation V/K (cure rapide de phobie) est le plus adapté." },
        { ts: 700, fmt: "qcm", question: "Quelle position perceptuelle correspond à l'observateur neutre ?", options: ["1ère position","2ème position","3ème position","4ème position"], answer: "3ème position", explanation: null }] },
  ],
};

// Examens de bloc (modules 1,2,3,7). q : questions QCM/VF.
const EXAMS = {
  1: { title: "Examen — Les fondamentaux de la PNL", q: [
    { fmt: "qcm", question: "Quel est le présupposé central de la PNL concernant la perception ?", options: ["La réalité est objective","La carte n'est pas le territoire","Tout est relatif","La perception est toujours juste"], answer: "La carte n'est pas le territoire", points: 20, explanation: null },
    { fmt: "vrai_faux", question: "La PNL a été créée dans les années 1990.", options: null, answer: "faux", points: 20, explanation: "La PNL a été créée dans les années 1970." },
    { fmt: "qcm", question: "Que signifie le V dans VAKOG ?", options: ["Verbal","Visuel","Vocal","Virtuel"], answer: "Visuel", points: 20, explanation: null },
    { fmt: "qcm", question: "La calibration en PNL consiste à :", options: ["Mesurer des résultats","Observer les changements physiologiques","Calculer des scores","Calibrer un instrument"], answer: "Observer les changements physiologiques", points: 20, explanation: null },
    { fmt: "vrai_faux", question: "Le système kinesthésique concerne les sensations corporelles.", options: null, answer: "vrai", points: 20, explanation: null },
  ]},
  2: { title: "Examen — Techniques avancées de communication", q: [
    { fmt: "qcm", question: "Le rapport en PNL désigne :", options: ["Un document écrit","Une relation de confiance","Un ratio","Un compte-rendu"], answer: "Une relation de confiance", points: 20, explanation: null },
    { fmt: "vrai_faux", question: "La synchronisation ne concerne que le langage verbal.", options: null, answer: "faux", points: 20, explanation: "Elle inclut aussi le non-verbal : posture, gestes, respiration..." },
    { fmt: "qcm", question: "Le méta-modèle sert à :", options: ["Généraliser l'information","Supprimer l'information","Récupérer l'information manquante","Distordre l'information"], answer: "Récupérer l'information manquante", points: 20, explanation: null },
    { fmt: "qcm", question: "Un ancrage efficace nécessite :", options: ["Uniquement la répétition","Intensité, unicité, timing, reproductibilité","Un cadre thérapeutique","L'accord du patient"], answer: "Intensité, unicité, timing, reproductibilité", points: 20, explanation: null },
    { fmt: "vrai_faux", question: "L'empilement d'ancrages permet de renforcer un état émotionnel.", options: null, answer: "vrai", points: 20, explanation: null },
  ]},
  3: { title: "Examen — Applications thérapeutiques et coaching", q: [
    { fmt: "qcm", question: "La première étape d'un protocole de changement est :", options: ["L'état désiré","L'état présent","Les ressources","La vérification"], answer: "L'état présent", points: 20, explanation: null },
    { fmt: "vrai_faux", question: "La ligne du temps est la même pour tout le monde.", options: null, answer: "faux", points: 20, explanation: null },
    { fmt: "qcm", question: "Le recadrage en 6 étapes travaille avec :", options: ["Le conscient uniquement","La partie responsable du comportement","Les souvenirs d'enfance","Les rêves"], answer: "La partie responsable du comportement", points: 20, explanation: null },
    { fmt: "qcm", question: "La 3ème position perceptuelle correspond à :", options: ["Soi-même","L'autre personne","L'observateur neutre","Le groupe"], answer: "L'observateur neutre", points: 20, explanation: null },
    { fmt: "qcm", question: "Pour une phobie simple, le protocole recommandé est :", options: ["Le recadrage en 6 étapes","La dissociation V/K","La ligne du temps","Le swish pattern"], answer: "La dissociation V/K", points: 20, explanation: null },
  ]},
  7: { title: "Examen — Croyances et valeurs", q: [
    { fmt: "qcm", question: "Une croyance limitante se reconnaît à :", options: ["Sa véracité objective","L'effet restrictif qu'elle produit sur les choix de la personne","Son ancienneté","Sa formulation négative uniquement"], answer: "L'effet restrictif qu'elle produit sur les choix de la personne", points: 40, explanation: null },
    { fmt: "vrai_faux", question: "Les valeurs sont hiérarchisées différemment selon les contextes de vie.", options: null, answer: "vrai", points: 30, explanation: null },
    { fmt: "qcm", question: "Le travail sur les croyances intervient de préférence :", options: ["Avant toute autre technique","Quand un comportement résiste aux techniques de surface","Uniquement en fin de parcours","Jamais en accompagnement individuel"], answer: "Quand un comportement résiste aux techniques de surface", points: 30, explanation: null },
  ]},
};

const VAULT = [
  { category: "contractuels", title: "Contrat de formation distancielle", file: "/documents/contrat-formation-distancielle.pdf", sign: true, from: "inscrit" },
  { category: "contractuels", title: "Conditions generales de vente (CGV)", file: "/documents/cgv.pdf", sign: true, from: "inscrit" },
  { category: "contractuels", title: "Reglement interieur", file: "/documents/reglement-interieur.pdf", sign: false, from: "decouverte" },
  { category: "financiers", title: "Facture n°2026-0001", file: "/documents/facture-2026-0001.pdf", sign: false, from: "inscrit" },
  { category: "financiers", title: "Echeancier de paiement", file: null, sign: false, from: "inscrit" },
  { category: "pedagogiques", title: "Attestation de suivi du distanciel", file: null, sign: false, from: "inscrit" },
  { category: "pedagogiques", title: "Validation module 1 — Les fondamentaux de la PNL", file: "/documents/validation-module-1.pdf", sign: false, from: "inscrit" },
  { category: "pedagogiques", title: "Certificat final", file: null, sign: false, from: "certifie" },
  { category: "qualite", title: "Questionnaire de satisfaction a chaud", file: null, sign: false, from: "inscrit" },
  { category: "qualite", title: "Questionnaire de satisfaction a froid", file: null, sign: false, from: "inscrit" },
  { category: "pratiques", title: "Dates du presentiel", file: null, sign: false, from: "inscrit" },
  { category: "pratiques", title: "Adresse et lieu du presentiel", file: "/documents/lieu-presentiel.pdf", sign: false, from: "inscrit" },
  { category: "pratiques", title: "Consignes logistiques", file: "/documents/consignes-logistiques.pdf", sign: false, from: "inscrit" },
];

const REVISION = [
  { type: "pdf", title: "Fiche synthèse — Les présupposés de la PNL", description: "Résumé des principaux présupposés avec exemples pratiques.", content: "/docs/presupposes-pnl.pdf", answer: null, module: 1 },
  { type: "pdf", title: "Fiche synthèse — Le méta-modèle", description: "Tableau récapitulatif des patterns linguistiques et questions associées.", content: "/docs/meta-modele.pdf", answer: null, module: 2 },
  { type: "question", title: "QCM de révision — Fondamentaux", description: "10 questions pour réviser les bases de la PNL.", content: "Quels sont les 3 processus de modélisation linguistique en PNL ?", answer: "Généralisation, distorsion et omission.", module: 1 },
  { type: "question", title: "QCM de révision — Communication avancée", description: "8 questions sur les techniques avancées.", content: "Quelle est la différence entre synchronisation et imitation ?", answer: "La synchronisation est subtile et respectueuse, l'imitation est une copie grossière qui peut être perçue comme moqueuse.", module: 2 },
  { type: "video", title: "Résumé vidéo — Les ancrages", description: "Capsule vidéo de 5 minutes résumant les techniques d'ancrage.", content: "/videos/resume-ancrages.mp4", answer: null, module: 2 },
  { type: "video", title: "Démonstration — Recadrage en 6 étapes", description: "Vidéo de démonstration complète du protocole de recadrage.", content: "/videos/demo-recadrage.mp4", answer: null, module: 3 },
];

const FORMATION_SLUG = "praticien-pnl";

async function main() {
  console.log("--- Seed contenu La Cle ---");

  // 0. Purge idempotente
  {
    const { data: existing } = await db.from("formations").select("id").eq("slug", FORMATION_SLUG).maybeSingle();
    if (existing) {
      ok((await db.from("formations").delete().eq("id", existing.id)).error, "purge formation");
      console.log("  purge: formation existante supprimee (cascade)");
    }
    ok((await db.from("revision_resources").delete().neq("id", "00000000-0000-0000-0000-000000000000")).error, "purge revision");
  }

  // 1. Formation
  const { data: formation, error: eF } = await db.from("formations").insert({
    slug: FORMATION_SLUG, title: "Praticien PNL", position: 1, lifecycle: "available",
    requires_positioning: false, is_published: true,
    description: "Formation certifiante de Praticien en Programmation Neuro-Linguistique.",
  }).select("id").single();
  ok(eF, "insert formation");
  console.log("  formation:", formation.id);

  const blocByOrder = {};
  const coursByOrder = {};

  // 2. Blocs + 3. Cours
  for (const m of MODULES) {
    const { data: bloc, error: eB } = await db.from("blocs").insert({
      formation_id: formation.id, numero: m.order, titre: m.title, description: m.description,
      position: m.order, access_level: m.access, is_published: true,
    }).select("id").single();
    ok(eB, `insert bloc ${m.order}`);
    blocByOrder[m.order] = bloc.id;

    const { data: cours, error: eC } = await db.from("cours").insert({
      bloc_id: bloc.id, numero: 1, titre: m.title, position: 1, access_tier: "inscrit",
    }).select("id").single();
    ok(eC, `insert cours ${m.order}`);
    coursByOrder[m.order] = cours.id;
  }
  console.log("  blocs+cours: 8");

  // 4. Vidéos + items + overlays (modules 1-3)
  let nbVideos = 0, nbOverlays = 0;
  for (const m of MODULES) {
    const vids = VIDEOS[m.order] ?? [];
    let pos = 0;
    for (const v of vids) {
      pos = v.order;
      const { data: item, error: eI } = await db.from("course_items").insert({
        cours_id: coursByOrder[m.order], kind: "video", position: pos,
      }).select("id").single();
      ok(eI, `item video ${m.order}-${v.order}`);

      const code = `${m.order}A${v.order}`;
      const { data: video, error: eV } = await db.from("videos").insert({
        item_id: item.id, code, title: v.title, description: v.description,
        duration_seconds: v.duration, src: null, is_published: true,
      }).select("id").single();
      ok(eV, `video ${code}`);
      nbVideos++;

      for (const q of v.q) {
        const { data: oq, error: eOQ } = await db.from("video_overlay_questions").insert({
          video_id: video.id, timestamp_seconds: q.ts, format: q.fmt, question: q.question,
          options: q.options, position: 0,
        }).select("id").single();
        ok(eOQ, `overlay ${code}`);
        ok((await db.from("video_overlay_answers").insert({
          overlay_question_id: oq.id, correct_answer: q.answer, explanation: q.explanation,
        })).error, `overlay answer ${code}`);
        nbOverlays++;
      }
    }
    // item de cloture
    ok((await db.from("course_items").insert({
      cours_id: coursByOrder[m.order], kind: "fin_cours", position: pos + 1,
    })).error, `fin_cours ${m.order}`);
  }
  console.log(`  videos: ${nbVideos}, overlays: ${nbOverlays}`);

  // 5. Examens de bloc + questions + reponses
  let nbExams = 0, nbExamQ = 0;
  for (const m of MODULES) {
    if (!m.examId) continue;
    const ex = EXAMS[m.order];
    const { data: exam, error: eE } = await db.from("exams_bloc").insert({
      bloc_id: blocByOrder[m.order], title: ex.title, passing_score: 100,
      message_accueil: "Bienvenue dans l'examen de ce bloc. Prenez votre temps.",
      message_reussite: "Félicitations, vous avez validé ce bloc !",
      message_attente: "Un délai est requis avant votre prochaine tentative.",
    }).select("id").single();
    ok(eE, `exam bloc ${m.order}`);
    nbExams++;
    let qpos = 0;
    for (const q of ex.q) {
      qpos++;
      const isQcm = q.fmt === "qcm" || q.fmt === "vrai_faux";
      const { data: question, error: eQ } = await db.from("questions").insert({
        scope: "examen_bloc", exam_bloc_id: exam.id, type: "validation",
        is_qcm: isQcm, is_blocking: true, content: q.question, options: q.options,
        points: q.points, position: qpos,
      }).select("id").single();
      ok(eQ, `exam question ${m.order}-${qpos}`);
      ok((await db.from("question_answers").insert({
        question_id: question.id, correct_answer: q.answer, explanation: q.explanation,
      })).error, `exam answer ${m.order}-${qpos}`);
      nbExamQ++;
    }
  }
  console.log(`  exams_bloc: ${nbExams}, questions: ${nbExamQ}`);

  // 6. Examen final (sans questions pour l'instant)
  ok((await db.from("exams_final").insert({
    formation_id: formation.id, title: "Examen final — Praticien PNL", passing_score: 100,
    message_accueil: "Examen final de certification.",
    message_reussite: "Bravo, vous êtes certifié(e) Praticien PNL !",
    message_encouragement: "Ce n'est pas validé cette fois — revoyez les blocs et retentez.",
  })).error, "exam final");

  // 7. Coffre
  for (const d of VAULT) {
    ok((await db.from("vault_documents").insert({
      formation_id: formation.id, category: d.category, title: d.title, file_url: d.file,
      signature_required: d.sign, unlock_rule: "status", available_from: d.from, visible_when_locked: true,
    })).error, `vault ${d.title}`);
  }
  console.log(`  vault_documents: ${VAULT.length}`);

  // 8. Ressources de revision
  for (const r of REVISION) {
    ok((await db.from("revision_resources").insert({
      bloc_id: blocByOrder[r.module] ?? null, type: r.type, title: r.title,
      description: r.description, content: r.content, answer: r.answer,
    })).error, `revision ${r.title}`);
  }
  console.log(`  revision_resources: ${REVISION.length}`);

  // 9. Inscription de demo pour client@lacle.fr (statut inscrit)
  {
    const now = new Date(0).toISOString(); // horodatage fixe (deterministe)
    ok((await db.from("enrollments").upsert({
      learner_id: CLIENT_UID, formation_id: formation.id, status: "inscrit",
      contract_signed: true, cgv_accepted: true, payment_status: "active",
    }, { onConflict: "learner_id,formation_id" })).error, "enrollment demo");
    console.log("  enrollment demo: client@lacle.fr -> inscrit");
    void now;
  }

  console.log("--- Seed termine ---");
}

main().catch((e) => { console.error(e); process.exit(1); });
