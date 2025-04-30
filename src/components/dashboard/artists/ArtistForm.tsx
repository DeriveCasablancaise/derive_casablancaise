'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import * as z from 'zod';
import { useState } from 'react';
import { artistDefaultValues } from '@/constants';
import { useRouter } from 'next/navigation';
import { useUploadThing } from '@/lib/uploadthing';
import { artistFormSchema } from '@/lib/validator';
import { handleError } from '@/lib/utils';
import Dropdown from './DropDown';
import { Textarea } from '@/components/ui/textarea';
import { FileUploader } from '../FileUploader';
import SubmitButton from '../SubmitButton';
import { IArtist } from '@/lib/database/models/artist.model';
import { createArtist, updateArtist } from '@/lib/actions/artists.actions';
import { Checkbox } from '@/components/ui/checkbox';

type ArtistFormProps = {
  type: 'Create' | 'Update';
  artist?: IArtist;
  artistId?: string;
};

const ArtistForm = ({ type, artist, artistId }: ArtistFormProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues =
    artist && type === 'Update' ? artist : artistDefaultValues;
  const router = useRouter();

  const { startUpload } = useUploadThing('imageUploader');

  const form = useForm<z.infer<typeof artistFormSchema>>({
    resolver: zodResolver(artistFormSchema),
    defaultValues: initialValues as z.infer<typeof artistFormSchema>,
  });

  async function onSubmit(values: z.infer<typeof artistFormSchema>) {
    setIsLoading(true);

    let uploadedImageUrls = values.images;

    if (files.length > 0) {
      const uploadedImages = await startUpload(files);

      if (!uploadedImages) {
        return;
      }

      uploadedImageUrls = uploadedImages.map((img) => img.url);
    }

    if (type === 'Create') {
      try {
        const newArtist = await createArtist({
          ...values,
          images: uploadedImageUrls,
        });

        if (newArtist) {
          form.reset();
          router.push(`/darja-admin/artists`);
        }
      } catch (error) {
        console.log('Error creating a new artist:', error);
      }
    }

    if (type === 'Update' && artistId) {
      if (!artistId) {
        router.back();
        return;
      }

      try {
        const updatedArtist = await updateArtist({
          artist: { ...values, images: uploadedImageUrls, _id: artistId },
        });

        if (updatedArtist) {
          form.reset();
          router.push(`/darja-admin/artists`);
        }
      } catch (error) {
        console.error('Error updating the artist', error);
        handleError(error);
      }
    }

    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="frenchName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Nom de l'artiste en français"
                    className="input-field"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="arabicName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="الإسم باللغة العربية"
                    className="input-field"
                    {...field}
                    dir="rtl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="artistCategory"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Dropdown
                    value={field.value}
                    onChangeHandler={(value) => field.onChange(value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="videoSource"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Source de la video"
                    className="input-field"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="frenchText"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <Textarea
                    placeholder="Texte en français"
                    {...field}
                    className="textarea rounded-2xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="arabicText"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <Textarea
                    placeholder="المحتوى باللغة العربية"
                    {...field}
                    className="textarea rounded-2xl"
                    dir="rtl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Lien util à partager"
                  className="input-field"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl className="h-72">
                <FileUploader
                  onFieldChange={field.onChange}
                  imageUrls={field.value}
                  setFiles={setFiles}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isInHomepage"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="flex items-center gap-4">
                  <Checkbox
                    id="isInHomepage"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <label htmlFor="isInHomepage" className="checkbox-label">
                    Ajouter cet artiste à la page d'accueil
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitButton isLoading={isLoading}>
          {type === 'Create' ? "Créer l'artiste " : "Modifier l'artiste"}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default ArtistForm;
