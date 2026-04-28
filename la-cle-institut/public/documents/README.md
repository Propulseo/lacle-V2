# Documents pédagogiques — Qualiopi

Ce dossier regroupe les documents téléchargeables depuis les pages de vente
des formations. Les liens sont servis tels quels sous `/documents/<fichier>`.

## Fichiers attendus

| Chemin public                                     | Page appelante                        |
| ------------------------------------------------- | ------------------------------------- |
| `/documents/pnl-praticien-programme.pdf`          | `/formations/pnl-praticien` (bouton)  |
| `/documents/pnl-praticien-referentiel.pdf`        | `/formations/pnl-praticien` (bouton)  |

Tant que les PDF réels ne sont pas déposés ici, les boutons de
téléchargement renverront un 404 — comportement attendu en attendant la
livraison des documents par l'équipe pédagogique.

Pour remplacer un fichier :

1. Déposer le PDF dans ce dossier sous le nom indiqué ci-dessus.
2. Vérifier que le lien `/documents/...` dans `FormationDocuments.tsx`
   pointe bien sur ce nom.
3. Bumper `PAGE_LAST_UPDATED` dans `src/lib/qualiopi.ts` si la mise à jour
   modifie le contenu pédagogique visible.
