// Pure helpers of add-2026-to-partners.mjs, kept apart so a test can import them.
import { ALL_EDITIONS, normaliseName } from './seed-2026-helpers.mjs';

// same mapping as getPartnerEditions in src/lib/partner-editions.ts ('both' never meant 2026)
export function partnerEditions(partner) {
  const editions = (partner.editions ?? []).filter((e) => ALL_EDITIONS.includes(e));
  if (editions.length > 0) return editions;
  const legacy = partner.yearOfPartnership;
  if (legacy === 'both') return ['2022', '2024'];
  if (ALL_EDITIONS.includes(legacy)) return [legacy];
  return [];
}

// "a, b" -> normalised names, empty entries dropped
export const parseNames = (value) =>
  String(value ?? '')
    .split(',')
    .map(normaliseName)
    .filter(Boolean);

// partners of the 2024 edition, narrowed by --only / --exclude (lists of normalised names)
export function selectPartners(partners, { only = [], exclude = [] } = {}) {
  return partners.filter((p) => {
    if (!partnerEditions(p).includes('2024')) return false;
    const name = normaliseName(p.frenchName);
    if (only.length > 0 && !only.includes(name)) return false;
    return !exclude.includes(name);
  });
}

// what to write so the partner gains 2026, or null when it already has it.
// A document without editions gets the legacy value first, then 2026.
export function editionsUpdate(partner) {
  if ((partner.editions ?? []).includes('2026')) return null;
  const hasEditions = (partner.editions ?? []).length > 0;
  if (hasEditions) return { kind: 'addToSet' };
  return { kind: 'set', editions: [...new Set([...partnerEditions(partner), '2026'])].sort() };
}

// Order of 2026 after the run.
// existing: orderedIds of the 2026 Order, or null when there is none.
// base2024: orderedIds of the 2024 Order (may be empty or null).
// selectedIds: ids of the selected partners.
// Returns the full list plus the ids that are new compared to `existing`.
export function mergeOrder(existing, base2024, selectedIds) {
  const selected = selectedIds.map(String);
  const inSelected = new Set(selected);

  if (existing) {
    const current = existing.map(String);
    const have = new Set(current);
    const added = selected.filter((id) => !have.has(id));
    return { orderedIds: [...current, ...added], added };
  }

  // no 2026 order yet: 2024 order restricted to the selection, then the rest at the end
  const fromBase = [...new Set((base2024 ?? []).map(String))].filter((id) => inSelected.has(id));
  const placed = new Set(fromBase);
  const rest = selected.filter((id) => !placed.has(id));
  const orderedIds = [...fromBase, ...rest];
  return { orderedIds, added: orderedIds };
}
