// Registre declaratif qui pilote les formulaires generiques du CMS vitrine.
// Une seule source de verite pour les champs editables (valeurs + collections),
// de sorte que les editeurs (SiteContentEditor / SiteCollectionEditor) restent generiques.

export type FieldType = "text" | "textarea" | "number";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
}

/** Valeur site_content editable : soit une chaine simple, soit un objet a champs. */
export interface ContentFieldDef {
  key: string;
  label: string;
  group: string;
  kind: "text" | "object";
  fields?: FieldDef[];
}

export const CONTENT_FIELDS: ContentFieldDef[] = [
  {
    key: "page_last_updated",
    label: "Date de dernière actualisation",
    group: "formation_pnl",
    kind: "text",
  },
  {
    key: "formation_price",
    label: "Tarif formation PNL",
    group: "formation_pnl",
    kind: "text",
  },
  {
    key: "resultats_pnl",
    label: "Indicateurs de résultats (PNL)",
    group: "formation_pnl",
    kind: "object",
    fields: [
      { name: "satisfactionSur5", label: "Satisfaction (/5)", type: "number" },
      { name: "tauxReussite", label: "Taux de réussite (%)", type: "number" },
      { name: "tauxCompletion", label: "Taux de complétion (%)", type: "number" },
      { name: "nombreApprenants", label: "Nombre d'apprenants", type: "number" },
      {
        name: "tauxRecommandation",
        label: "Taux de recommandation (%)",
        type: "number",
      },
    ],
  },
];

/** Collection editable (site_collections) : un type d'item ordonnable. */
export interface CollectionSchema {
  type: "modules_pnl" | "faq";
  label: string;
  titleField: string;
  itemFields: FieldDef[];
}

export const COLLECTION_SCHEMAS: CollectionSchema[] = [
  {
    type: "modules_pnl",
    label: "Modules PNL",
    titleField: "title",
    itemFields: [
      { name: "title", label: "Titre", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },
  {
    type: "faq",
    label: "FAQ",
    titleField: "question",
    itemFields: [
      { name: "question", label: "Question", type: "text" },
      { name: "answer", label: "Réponse", type: "textarea" },
    ],
  },
];
