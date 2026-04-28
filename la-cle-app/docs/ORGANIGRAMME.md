# ORGANIGRAMME — La Clé Institut
> Source : Organigramme_Société.docx
> Document de projection et d'organisation. État actuel au 27 avril 2026.

---

## Structure générale

```
La Clé Institut
├── 1. Direction Générale
├── 2. Direction Pédagogique
├── 3. Pôle Digital / Produits
├── 4. Pôle Commercial (externalisé)
├── 5. Pôle Communauté / Fidélisation
└── 6. Pôle Administratif
```

---

## 1. Direction Générale
**Responsable : Marien Jesson** (Président / CEO)

Responsabilités :
- Vision
- Stratégie
- Image publique
- Innovation
- Grands partenariats
- Consulting premium

---

## 2. Direction Pédagogique
**Responsable pédagogique : Marien Jesson**

Responsabilités :
- Programmes
- Qualité Qualiopi
- Recrutement formateurs
- Suivi satisfaction
- Examens / certifications

**Formateurs internes** : 0 pour le moment

Rôles prévus (quand recrutés) :
- Présentiel
- Coaching groupe
- Animation ateliers
- Corrections

---

## 3. Pôle Digital / Produits
**Responsable : Propul'SEO (Étienne)**

Responsabilités :
- Expérience apprenant
- Parcours en ligne
- Abonnements
- UX

**Prestataire tech / équipe web : Propul'SEO**
- Développement
- Maintenance
- Automatisations

> → C'est le pôle qui gère `la-cle-app` (LMS) et `la-cle-institut` (site vitrine).

---

## 4. Pôle Commercial (externalisé)
**Responsable : Propul'SEO (Étienne)**

Responsabilités :
- Acquisition
- Funnels
- Campagnes
- Closing / prospection

**Responsable partenariats B2B** (interne, prévu plus tard) :
- Entreprises
- Grands comptes
- Séminaires

---

## 5. Pôle Communauté / Fidélisation
**Responsable : Marien Jesson** (Community Manager / Customer Success premium)

Responsabilités :
- Accueil des apprenants
- Réponses intelligentes
- Suivi de progression
- Relances humaines
- Rassurer sans vendre
- Détection des décrochages
- Communauté membres
- Animation abonnements
- Engagement
- Upsell naturel

> → Ce pôle est le premier destinataire des alertes d'inactivité du dashboard anti-décrochage (Indicateur 12).

---

## 6. Pôle Administratif
**Responsable : Marien Jesson**

**Assistante direction / ADV : Marien Jesson** (pour l'instant)
- Conventions
- Contrats
- Facturation
- Suivi dossiers

**Comptable externe** : aucun comptable attitré pour le moment
- Comptabilité
- Paie
- Fiscal

---

## Implications pour le code

| Pôle | Rôle dans la plateforme |
|------|------------------------|
| Marien (Direction / Pédagogie / Communauté / Admin) | Utilisateur admin principal — accès à toutes les pages `/admin` |
| Propul'SEO (Digital) | Développement et maintenance — accès dev/technique |
| Formateurs (à venir) | Besoin futur : rôle "formateur" pour la relecture des réponses libres et l'animation des corrections |
| Apprenants | Utilisateurs `/espace` |
