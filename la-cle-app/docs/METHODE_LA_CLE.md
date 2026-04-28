# MÉTHODE LA CLÉ — Document de référence pédagogique
> Source : ME_THODE_LA_CLE_.docx — Version structurée (noyau)
> Ce document est la référence pédagogique officielle. Toute feature LMS doit respecter cette logique.

---

## 1. FINALITÉ DE LA MÉTHODE

La Méthode La Clé a pour objectif principal :
👉 **l'assimilation des notions conceptuelles**

Elle vise ensuite :
👉 **leur intégration comportementale**

Et enfin :
👉 **leur incarnation au niveau postural et identitaire**

### Hiérarchie des objectifs
1. **Comprendre**
2. **Savoir utiliser**
3. **Incarner**

La progression pédagogique est conçue pour respecter cet ordre. On ne passe pas à l'étape suivante sans avoir consolidé la précédente.

---

## 2. LOGIQUE GÉNÉRALE DU SYSTÈME

La méthode repose sur un principe fondamental :
👉 **l'apprentissage est un processus structuré dans le temps**, combinant :
- progression logique
- expérience vécue
- répétition
- questionnement
- mise en application

---

## 3. DOUBLE PROGRESSION PÉDAGOGIQUE

La Méthode La Clé articule deux dynamiques **simultanées** :

### 3.1 Les montées logiques (structure cognitive)
Les montées logiques correspondent à la manière dont les connaissances s'organisent et se structurent progressivement, permettant à l'apprenant de construire une compréhension cohérente.

Elles reposent sur :
- l'ordre des modules
- la progression des notions
- l'augmentation du niveau de complexité
- les liens entre les concepts
- les prérequis implicites

**Chaque étape prépare la suivante.**

### 3.2 Les montées émotionnelles (expérience interne)
Les montées émotionnelles correspondent aux prises de conscience progressives vécues par l'apprenant, qui accompagnent et renforcent l'intégration des connaissances.

Elles se manifestent par :
- des prises de conscience
- des moments de doute
- des déclics
- des remises en question
- une implication personnelle croissante

### 3.3 Interaction des deux dynamiques
La progression pédagogique est construite de manière à :
👉 **aligner montée logique et montée émotionnelle**
afin de permettre une intégration profonde.

---

## 4. ARCHITECTURE DES COURS

### 4.1 Structure générale
Chaque cours est structuré en :
- **2 à 5 encarts** (3 à 4 en moyenne)
- Chaque encart est divisé en **capsules vidéo**
- Durée des capsules : de quelques secondes à **5 minutes maximum**

### 4.2 Fonction des capsules
Les capsules sont construites selon :
- la logique cognitive
- la montée émotionnelle

Elles peuvent contenir :
- des notions
- des morceaux de notions
- des histoires
- des anticipations
- des annexes
- des révisions

**Il n'existe pas de typologie fixe.**

### 4.3 Rôle des capsules sans question
Certaines capsules ne sont pas suivies de questions.
Elles permettent :
- une pause cognitive
- un retour d'attention
- un morcellement du contenu
- un effet de séparation

Elles facilitent également :
👉 la navigation entre différentes grilles de lecture

---

## 5. SYSTÈME DE QUESTIONS

### 5.1 Principe général
Les questions sont intégrées directement dans le flux pédagogique :
- sous forme de **pop-up**
- à des **moments clés**
- en **overlay**

**Elles ne constituent pas une section séparée.**

### 5.2 Objectifs des questions
Les questions permettent :
- de tester la compréhension
- de générer un effort cognitif
- de provoquer des prises de conscience
- de favoriser la mémorisation
- d'accompagner l'intégration

### 5.3 Typologie des questions

#### 1. Questions d'anticipation
- avant une notion
- réponse libre
- **non bloquantes**

#### 2. Questions philosophiques
- visée métacognitive
- prise de recul
- réponse libre
- **non bloquantes**

#### 3. Questions d'intégration
Deux formats :

**a. QCM**
- **bloquantes**
- réponse correcte obligatoire
- tentatives illimitées

**b. Réponse libre**
- enregistrée
- relue par un formateur si nécessaire
- **non bloquante**

#### 4. Questions de validation
- en fin de séquence
- QCM
- **bloquantes**

### 5.4 Temporalité des questions — Répétition espacée
Les notions sont réinterrogées selon un système temporel **fixe et non adaptatif** :
- **J+1**
- **J+3**
- **J+7**
- **J+21**

> ⚠️ IMPLICATION CODE : Chaque question répondue correctement doit générer 4 `ScheduledReview` avec ces intervalles. Enregistrer `responseTime` et `attemptCount` sur chaque réponse.

### 5.5 Enregistrement des données
Pour chaque question sont enregistrés :
- la réponse
- le **temps de réponse**
- le **nombre de tentatives**

Toutes les questions sont consultables :
- par l'**élève** (lecture seule)
- par le **formateur** (par élève + par catégorie)

### 5.6 Assistance par chatbot
Un chatbot est accessible à la demande.
Il :
- **ne donne pas la réponse**
- propose des **métaphores**
- renvoie vers les **cours concernés**

> ⚠️ RÈGLE ABSOLUE : Le chatbot ne donne jamais la réponse directe, sous aucun prétexte.

---

## 6. PROCESSUS DE LECTURE VIDÉO

### 6.1 Première lecture
Lors de la première lecture :
- **aucun titre n'est affiché**
- seules les **références apparaissent** (ex : `1A1`, `6B3`)

Objectifs :
- éviter l'anticipation
- favoriser le questionnement
- orienter l'attention vers l'expérience

### 6.2 Relecture
Après complétion du cours :
- les **titres deviennent visibles**
- possibilité d'**accélérer la lecture**

> ⚠️ IMPLICATION CODE : Utiliser `getCapsuleDisplayName(code, title, isCompleted)` dans `src/lib/capsule-utils.ts`. Ajouter un contrôle de vitesse de lecture dans le VideoPlayer après complétion.

### 6.3 Support visuel
Chaque notion est accompagnée d'animations visuelles facilitant la compréhension.

---

## 7. LE COFFRE

### 7.1 Fonction
Le coffre est un espace central de :
- révision
- structuration
- traçabilité

### 7.2 Contenu
1. **Révisions** : résumés, fiches, listes
2. **Documents** : contrats, attestations, factures
3. **Questions** : historique complet (réponses non modifiables)
4. **Examens** : résultats, tentatives

### 7.3 Principe
**Le coffre ne remplace pas le cours.**
Il sert à :
👉 structurer et consolider

---

## 8. PÉDAGOGIE SPIRALÉE

### 8.1 Principe
Les notions ne sont **jamais transmises entièrement en une seule fois**.
Elles sont :
- introduites
- approfondies
- reliées
- intégrées

### 8.2 Objectif
Permettre une compréhension :
👉 progressive
👉 transversale
👉 systémique

### 8.3 Verrous pédagogiques
Des mécanismes sont intégrés pour amener l'apprenant à :
- identifier ses postures limitantes
- adopter des postures plus productives

---

## 9. LECTURE DU PARCOURS APPRENANT

### 9.1 Données disponibles
Le système permet de suivre :
- progression
- réponses
- temps
- tentatives

### 9.2 Lecture par notion
Le corpus peut être analysé :
- par cours
- par notion

### 9.3 Objectif
Identifier :
- les zones de friction
- les incompréhensions
- l'efficacité pédagogique

> ⚠️ IMPLICATION CODE : La page `/admin/analytics` doit permettre cette double lecture (par cours ET par notion). Voir chantier "Analytics pédagogiques" dans CONTEXTE_PROJET.md.
