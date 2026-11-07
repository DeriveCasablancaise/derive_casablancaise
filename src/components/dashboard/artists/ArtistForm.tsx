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
import { toast } from '@/components/hooks/use-toast';
import { containsBlobUrl, uploadFilesOrThrow } from '@/lib/upload-helpers';
import { artistFormSchema } from '@/lib/validator';
import { EDITION_YEARS, getArtistEditions } from '@/lib/artist-editions';
import { Textarea } from '@/components/ui/textarea';
import { FileUploader } from '../FileUploader';
import FormActions from '../FormActions';
import { FieldHelp, FieldLabel, notifyInvalid } from '../admin-ui';
import { IArtist } from '@/lib/database/models/artist.model';
import { createArtist, updateArtist } from '@/lib/actions/artists.actions';
import { Checkbox } from '@/components/ui/checkbox';
import { FORMAT_ERROR } from '@/lib/square-crop';
import { useSquareCrop } from '../useSquareCrop';

type ArtistFormProps = {
  type: 'Create' | 'Update';
  artist?: IArtist;
  artistId?: string;
};

const ArtistForm = ({ type, artist, artistId }: ArtistFormProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // an unmigrated artist still has to show its old edition ticked
  const initialValues =
    artist && type === 'Update'
      ? { ...artist, editions: getArtistEditions(artist) }
      : artistDefaultValues;
  const router = useRouter();

  const { startUpload } = useUploadThing('imageUploader');
  const { prepareFiles, recrop, cropperNode } = useSquareCrop();

  const form = useForm<z.infer<typeof artistFormSchema>>({
    resolver: zodResolver(artistFormSchema),
    defaultValues: initialValues as z.infer<typeof artistFormSchema>,
  });

  // the action answers a taken name with a message for the name field
  const showFieldError = (result: unknown) => {
    const message = (result as { fieldError?: { frenchName?: string } })
      ?.fieldError?.frenchName;
    if (!message) return false;
    form.setError('frenchName', { type: 'server', message });
    form.setFocus('frenchName');
    return true;
  };

  // the new file replaces the url in the form; the old file stays on UploadThing
  const handleRecrop = (url: string) =>
    recrop(url, async (file) => {
      const [newUrl] = await uploadFilesOrThrow(startUpload, [file]);

      form.setValue(
        'images',
        form.getValues('images').map((image) =>
          image === url ? newUrl : image,
        ),
        { shouldDirty: true, shouldValidate: true },
      );
      toast({
        title: 'Image recadrée',
        description: "Enregistrez l'artiste pour conserver ce cadrage.",
      });
    });

  async function onSubmit(values: z.infer<typeof artistFormSchema>) {
    setIsLoading(true);

    try {
      let uploadedImageUrls = values.images;

      // new files are in the same order as their previews, so I swap them in place
      if (files.length > 0) {
        const newImageUrls = await uploadFilesOrThrow(startUpload, files);
        uploadedImageUrls = values.images.map((url) =>
          url.startsWith('blob:') ? newImageUrls.shift() ?? url : url,
        );
      }

      if (containsBlobUrl(uploadedImageUrls)) {
        throw new Error('Image invalide, veuillez la téléverser à nouveau');
      }

      if (type === 'Create') {
        const newArtist = await createArtist({
          ...values,
          images: uploadedImageUrls,
        });

        if (showFieldError(newArtist)) return;

        if (newArtist) {
          form.reset();
          toast({ title: 'Artiste créé' });
          router.push(`/darja-admin/artists`);
        }
      }

      if (type === 'Update') {
        if (!artistId) {
          router.back();
          return;
        }

        const updatedArtist = await updateArtist({
          artist: { ...values, images: uploadedImageUrls, _id: artistId },
        });

        if (showFieldError(updatedArtist)) return;

        if (updatedArtist) {
          form.reset();
          toast({ title: 'Artiste modifié' });
          router.push(`/darja-admin/artists`);
        }
      }
    } catch (error) {
      console.error('Error saving the artist', error);
      toast({
        variant: 'destructive',
        title: "L'enregistrement a échoué",
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, notifyInvalid)}
        className="flex flex-col gap-5"
      >
        <div className="admin-section">
          <h2 className="admin-section-title">Informations</h2>
          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="frenchName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FieldLabel required>Nom (français)</FieldLabel>
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
                  <FieldLabel required>Nom (arabe)</FieldLabel>
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

          <FormField
            control={form.control}
            name="editions"
            render={({ field }) => (
              <FormItem className="w-full">
                <FieldLabel required>Éditions</FieldLabel>
                <div className="flex flex-wrap items-center gap-6 py-2">
                  {EDITION_YEARS.map((year) => (
                    <div key={year} className="flex items-center gap-2">
                      <Checkbox
                        id={`edition-${year}`}
                        checked={field.value.includes(year)}
                        onCheckedChange={(checked) =>
                          field.onChange(
                            checked
                              ? [...field.value, year]
                              : field.value.filter((y) => y !== year),
                          )
                        }
                      />
                      <label
                        htmlFor={`edition-${year}`}
                        className="checkbox-label"
                      >
                        {year}
                      </label>
                    </div>
                  ))}
                </div>
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
                      Ajouter cet artiste à la page d&apos;accueil
                    </label>
                  </div>
                </FormControl>
                <FieldHelp>
                  Sans effet pour le moment : l&apos;accueil montre tous les
                  artistes de l&apos;édition en cours.
                </FieldHelp>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="admin-section">
          <h2 className="admin-section-title">Textes</h2>
          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="frenchText"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FieldLabel required>Texte (français)</FieldLabel>
                  <FormControl className="h-72">
                    <Textarea
                      placeholder="Texte en français"
                      {...field}
                      className="textarea"
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
                  <FieldLabel required>Texte (arabe)</FieldLabel>
                  <FormControl className="h-72">
                    <Textarea
                      placeholder="المحتوى باللغة العربية"
                      {...field}
                      className="textarea"
                      dir="rtl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="admin-section">
          <h2 className="admin-section-title">Liens</h2>
          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="videoSource"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FieldLabel>Source de la vidéo</FieldLabel>
                  <FormControl>
                    <Input
                      placeholder="Lien de la vidéo"
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
              name="url"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FieldLabel>Lien utile</FieldLabel>
                  <FormControl>
                    <Input
                      placeholder="Lien utile à partager"
                      className="input-field"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="admin-section">
          <h2 className="admin-section-title">Images</h2>
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem className="w-full">
                <FieldLabel>Images de l&apos;artiste</FieldLabel>
                <FormControl>
                  <FileUploader
                    onFieldChange={field.onChange}
                    imageUrls={field.value}
                    setFiles={setFiles}
                    prepareFiles={prepareFiles}
                    onFilesRejected={() =>
                      toast({
                        variant: 'destructive',
                        title: 'Image refusée',
                        description: FORMAT_ERROR,
                      })
                    }
                    onRecrop={handleRecrop}
                    formatsHint="JPG, PNG, WebP, HEIC (8 Mo maximum)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormActions
          isLoading={isLoading}
          submitLabel={type === 'Create' ? "Créer l'artiste" : "Modifier l'artiste"}
          cancelHref="/darja-admin/artists"
        />
      </form>
      {cropperNode}
    </Form>
  );
};

export default ArtistForm;
