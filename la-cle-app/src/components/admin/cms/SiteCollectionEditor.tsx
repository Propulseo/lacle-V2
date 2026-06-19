"use client";

import { useState } from "react";
import { Plus, ArrowUp, ArrowDown, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { AsyncBoundary } from "@/components/ui/AsyncBoundary";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { CollectionItemFormModal } from "./CollectionItemFormModal";
import {
  listCollection,
  createCollectionItem,
  updateCollectionItem,
  setItemPublished,
  deleteCollectionItem,
  moveItem,
  type Json,
  type SiteCollectionRow,
} from "@/services/site-cms";
import type { CollectionSchema } from "@/lib/cms-schema";

interface SiteCollectionEditorProps {
  schema: CollectionSchema;
}

/** Extrait une valeur texte du jsonb data d'un item, pour une cle donnee. */
function readField(item: SiteCollectionRow, field: string): string {
  const data = item.data;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const value = (data as Record<string, Json | undefined>)[field];
    if (typeof value === "string") return value;
  }
  return "";
}

function toFormInitial(schema: CollectionSchema, item: SiteCollectionRow): Record<string, string> {
  const initial: Record<string, string> = {};
  for (const field of schema.itemFields) initial[field.name] = readField(item, field.name);
  return initial;
}

export function SiteCollectionEditor({ schema }: SiteCollectionEditorProps) {
  const state = useAsyncData(() => listCollection(schema.type), [schema.type]);
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<SiteCollectionRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SiteCollectionRow | null>(null);

  async function handleCreate(data: Json) {
    const items = state.data ?? [];
    const lastPosition = items.length > 0 ? items[items.length - 1].position : 0;
    await createCollectionItem(schema.type, data, lastPosition + 1);
    state.refetch();
  }

  async function handleEdit(data: Json) {
    if (!editItem) return;
    await updateCollectionItem(editItem.id, data);
    setEditItem(null);
    state.refetch();
  }

  async function handleMove(item: SiteCollectionRow, direction: "up" | "down") {
    await moveItem(item.id, direction, state.data ?? []);
    state.refetch();
  }

  async function handleTogglePublished(item: SiteCollectionRow) {
    await setItemPublished(item.id, !item.published);
    state.refetch();
  }

  const columns: Column<SiteCollectionRow>[] = [
    {
      key: "title",
      header: schema.label,
      render: (item) => (
        <span className="text-ivoire">{readField(item, schema.titleField) || "—"}</span>
      ),
    },
    {
      key: "status",
      header: "Statut",
      render: (item) => (
        <Badge variant={item.published ? "success" : "default"}>
          {item.published ? "Publié" : "Brouillon"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "w-px whitespace-nowrap",
      render: (item) => {
        const list = state.data ?? [];
        const index = list.findIndex((i) => i.id === item.id);
        return (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <IconButton
              label="Monter"
              disabled={index <= 0}
              onClick={() => handleMove(item, "up")}
            >
              <ArrowUp className="h-4 w-4" />
            </IconButton>
            <IconButton
              label="Descendre"
              disabled={index < 0 || index >= list.length - 1}
              onClick={() => handleMove(item, "down")}
            >
              <ArrowDown className="h-4 w-4" />
            </IconButton>
            <IconButton
              label={item.published ? "Dépublier" : "Publier"}
              onClick={() => handleTogglePublished(item)}
            >
              {item.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </IconButton>
            <IconButton label="Modifier" onClick={() => setEditItem(item)}>
              <Pencil className="h-4 w-4" />
            </IconButton>
            <IconButton label="Supprimer" danger onClick={() => setDeleteTarget(item)}>
              <Trash2 className="h-4 w-4" />
            </IconButton>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="h-4 w-4" />}
          onClick={() => setAddOpen(true)}
        >
          Ajouter
        </Button>
      </div>

      <AsyncBoundary
        state={state}
        loadingLabel="Chargement des éléments…"
        empty={
          <div className="rounded-xl border border-filet py-12 text-center text-cendre">
            Aucun élément. Cliquez sur « Ajouter » pour commencer.
          </div>
        }
      >
        {(items) => (
          <DataTable
            data={items}
            columns={columns}
            keyExtractor={(item) => item.id}
            onRowClick={(item) => setEditItem(item)}
          />
        )}
      </AsyncBoundary>

      <CollectionItemFormModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        schema={schema}
        onSubmit={handleCreate}
      />

      {editItem && (
        <CollectionItemFormModal
          isOpen
          onClose={() => setEditItem(null)}
          schema={schema}
          initial={toFormInitial(schema, editItem)}
          onSubmit={handleEdit}
        />
      )}

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteCollectionItem(deleteTarget.id);
          setDeleteTarget(null);
          state.refetch();
        }}
        title="Supprimer l'élément"
        message="Voulez-vous vraiment supprimer cet élément ? Cette action est définitive."
        confirmLabel="Supprimer"
      />
    </div>
  );
}

function IconButton({
  children,
  label,
  onClick,
  disabled,
  danger,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={
        "rounded p-1.5 text-pierre transition-colors hover:bg-ivoire/5 disabled:opacity-30 disabled:hover:bg-transparent " +
        (danger ? "hover:text-erreur" : "hover:text-ivoire")
      }
    >
      {children}
    </button>
  );
}
