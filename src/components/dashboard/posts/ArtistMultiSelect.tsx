'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
  value?: string[];
  onChangeHandler: (value: string[]) => void;
  artists: IArtist[];
};

const ArtistMultiSelect = ({
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

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between input-field h-auto min-h-[44px] p-3 bg-transparent"
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {value.length === 0 ? (
                <span className="text-gray-500">
                  Sélectionner des artistes...
                </span>
              ) : (
                value.map((artistId) => (
                  <Badge
                    key={artistId}
                    variant="secondary"
                    className="bg-gray-100 text-gray-800 hover:bg-gray-200"
                  >
                    {getArtistName(artistId)}
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleRemove(artistId);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() => handleRemove(artistId)}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border">
          <Command className="bg-gray-800 border-none">
            <CommandInput
              placeholder="Rechercher un artiste..."
              className="text-gray-100"
            />
            <CommandList>
              <CommandEmpty className="text-gray-100 p-4">
                Aucun artiste trouvé.
              </CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto ">
                {artists.map((artist) => (
                  <CommandItem
                    key={artist._id}
                    value={artist.frenchName}
                    onSelect={() => handleSelect(artist._id)}
                    className="text-gray-100 focus:text-gray-900 cursor-pointer"
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value.includes(artist._id) ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{artist.frenchName}</span>
                      <span className="text-sm text-gray-400">
                        {artist.arabicName}
                      </span>
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
