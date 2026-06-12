/**
 * Thrown when a resource is not found (e.g., invalid URL param).
 * AsyncBoundary detects this and renders a NotFound component instead of a generic error.
 */
export class NotFoundError extends Error {
  constructor(resource: string, id: string) {
    super(`${resource} introuvable (ID: ${id})`);
    this.name = "NotFoundError";
  }
}

/**
 * Thrown by form submit handlers when field-level validation fails.
 * FormModal/ConfirmDialog catch it silently: the field errors are already
 * displayed inline, no generic message is needed.
 */
export class FormValidationError extends Error {
  constructor() {
    super("Validation du formulaire échouée");
    this.name = "FormValidationError";
  }
}
