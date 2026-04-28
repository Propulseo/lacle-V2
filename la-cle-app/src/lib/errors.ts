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
