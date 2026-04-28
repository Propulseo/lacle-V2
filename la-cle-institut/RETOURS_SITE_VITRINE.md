# RETOURS SITE VITRINE — la-cle-institut
> Source : Retours groupés du site Web et Parcours test utilisateur — 13 avril 2026
> Rédigé par Marien Jesson suite aux tests utilisateurs.
> Les points XXXXX ou ????? sont à débattre avec Marien avant de coder.

---

## RETOUR GLOBAL

- Performance : une seule occurrence de lags sur plusieurs visites — acceptable
- Mode clair/sombre : beaucoup d'utilisateurs ne comprennent pas qu'on peut changer de mode
  - Un utilisateur l'a compris à la fin de sa visite
  - Beaucoup ne l'ont pas capté du tout
  - **→ Priorité : ajouter une micro-animation à l'entrée** pour indiquer le toggle
- Contenu : deux utilisateurs ont dit avoir envie de tout lire → une semaine après, c'est quasi-général
- Page de vente : 2 personnes s'estiment perdues — normal, pas encore travaillée/validée

---

## RETOUR ESTHÉTIQUE

| Point | Statut | Action |
|-------|--------|--------|
| Tache bronze mode clair trop forte | Gêne visuelle (photosensibilité Marien) | Adoucir l'opacité — ne pas supprimer |
| Site trouvé "très joli" | Validation générale | ✅ |
| Logo définitif | En attente | Prévoir emplacement dans l'animation d'entrée |
| Boutons | Lisibles et simples, différenciants vs concurrents | Explorer une variante plus élégante |
| Numéros dans menu déroulant | Gros coup de cœur | ✅ |

---

## RETOUR TEXTES

| Section | Retour | Action |
|---------|--------|--------|
| Notre Vocation | Textes excellents, donnent envie de lire | ✅ Rien à faire |
| Encart texte court | Bonne dynamique, citation bien placée | ✅ |
| Accroche perso | Indécis entre 3 options | ⏳ Décider en réunion : *Comprendre Puis Agir* / *Comprendre et Agir* / *Comprendre avant d'agir* |
| Page Concept | Ne fait pas comprendre que c'est sans livret, 100% vidéo, 100% réussite avant présentiel | 📝 À reformuler — en réunion avec Marien pour les mots-clés |
| Mot "rigueur" | Trop filtrant — exclut des profils qui ont juste envie d'apprendre | 📝 À remplacer |
| Parcours fondateur | Manque : pratique depuis 10 ans + a d'autres métiers | 📝 À ajouter — formulation à décider en réunion |
| FAQ — définition PNL | Ajouter "voire d'altruisme" + préciser jamais technique de manipulation | Texte cible : *"La PNL est enseignée ici comme un outil d'observation, de compréhension et voire d'altruisme — jamais comme une technique de manipulation ou de transformation rapide."* |

---

## RETOUR NAVIGATION

### Section "Nous Découvrir"

**Ordre de découverte**
- Le site est pensé pour être parcouru dans l'ordre : Vocation → Concept → Équipe
- Les utilisateurs ne le comprennent pas spontanément
- → Ajouter une micro-animation sur le premier item (Notre Vocation) pour indiquer l'ordre

**Navigation interne entre les 3 pages**
- Grosse demande : **breadcrumb en bas de chaque page** de la section
- Format : `Vocation > Concept > Équipe` (item actif mis en avant)
- Cliquable, évite de repasser par le header
- Sur la page Équipe : conserver le bouton "Aller vers la formation"

**Page Notre Concept**
- XXXXX : architecture à décider — peut-être refonte ou même structure que Vocation
- Il était prévu des vidéos ici (à confirmer avec Marien)

**Page Notre Équipe**
- Inverser : **texte d'abord**, vidéo en dessous
- Les textes actuels des membres sont top (3 retours positifs sur le titre de Titi — retenu comme "garant pédagogique" de façon intuitive)

### Section "Formations"

**Problème actuel**
- Afficher présentiel + distanciel crée de la confusion
- Non conforme Qualiopi (formation présentielle pas prête)
- → **Retirer la mention présentiel immédiatement**

**Proposition refonte UI**
Remplacer le menu actuel par un **carrousel / roue** :
- Une roue par parcours (PNL, AT, Systémique...)
- Chaque formation avec badge de statut :
  - Disponible
  - En cours de création
  - En projet
- Au clic sur "Disponible" → page de vente de la formation
- Les autres → état désactivé ("Bientôt disponible")

*Objectif : l'utilisateur comprend d'un coup d'œil qu'il y a plusieurs niveaux, une alternance distanciel/présentiel, des parcours à venir.*

---

## OBLIGATIONS QUALIOPI PAGE DE VENTE (Indicateur 1)

- Programme de formation téléchargeable ou lisible directement
  - Option : capturer l'email pour télécharger (récupération de leads)
- Référentiel de compétences : même logique
- Mention "Actualisé en mai 2026" obligatoire sur la page

---

## BUGS SIGNALÉS

- **Chevauchements visuels** repérés par les testeurs — liste détaillée non fournie dans le document
  - → Demander à Marien les détails précis ou reproduire en testant

---

## PROJECTION (éléments futurs, pas urgents)

- Podcast avec Théo (questions/réponses dans un studio) : extraire les meilleurs moments pour "vendre" la formation. Prévu comme remplacement des vidéos figées/cadrées.
- Section témoignages sur la page formations

---

## POINTS OUVERTS À DÉBATTRE AVEC MARIEN

1. Accroche perso : choisir entre les 3 versions
2. Mot "rigueur" : trouver un remplaçant
3. Parcours fondateur : quels mots, quel angle ?
4. Page Concept XXXXX : architecture à décider
5. Rôles affichés sur la page Équipe (Marien / Titi / Poupette)
6. Bouton signalement bugs : email dédié ou formulaire contact ?
