# CAHIER DES CHARGES QUALIOPI — La Clé Institut
> Source : Retours groupés site Web + Parcours test utilisateur + CDC Qualiopi
> Seuls les indicateurs qui concernent la plateforme et le site sont listés ici.

---

## LÉGENDE
- ✅ Rien à faire / déjà couvert
- 🔧 À implémenter dans le LMS (`la-cle-app`)
- 🌐 À implémenter sur le site vitrine (`la-cle-institut`)
- ⏳ En attente d'éléments du client

---

## INDICATEUR 1 — Page de vente 🌐

Le programme de formation **doit figurer sur la page de vente** tel quel OU être téléchargeable.

Options possibles :
- Afficher une partie du programme sur la page + demander l'email pour télécharger le programme complet (récupération de leads)
- Même logique possible pour le **référentiel des compétences**

Obligations :
- **Dater la mise à jour de la page** : ajouter "Actualisé en mai 2026" (preuve que l'information est à jour)

> ⚠️ IMPLICATION CODE (site vitrine) :
> - Bouton/section "Télécharger le programme de formation" avec option email
> - Bouton/section "Consulter le référentiel de compétences"
> - Texte "Actualisé en mai 2026" dans une variable facilement modifiable
> - Mention référent handicap dans le footer (voir Indicateur 26)

---

## INDICATEUR 2 — Indicateur de résultats 🔧 🌐

Concerne la **page de vente** (afficher des résultats) ET le **LMS** (sortir les données en temps réel).

Le LMS avait déjà prévu le suivi de la pédagogie et de l'évolution des élèves.
Ajout pour être Qualiopi-ready : les données doivent être **exportables en temps réel**.

> ⚠️ IMPLICATION CODE :
> - Widget sur la page de vente affichant stats de résultats (taux de réussite, nombre de certifiés...)
> - Ces stats sont alimentées par le LMS en temps réel
> - TODO // Supabase : query aggrégée sur les résultats d'examens + certifications

---

## INDICATEUR 3 ✅
Non concerné — réservé RNCP.

---

## INDICATEUR 4 — Questionnaire pré-inscription 🔧

Mettre en place, **avant validation de l'inscription**, un questionnaire obligatoire de **7 questions** permettant d'identifier :
- le profil du candidat
- son niveau actuel
- ses objectifs
- sa disponibilité
- ses éventuels besoins spécifiques

Exigences techniques :
- Conservation **horodatée** des réponses
- **Export possible** en cas d'audit Qualiopi

> ⚠️ IMPLICATION CODE :
> - Composant `PreEnrollmentQuestionnaire` existe déjà dans `/components/enrollment/` — il faut créer la route `/inscription`
> - TODO // Supabase : table `pre_enrollment_answers` avec userId + answers + createdAt
> - TODO // Qualiopi Ind.4 : export des réponses pour audit

---

## INDICATEUR 5 ✅
Déjà couvert — le traçage des questions continues et des questions d'examens est dans le CDC original.

---

## INDICATEURS 6 ET 7 ✅
Rien à faire.

---

## INDICATEUR 8 — Test de positionnement Cours 0 🔧

Intégrer à l'entrée du parcours, **dans le Cours 0**, un test obligatoire de positionnement :
- **10 questions** : profil + auto-évaluation + mini quiz
- Génération automatique d'un **niveau de départ** et de **recommandations personnalisées**
- Enregistrement **horodaté** des résultats
- **Export possible** pour audit Qualiopi

> ⚠️ IMPLICATION CODE :
> - Composant `PositioningTest` à créer
> - Route dédiée dans le module 0
> - Bloquant : impossible de passer au module 1 sans avoir complété le test
> - TODO // Supabase : table `positioning_test_results` avec userId + answers + startingLevel + recommendations + completedAt
> - TODO // Qualiopi Ind.8 : export des résultats pour audit

---

## INDICATEUR 9 ✅
Rien à faire côté code — Marien explique le fonctionnement de la pédagogie dans le Cours 0.

---

## INDICATEURS 10 ET 11 ✅
Rien à faire.

---

## INDICATEUR 12 — Système anti-décrochage 🔧

Prévoir des **outils de maintien d'engagement** :
- Progression visible
- Relances automatiques sur inactivité
- Détection des blocages
- Historique des connexions
- Rappels motivants
- Reprise facilitée
- Export statistiques complétion/abandon pour audit Qualiopi

### Calendrier de relances (inactivité = pas de connexion OU pas de progression)
| Délai | Action |
|-------|--------|
| J+7 | Email de relance niveau 1 |
| J+14 | Email de relance niveau 2 |
| J+28 | Email de relance niveau 3 |
| J+42 | Appel téléphonique commercial + email "rappel accès à vie" |

> Note : Marien va créer un pool de mails automatiques. À intégrer quand il les envoie.

### Dashboard admin requis
- Vue : actifs / inactifs / reprises / abandons
- Export des statistiques
- Questionnaire automatique court en cas d'abandon prolongé (pour identifier les causes)

> ⚠️ IMPLICATION CODE :
> - Page `/admin/engagement` avec 4 onglets (Actifs / À risque / Abandons / Reprises)
> - Calcul daysSinceLastActivity depuis `lastProgressAt`
> - TODO // Supabase : table `engagement_tracking` avec status + remindersSent + lastConnectionAt
> - TODO // Resend : déclenchement des 4 niveaux de relance
> - TODO // Qualiopi Ind.12 : export CSV des stats pour audit

---

## INDICATEURS 13, 14, 15, 16 ✅
Non concernés.

---

## INDICATEUR 17 — Page moyens techniques 🔧

Prévoir une **page interne** recensant les moyens techniques du dispositif :
- LMS utilisé
- Suivi progression
- QCM
- Examens
- Relances automatiques
- Coffre documentaire
- Attestations PDF
- Support utilisateur
- Sauvegarde et continuité de service

**Objectif** : que ce soit écrit quelque part et qu'on puisse le photographier comme preuve d'audit.

Éléments à couvrir :
1. Conditions générales support technique (email contact + délai de réponse)
2. Sauvegarde / hébergement du LMS
3. Procédure en cas de panne technique
4. Liste claire des outils utilisés (LMS, emailing, CRM si existant)

> ⚠️ IMPLICATION CODE :
> - Page statique `/admin/moyens-techniques`
> - Bouton "Imprimer" (window.print())
> - Aucune DB requise — contenu statique

---

## INDICATEUR 18 ⏳
Marien attend le contrat signé d'Étienne. **Action : renvoyer le contrat signé.**

---

## INDICATEUR 19 ✅
Rien à faire — couvert par le CDC et l'organisation du site.

---

## INDICATEUR 20 ✅
Non concerné.

---

## INDICATEUR 21 ✅
Rien à faire pour l'instant — CV à fournir éventuellement plus tard.

---

## INDICATEURS 22, 23, 24, 25 ✅
Rien à faire.

---

## INDICATEUR 26 — Référent handicap 🌐 🔧

Mentionner **quelque part sur le site et dans la plateforme** qu'une personne en situation de handicap doit contacter le référent handicap.

Contact : `contact@institutlacle.fr`

> ⚠️ IMPLICATION CODE :
> - Ajouter dans le footer du site vitrine ET dans le footer/layout de la plateforme
> - Texte suggéré : "Toute personne en situation de handicap peut contacter notre référent handicap : contact@institutlacle.fr"

---

## INDICATEUR 27 ⏳
Signer le contrat (action Marien).

---

## INDICATEUR 30 — Questionnaires satisfaction 🔧

### Questionnaire à chaud
- Déclenché **après l'examen final**
- L'élève peut laisser un **avis libre public** (question optionnelle : "Souhaitez-vous laisser un avis public ?")

### Questionnaire à froid
- Envoi automatique par email **90 jours après** la fin de la formation

### Vue admin
- L'admin peut consulter tous les avis à chaud par formation
- Les données doivent être **exportables** (fichier Excel ou CSV)
- Relance automatique des non-répondants

> ⚠️ IMPLICATION CODE :
> - Composant `SatisfactionSurveyHot` → déclenché post-examen final
> - Route `/satisfaction/froid` → accessible via lien email
> - Page admin `/admin/satisfaction` avec export
> - TODO // Resend : email automatique J+90
> - TODO // Supabase : table `satisfaction_surveys` avec type (chaud/froid) + answers + publicReview + completedAt
> - TODO // Qualiopi Ind.30 : export Excel pour audit

---

## INDICATEUR 31 — Signalement de bugs 🔧

Mettre un bouton permettant aux utilisateurs de signaler des bugs.

Question ouverte : **email dédié** pour les bugs ou traitement via le formulaire de contact existant ? (à décider avec Marien)

> ⚠️ IMPLICATION CODE :
> - Bouton flottant discret dans le layout élève (LearnerShell)
> - Modale avec : description du problème + page concernée (pré-remplie auto)
> - TODO // Supabase : table `bug_reports`
> - TODO // Resend : notification à contact@institutlacle.fr

---

## INDICATEUR 32 ✅
Registre d'amélioration continue — géré par Marien. Rien à coder.
C'est Marien qui collecte les retours et décide quoi faire (bug, amélioration pédagogique, etc.)
