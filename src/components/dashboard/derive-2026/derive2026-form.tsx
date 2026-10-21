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
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUploadThing } from '@/lib/uploadthing';
import { toast } from '@/components/hooks/use-toast';
import { containsBlobUrl, uploadFilesOrThrow } from '@/lib/upload-helpers';
import SubmitButton from '../SubmitButton';
import TiptapEditor from '../TiptapEditor';
import { VideoFileUploader } from '../derive-2024/VideoFileUploader';
import { BgImageUploader } from '../derive-2024/BgImageUploader';
import { derive2026FormSchema } from '@/lib/validator';
import { DERIVE_2026_DEFAULTS } from '@/lib/derive2026-defaults';
import { IDerive2026 } from '@/lib/database/models/derive2026.model';
import { updateDerive2026 } from '@/lib/actions/derive2026.actions';

type Derive2026FormProps = {
  derive2026?: IDerive2026;
};

type FormValues = z.infer<typeof derive2026FormSchema>;

const TEXT_BLOCKS = [1, 2, 3] as const;
const VIDEOS = [1, 2] as const;

const Derive2026Form = ({ derive2026 }: Derive2026FormProps) => {
  const [videoFiles, setVideoFiles] = useState<
    Record<number, File[] | null>
  >({ 1: null, 2: null });
  const [bgImageFile, setBgImageFile] = useState<File[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { startUpload } = useUploadThing('imageUploader');

  const form = useForm<FormValues>({
    resolver: zodResolver(derive2026FormSchema),
    defaultValues: DERIVE_2026_DEFAULTS,
  });

  useEffect(() => {
    if (derive2026) {
      const values = { ...DERIVE_2026_DEFAULTS } as Record<string, string>;
      for (const key of Object.keys(values)) {
        values[key] = (derive2026 as any)[key] || '';
      }
      form.reset(values);
      setVideoFiles({ 1: null, 2: null });
      setBgImageFile(null);
    }
  }, [derive2026, form]);

  async function onSubmit(values: FormValues) {
    setIsLoading(true);

    try {
      const updatedValues = { ...values };

      for (const n of VIDEOS) {
        const files = videoFiles[n];
        if (files && files.length > 0) {
          [updatedValues[`video${n}Thumbnail`]] = await uploadFilesOrThrow(
            startUpload,
            files,
          );
        }
      }

      if (bgImageFile && bgImageFile.length > 0) {
        [updatedValues.backgroundImage] = await uploadFilesOrThrow(
          startUpload,
          bgImageFile,
        );
      }

      if (containsBlobUrl(updatedValues)) {
        throw new Error('Image invalide, veuillez la téléverser à nouveau');
      }

      const result = await updateDerive2026({
        derive2026: {
          ...updatedValues,
          _id: derive2026?._id,
        },
      });

      if (result) {
        router.push('/darja-admin/derive-2026');
        router.refresh();
      }
    } catch (error) {
      console.error('Error updating derive2026:', error);
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
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        {TEXT_BLOCKS.map((n) => (
          <div key={n} className="border-t-2 pt-4">
            <h3 className="text-lg font-semibold mb-4">
              Textes de description ( bloc {n} )
            </h3>

            <div className="flex flex-col gap-5 mb-4">
              <FormField
                control={form.control}
                name={`text${n}Fr`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <label className="text-sm font-medium">
                      Texte en Français
                    </label>
                    <FormControl>
                      <TiptapEditor
                        content={field.value || ''}
                        onChange={field.onChange}
                        dir="ltr"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name={`text${n}Ar`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <label className="text-sm font-medium">
                      الترجمة (اختياري)
                    </label>
                    <FormControl>
                      <TiptapEditor
                        content={field.value || ''}
                        onChange={field.onChange}
                        dir="rtl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}

        <div className="border-t-2 pt-4">
          <h3 className="text-lg font-semibold mb-4">Image de fond</h3>
          <FormField
            control={form.control}
            name="backgroundImage"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <BgImageUploader
                    onFieldChange={field.onChange}
                    imageUrl={field.value || ''}
                    setFile={setBgImageFile}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="border-t-2 pt-4">
          <h3 className="text-lg font-semibold mb-1">Titre de la section vidéos</h3>
          <p className="text-sm text-gray-500 mb-4">
            Optionnel, affiché seulement si au moins une vidéo est publiée.
          </p>
          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="videosHeadingFr"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="Titre de la section (Français)"
                      className="input-field"
                      maxLength={80}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="videosHeadingAr"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="عنوان القسم (اختياري)"
                      className="input-field"
                      maxLength={80}
                      {...field}
                      dir="rtl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {VIDEOS.map((n) => (
          <div key={n} className="border-t-2 pt-4">
            <h3 className="text-lg font-semibold mb-4">Video {n}</h3>

            <div className="flex flex-col gap-5 md:flex-row">
              <FormField
                control={form.control}
                name={`video${n}TitleFr`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder={`Titre vidéo ${n} (Français)`}
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
                name={`video${n}TitleAr`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder={
                          n === 1
                            ? 'العنوان الأول (اختياري)'
                            : 'العنوان الثاني (اختياري)'
                        }
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

            <div className="flex flex-col gap-5 md:flex-row mt-4">
              <FormField
                control={form.control}
                name={`video${n}IframeLink`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder={`Lien iframe vidéo ${n} (embed link)`}
                        className="input-field"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-4">
              <FormField
                control={form.control}
                name={`video${n}Thumbnail`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl className="h-72">
                      <VideoFileUploader
                        onFieldChange={field.onChange}
                        imageUrl={field.value || ''}
                        setFile={(files) =>
                          setVideoFiles((prev) => ({
                            ...prev,
                            [n]:
                              typeof files === 'function'
                                ? files(prev[n])
                                : files,
                          }))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}

        <SubmitButton isLoading={isLoading}>
          Modifier la page derive 2026
        </SubmitButton>
      </form>
    </Form>
  );
};

export default Derive2026Form;
