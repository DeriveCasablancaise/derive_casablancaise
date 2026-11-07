'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowUp, ChevronsDown, ChevronsUp } from 'lucide-react';
import { AdminButton, adminButtonClass } from '../admin-ui';
import {
  getAllPartners,
  saveEditionOrder,
} from '@/lib/actions/partner.actions';
import { EDITION_YEARS, type EditionYear } from '@/constants/editions';
import { moveInOrder, type OrderMove } from '@/lib/partner-order';
import { cn } from '@/lib/utils';

type OrderRow = {
  _id: string;
  frenchName: string;
  arabicName?: string;
  logoImage?: string;
};

type Message = { type: 'success' | 'error'; text: string };

const MOVES: {
  move: OrderMove;
  label: string;
  icon: typeof ArrowUp;
  blockedAt: 'first' | 'last';
}[] = [
  { move: 'top', label: 'Placer en tête', icon: ChevronsUp, blockedAt: 'first' },
  { move: 'up', label: 'Monter', icon: ArrowUp, blockedAt: 'first' },
  { move: 'down', label: 'Descendre', icon: ArrowDown, blockedAt: 'last' },
  {
    move: 'bottom',
    label: 'Placer en dernier',
    icon: ChevronsDown,
    blockedAt: 'last',
  },
];

const PartnerOrderManager = ({
  onDirtyChange,
}: {
  onDirtyChange?: (dirty: boolean) => void;
}) => {
  const [edition, setEdition] = useState<EditionYear>('2026');
  const [saved, setSaved] = useState<OrderRow[]>([]);
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  const listRef = useRef<HTMLOListElement>(null);
  const pendingFocus = useRef<{ id: string; move: OrderMove } | null>(null);

  const isDirty = rows.some((row, i) => row._id !== saved[i]?._id);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    let stale = false;
    setIsLoading(true);
    setMessage(null);
    setSaved([]);
    setRows([]);

    getAllPartners(edition)
      .then((data: OrderRow[]) => {
        if (stale) return;
        setSaved(data);
        setRows(data);
      })
      .catch(() => {
        if (!stale) {
          setMessage({
            type: 'error',
            text: 'Impossible de charger les partenaires.',
          });
        }
      })
      .finally(() => {
        if (!stale) setIsLoading(false);
      });

    return () => {
      stale = true;
    };
  }, [edition]);

  // A move can disable the pressed button or shift the row, so I put the focus
  // back on the same control, or the nearest one still enabled in that row.
  useLayoutEffect(() => {
    const pending = pendingFocus.current;
    if (!pending) return;
    pendingFocus.current = null;

    const row = listRef.current?.querySelector<HTMLElement>(
      `[data-row="${pending.id}"]`,
    );
    const control =
      row?.querySelector<HTMLButtonElement>(
        `[data-move="${pending.move}"]:not(:disabled)`,
      ) ?? row?.querySelector<HTMLButtonElement>('button:not(:disabled)');
    control?.focus();
  }, [rows]);

  const handleMove = (index: number, move: OrderMove) => {
    pendingFocus.current = { id: rows[index]._id, move };
    setRows(moveInOrder(rows, index, move));
    setMessage(null);
  };

  const handleCancel = () => {
    setRows(saved);
    setMessage(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      await saveEditionOrder(
        edition,
        rows.map((row) => row._id),
      );
      setSaved(rows);
      setMessage({ type: 'success', text: 'Ordre enregistré.' });
    } catch (error) {
      console.error('Failed to save the partner order', error);
      setMessage({
        type: 'error',
        text: "L'enregistrement a échoué. Rechargez la page et réessayez.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div
        role="group"
        aria-label="Édition"
        className="flex items-center gap-2 p-1 bg-gray-900/50 border border-gray-700 w-fit rounded-lg"
      >
        {EDITION_YEARS.map((year) => (
          <button
            key={year}
            type="button"
            aria-pressed={edition === year}
            // switching would drop the unsaved order
            disabled={isDirty || isSaving}
            onClick={() => setEdition(year)}
            className={cn(
              'min-h-10 px-4 py-2 rounded-md text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500',
              edition === year
                ? 'admin-btn-primary shadow-lg'
                : 'text-gray-300 hover:text-gray-100',
            )}
          >
            Édition {year}
          </button>
        ))}
      </div>

      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-100">
            Ordre d&apos;affichage {edition}
          </h2>
          <div className="flex flex-wrap gap-2">
            <AdminButton
              type="button"
              variant="secondary"
              disabled={!isDirty || isSaving}
              onClick={handleCancel}
            >
              Annuler
            </AdminButton>
            <AdminButton
              type="button"
              disabled={!isDirty || isSaving}
              onClick={handleSave}
            >
              {isSaving ? 'Enregistrement...' : "Enregistrer l'ordre"}
            </AdminButton>
          </div>
        </div>

        {message && (
          <p
            role={message.type === 'error' ? 'alert' : 'status'}
            className={cn(
              'mb-4 text-sm',
              message.type === 'error' ? 'text-red-400' : 'text-green-400',
            )}
          >
            {message.text}
          </p>
        )}

        {isDirty && (
          <p className="mb-4 text-sm text-gray-400">
            Modifications non enregistrées.
          </p>
        )}

        {isLoading ? (
          <p className="py-10 text-center text-gray-300">Chargement...</p>
        ) : rows.length === 0 ? (
          <p className="py-10 text-center text-gray-300">
            Aucun partenaire trouvé pour cette édition.
          </p>
        ) : (
          <ol ref={listRef} className="divide-y divide-gray-700">
            {rows.map((row, index) => (
              <li
                key={row._id}
                data-row={row._id}
                className="flex flex-wrap items-center gap-4 py-3"
              >
                <span className="w-6 text-sm text-gray-400 text-end">
                  {index + 1}
                </span>
                <div className="relative h-10 w-12 shrink-0 rounded-md overflow-hidden bg-neutral-900 border border-neutral-800">
                  {row.logoImage && (
                    <Image
                      src={row.logoImage}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  )}
                </div>
                <div className="min-w-32 flex-1">
                  <div className="text-sm font-medium text-gray-100">
                    {row.frenchName}
                  </div>
                  {row.arabicName && (
                    <div className="text-sm text-gray-400" dir="rtl">
                      {row.arabicName}
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  {MOVES.map(({ move, label, icon: Icon, blockedAt }) => (
                    <button
                      key={move}
                      type="button"
                      data-move={move}
                      aria-label={`${label} : ${row.frenchName}`}
                      title={label}
                      disabled={
                        isSaving ||
                        (blockedAt === 'first'
                          ? index === 0
                          : index === rows.length - 1)
                      }
                      onClick={() => handleMove(index, move)}
                      className={adminButtonClass('secondary', 'icon')}
                    >
                      <Icon size={18} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};

export default PartnerOrderManager;
