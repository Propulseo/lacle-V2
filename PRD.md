# PRODUCT REQUIREMENTS DOCUMENT
## Institut La Clé — Site Vitrine Officiel
### Version 1.0 — Définitif
**Statut :** Validé pour conception & développement
**Scope :** Site public uniquement (hors LMS)

---

## 1. Vision Produit

Créer un site institutionnel structuré, symbolique et volontairement séquencé.

Le site doit :
- Installer une posture d'institut
- Structurer un parcours réfléchi
- Éviter toute dynamique commerciale
- Permettre une décision éclairée
- Préparer l'entrée dans l'espace apprenant

Le site n'est pas un outil marketing. Il est un cadre.

## 2. Positionnement & Cadre

**Nature :** Institut de formation dédié à la compréhension des mécanismes humains.

**Posture non négociable :**
- Aucune promesse de transformation
- Aucune posture thérapeutique
- Aucune injonction émotionnelle
- La transformation peut être une conséquence, jamais une promesse
- Finalité centrale : compréhension et maîtrise

**Ton éditorial :**
- Institutionnel
- Sobre
- Profond
- Non commercial
- Aucune rhétorique persuasive
- Aucun vocabulaire de vente

## 3. Architecture Générale

Parcours volontairement séquencé :

```
Accueil
→ Hub "Nous découvrir"
  → Notre vocation
  → Équipe
→ Catalogue des formations
  → Fiche formation PNL Praticien
    → Page intermédiaire
      → Sortie vers espace apprenant (hors scope)
```

Navigation contrôlée. Aucune navigation libre transversale.

## 4. Règles UX Globales

- Aucun pop-up
- Aucun bandeau promotionnel
- Aucun compte à rebours
- Aucun argument de rareté
- Aucun CTA secondaire
- Aucun lien contextuel parasite
- Aucun scroll artificiel

Hiérarchie claire. Respiration importante. Rythme vertical maîtrisé.
Animation minimale, lente et signifiante.

## 5. Direction Artistique

**Inspiration structurelle :** Propulseo (clarté, rigueur).
**Différence majeure :** suppression totale de l'énergie business.

**Intentions visuelles :**
- Minimalisme institutionnel
- Espaces blancs importants
- Typographie élégante et stable
- Transitions lentes
- Vidéo contemplative

**Palette recommandée :**
- Blanc cassé / ivoire
- Gris graphite
- Noir profond
- Accent discret (doré doux ou bronze léger possible)

**Typographies :**
- Titres : Serif élégante (ex : Canela / Cormorant / EB Garamond)
- Corps : Sans-serif neutre (Inter / Neue Haas / Satoshi)

## 6. Page d'Accueil

**Rôle :** Entrée symbolique et institutionnelle.

### 6.1 Animation d'entrée
- Symbole de la clé
- Baseline : "Comprendre avant d'agir"
- Durée : 1,8 secondes
- Non skippable
- Jouée une seule fois par session (sessionStorage)
- Objectif : rupture symbolique

### 6.2 Écran principal

**Header étendu :**
- La Clé
- Institut de compréhension des mécanismes humains

**3 boutons uniques (même hiérarchie visuelle) :**
- Nous découvrir
- Catalogue des formations
- Espace apprenant

**Footer minimal :**
- Mentions légales
- CGV
- Contact

**Contraintes strictes :**
- Aucun menu global
- Aucun lien secondaire
- Aucun sous-menu

## 7. Hub "Nous découvrir"

**Rôle :** Orientation institutionnelle.

**Structure :**
- Hero (titre + sous-texte court)
- 3 cartes cliquables :
  - Notre vocation
  - Le concept
  - L'équipe

**Règles :**
- Pas de vente
- Pas de formation
- Pas de vidéo

## 8. Page "Notre vocation"

**Rôle :** Exprimer le pourquoi profond.

**Structure verticale :**
- Section 1 — Intention (Hero)
- Section 2 — L'excellence n'est pas un slogan
- Section 3 — Aller au cœur des mécanismes
- Section 4 — L'humain comme horizon
- Section 5 — Conclusion

**Chaque section :**
- Bloc texte structuré
- Vidéo ≤ 20 secondes
- Muette par défaut
- Vidéo d'atmosphère uniquement

**CTA unique final :** Découvrir l'équipe fondatrice

**Contraintes :**
- Aucun discours commercial
- Aucune mention formation
- Vidéo jamais explicative

## 9. Page "Équipe"

**Rôle :** Incarner le cadre humain sans personal branding.

**Structure :**
- Hero vidéo sobre
- Sections :
  - Marien — garant pédagogique
  - Titi — co-garant symbolique
  - Équipe appelée à évoluer
  - Origine de La Clé
  - Parcours du fondateur (version courte + version longue dépliable)
- Conclusion

**CTA unique :** Découvrir les formations

**Contraintes :**
- Aucun storytelling héroïque
- Aucune mise en scène personnelle
- Ton neutre

## 10. Catalogue des formations

**Rôle :** Page de repérage.

**Structure :**
- Hero — Vision pédagogique globale
- Section : Progression pédagogique
- Section : Formations disponibles
  - PNL – Praticien (cliquable)
  - Formations à venir (grisées, non cliquables)
- Bloc : Accès via espace apprenant
- CTA final orienté vers PNL Praticien

**Contraintes :**
- Aucun paiement
- Une seule formation active
- Aucun prix affiché

## 11. Fiche Formation — PNL Praticien

**Rôle :** Page centrale de compréhension.

**Objectifs :**
- Comprendre la PNL
- Comprendre la pédagogie La Clé
- Comprendre le parcours distanciel → présentiel

**Structure :**
- Hero
- Section — Qu'est-ce que la PNL ?
- Section — Pourquoi La Clé
- Section — Parcours distanciel → présentiel
  - Sous-sections :
    - Distanciel : pédagogie
    - 7 modules (présentation structurée)
    - Présentiel
    - Certification
- Section — Décider en connaissance de cause
- FAQ
- CTA unique final : Accéder à l'espace de formation

**Contraintes :**
- Aucun paiement
- Aucun tunnel marketing
- Compréhensible sans vidéo

## 12. Page Intermédiaire — Accès Espace

**Rôle :** Page de bascule volontaire.

**Contenu :**
- Rappel de la posture
- Invitation à entrer
- Bouton unique : Entrer dans l'espace apprenant
- Aucun autre lien

## 13. Contraintes Techniques

**Stack :** Next.js App Router, SSR par défaut, Composants découplés

**Performance :** Score Lighthouse > 90

**Accessibilité :**
- Contraste AA minimum
- Navigation clavier complète
- Vidéos sous-titrables

**SEO :**
- Structure Hn rigoureuse
- Méta descriptions sobres
- Pas de sur-optimisation

## 14. Contraintes Structure Code

- Une page ≤ 250 lignes
- Composants réutilisables
- UI séparée de la logique
- Vidéos lazy load
- Animations légères

## 15. KPIs

- Taux de clic vers fiche formation
- Temps moyen sur fiche formation
- Taux de passage vers espace apprenant

Aucun objectif commercial agressif.

## 16. Hors Scope

- Paiement
- Inscription
- LMS
- Espace formateur
- Espace élève

## Conclusion Stratégique

Le site doit inspirer confiance par sa structure.
Il doit respirer.
Il doit imposer un cadre calme.

Il ne doit jamais donner l'impression de vendre.

On est sur un site d'institut. Pas une landing page.
