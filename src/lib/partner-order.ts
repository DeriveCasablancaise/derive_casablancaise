export type OrderMove = 'up' | 'down' | 'top' | 'bottom';

// Stored order first, then partners missing from it, by name.
// Ids of partners no longer in the edition drop out on their own.
export function mergeEditionOrder<T extends { _id: string; frenchName: string }>(
  storedIds: readonly string[],
  partners: readonly T[],
): T[] {
  const remaining = new Map(partners.map((p) => [p._id, p]));
  const ordered: T[] = [];

  for (const id of storedIds) {
    const partner = remaining.get(id);
    if (partner) {
      ordered.push(partner);
      remaining.delete(id);
    }
  }

  const missing = Array.from(remaining.values()).sort((a, b) =>
    a.frenchName.localeCompare(b.frenchName, 'fr', { sensitivity: 'base' }),
  );
  return [...ordered, ...missing];
}

// Returns a new list, or the same content when the move goes nowhere.
export function moveInOrder<T>(
  list: readonly T[],
  index: number,
  move: OrderMove,
): T[] {
  const targets: Record<OrderMove, number> = {
    up: index - 1,
    down: index + 1,
    top: 0,
    bottom: list.length - 1,
  };
  const target = targets[move];
  const next = [...list];
  if (index < 0 || index >= list.length) return next;
  if (target < 0 || target >= list.length) return next;

  const [item] = next.splice(index, 1);
  next.splice(target, 0, item);
  return next;
}
