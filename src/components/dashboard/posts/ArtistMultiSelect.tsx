'use client';

import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import type { IArtist } from '@/lib/database/models/artist.model';

type ArtistMultiSelectProps = {
  id?: string;
  value?: string[];
  onChangeHandler: (value: string[]) => void;
  artists: IArtist[];
};

const ArtistMultiSelect = ({
  id,
  value = [],
  onChangeHandler,
  artists,
}: ArtistMultiSelectProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (artistId: string) => {
    const newSelection = value.includes(artistId)
      ? value.filter((id) => id !== artistId)
      : [...value, artistId];

    onChangeHandler(newSelection);
  };

  const handleRemove = (artistId: string) => {
    const newSelection = value.filter((id) => id !== artistId);
    onChangeHandler(newSelection);
  };

  const getArtistName = (artistId: string) => {
    const artist = artists.find((a) => a._id === artistId);
    return artist ? artist.frenchName : '';
  };

  const onRemoveKey = (
    event: KeyboardEvent<HTMLSpanElement>,
    artistId: string,
  ) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    event.stopPropagation();
    handleRemove(artistId);
  };

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            role="combobox"
            aria-expanded={open}
            className="admin-combobox"
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {value.length === 0 ? (
                <span className="admin-placeholder">
                  Sélectionner des artistes...
                </span>
              ) : (
                value.map((artistId) => (
                  <Badge key={artistId} variant="secondary">
                    {getArtistName(artistId)}
                    {/* a span: a button inside this button would be invalid */}
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label={`Retirer ${getArtistName(artistId)}`}
                      className="ml-1 cursor-pointer rounded-full"
                      onKeyDown={(event) => onRemoveKey(event, artistId)}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleRemove(artistId);
                      }}
                    >
                      <X className="h-3 w-3" aria-hidden="true" />
                    </span>
                  </Badge>
                ))
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0" aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder="Rechercher un artiste..." />
            <CommandList>
              <CommandEmpty className="p-4">Aucun artiste trouvé.</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {artists.map((artist) => (
                  <CommandItem
                    key={artist._id}
                    value={artist.frenchName}
                    onSelect={() => handleSelect(artist._id)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value.includes(artist._id) ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{artist.frenchName}</span>
                      <span className="admin-help">{artist.arabicName}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ArtistMultiSelect;
