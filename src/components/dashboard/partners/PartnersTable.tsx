'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, GripVertical } from 'lucide-react';
import {
  getAllPartners,
  updatePartnerOrder,
} from '@/lib/actions/partner.actions';
import { DeleteConfirmation } from '../posts/DeleteConfirmation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// DND Kit Imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Partner {
  _id: string;
  frenchName: string;
  arabicName: string;
  yearOfPartnership: string;
  logoImage?: string;
  hrefLink?: string;
  createdAt: Date;
}

interface PartnersTableProps {
  currentUserIsAdmin: boolean;
}

// --- Sortable Row Component ---
const SortablePartnerRow = ({
  partner,
  currentUserIsAdmin,
  handleDelete,
}: {
  partner: Partner;
  currentUserIsAdmin: boolean;
  handleDelete: (id: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: partner._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    position: 'relative' as const,
    backgroundColor: isDragging ? 'rgba(31, 41, 55, 0.9)' : 'transparent',
  };

  return (
    <motion.tr
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(isDragging ? 'shadow-2xl' : '', 'group')}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          {currentUserIsAdmin && (
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300 transition-colors"
            >
              <GripVertical size={20} />
            </div>
          )}
          <div className="flex-shrink-0">
            <div className="relative h-10 w-12 rounded-md overflow-hidden bg-neutral-900 border border-neutral-800">
              {partner.logoImage ? (
                <Image
                  src={partner.logoImage}
                  alt={partner.frenchName}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                  No logo
                </div>
              )}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-100">
          {partner.frenchName}
        </div>
        {partner.arabicName && (
          <div className="text-sm text-gray-400" dir="rtl">
            {partner.arabicName}
          </div>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-300">{partner.yearOfPartnership}</div>
      </td>

      {currentUserIsAdmin && (
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
          <Button
            asChild
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-md border border-gray-700 my-4 mx-2"
            variant="outline"
          >
            <Link href={`/darja-admin/partners/${partner._id}/update`}>
              Modifier
            </Link>
          </Button>
          <DeleteConfirmation postId={partner._id} onDelete={handleDelete} />
        </td>
      )}
    </motion.tr>
  );
};

// --- Main Table Component ---
const PartnersTable = ({ currentUserIsAdmin }: PartnersTableProps) => {
  const [selectedYear, setSelectedYear] = useState<'2024' | '2022'>('2024');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);

  // DND Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    async function fetchPartners() {
      // Pass selectedYear to fetch specific data for that edition
      const data = await getAllPartners(selectedYear);
      setPartners(data);
      setFilteredPartners(data);
    }
    fetchPartners();
  }, [selectedYear]);

  const handleDelete = (partnerId: string) => {
    const updateList = (prev: Partner[]) =>
      prev.filter((p) => p._id !== partnerId);
    setPartners(updateList);
    setFilteredPartners(updateList);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = partners.filter(
      (partner) =>
        partner.frenchName.toLowerCase().includes(term) ||
        (partner.arabicName && partner.arabicName.toLowerCase().includes(term)),
    );
    setFilteredPartners(filtered);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = partners.findIndex((p) => p._id === active.id);
      const newIndex = partners.findIndex((p) => p._id === over.id);

      const newOrder = arrayMove(partners, oldIndex, newIndex);

      // Optimistic UI Update
      setPartners(newOrder);
      setFilteredPartners(newOrder);

      try {
        const orderedIds = newOrder.map((p) => p._id);

        // FIX: Pass selectedYear as the second argument here
        await updatePartnerOrder(orderedIds, selectedYear);
      } catch (error) {
        console.error('Failed to save new order', error);
        // Refresh data from server if update fails
        const originalData = await getAllPartners(selectedYear);
        setPartners(originalData);
        setFilteredPartners(originalData);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Year Selection Tabs */}
      <div className="flex items-center gap-2 p-1 bg-gray-900/50 border border-gray-700 w-fit rounded-lg">
        <button
          onClick={() => setSelectedYear('2024')}
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium transition-all',
            selectedYear === '2024'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-gray-200',
          )}
        >
          Édition 2024
        </button>
        <button
          onClick={() => setSelectedYear('2022')}
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium transition-all',
            selectedYear === '2022'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-gray-200',
          )}
        >
          Édition 2022
        </button>
      </div>

      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-100">
            Partenaires {selectedYear}
          </h2>
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Rechercher..."
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Logo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Année
                  </th>
                  {currentUserIsAdmin && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>

              <SortableContext
                items={filteredPartners.map((p) => p._id)}
                strategy={verticalListSortingStrategy}
              >
                <tbody className="divide-y divide-gray-700">
                  {filteredPartners.length > 0 ? (
                    filteredPartners.map((partner) => (
                      <SortablePartnerRow
                        key={partner._id}
                        partner={partner}
                        currentUserIsAdmin={currentUserIsAdmin}
                        handleDelete={handleDelete}
                      />
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        Aucun partenaire trouvé pour cette édition.
                      </td>
                    </tr>
                  )}
                </tbody>
              </SortableContext>
            </table>
          </DndContext>
        </div>
      </motion.div>
    </div>
  );
};

export default PartnersTable;
