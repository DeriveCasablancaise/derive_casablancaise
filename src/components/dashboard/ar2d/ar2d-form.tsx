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
import { VideoFileUploader } from './VideoFileUploader';
import { ar2dFormSchema, derive2024FormSchema } from '@/lib/validator';
import { BgImageUploader } from './BgImageUploader';
import { IAr2d } from '@/lib/database/models/ar2d.model';
import { updateAr2d } from '@/lib/actions/ar2d.actions';
import { FileUploader } from '../FileUploader';

type Ar2dFormProps = {
  ar2d?: IAr2d;
};

const Ar2dForm = ({ ar2d }: Ar2dFormProps) => {
  const [video1File, setVideo1File] = useState<File[] | null>(null);
  const [video2File, setVideo2File] = useState<File[] | null>(null);
  const [video3File, setVideo3File] = useState<File[] | null>(null);
  const [bgImageFile, setBgImageFile] = useState<File[] | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = ar2d || {
    text1Fr: '',
    text1Ar: '',
    text2Fr: '',
    text2Ar: '',
    text3Fr: '',
    text3Ar: '',
    backgroundImage: '',
    carouselImages: [],
    video1Thumbnail: '',
    video1IframeLink: '',
    video1TitleFr: '',
    video1TitleAr: '',
    video2Thumbnail: '',
    video2IframeLink: '',
    video2TitleFr: '',
    video2TitleAr: '',
    video3Thumbnail: '',
    video3IframeLink: '',
    video3TitleFr: '',
    video3TitleAr: '',
  };

  const router = useRouter();
  const { startUpload } = useUploadThing('imageUploader');

  const form = useForm<z.infer<typeof ar2dFormSchema>>({
    resolver: zodResolver(ar2dFormSchema),
    defaultValues: initialValues as z.infer<typeof ar2dFormSchema>,
  });

  useEffect(() => {
    if (ar2d) {
      form.reset({
        text1Fr: ar2d.text1Fr || '',
        text1Ar: ar2d.text1Ar || '',
        text2Fr: ar2d.text2Fr || '',
        text2Ar: ar2d.text2Ar || '',
        text3Fr: ar2d.text3Fr || '',
        text3Ar: ar2d.text3Ar || '',
        backgroundImage: ar2d.backgroundImage || '',
        carouselImages: ar2d.carouselImages || [],
        video1Thumbnail: ar2d.video1Thumbnail || '',
        video1IframeLink: ar2d.video1IframeLink || '',
        video1TitleFr: ar2d.video1TitleFr || '',
        video1TitleAr: ar2d.video1TitleAr || '',
        video2Thumbnail: ar2d.video2Thumbnail || '',
        video2IframeLink: ar2d.video2IframeLink || '',
        video2TitleFr: ar2d.video2TitleFr || '',
        video2TitleAr: ar2d.video2TitleAr || '',
        video3Thumbnail: ar2d.video3Thumbnail || '',
        video3IframeLink: ar2d.video3IframeLink || '',
        video3TitleFr: ar2d.video3TitleFr || '',
        video3TitleAr: ar2d.video3TitleAr || '',
      });
      setVideo1File(null);
      setVideo2File(null);
      setVideo3File(null);
      setBgImageFile(null);
      setFiles([]);
    }
  }, [ar2d, form]);

  async function onSubmit(values: z.infer<typeof ar2dFormSchema>) {
    setIsLoading(true);

    try {
      const updatedValues = { ...values };

      if (files.length > 0) {
        updatedValues.carouselImages = await uploadFilesOrThrow(
          startUpload,
          files,
        );
      }

      if (video1File && video1File.length > 0) {
        [updatedValues.video1Thumbnail] = await uploadFilesOrThrow(
          startUpload,
          video1File,
        );
      }

      if (video2File && video2File.length > 0) {
        [updatedValues.video2Thumbnail] = await uploadFilesOrThrow(
          startUpload,
          video2File,
        );
      }

      if (video3File && video3File.length > 0) {
        [updatedValues.video3Thumbnail] = await uploadFilesOrThrow(
          startUpload,
          video3File,
        );
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

      const result = await updateAr2d({
        ar2d: {
          ...updatedValues,
          _id: ar2d?._id,
        },
      });

      if (result) {
        router.push('/darja-admin/ar2d');
      }
    } catch (error) {
      console.error('Error updating ar2d:', error);
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
        {/* Hero Subtitles Section */}
        <div className="border-t-2 pt-4">
          <h3 className="text-lg font-semibold mb-4">
            Textes de description ( bloc 1 )
          </h3>

          <div className="flex flex-col gap-5 mb-4">
            <FormField
              control={form.control}
              name="text1Fr"
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
              name="text1Ar"
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

        <div className="border-t-2 pt-4">
          <h3 className="text-lg font-semibold mb-4">
            Textes de description ( bloc 2 )
          </h3>

          <div className="flex flex-col gap-5 mb-4">
            <FormField
              control={form.control}
              name="text2Fr"
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
              name="text2Ar"
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

        <div className="border-t-2 pt-4">
          <h3 className="text-lg font-semibold mb-4">
            Textes de description ( bloc 3 )
          </h3>

          <div className="flex flex-col gap-5 mb-4">
            <FormField
              control={form.control}
              name="text3Fr"
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
              name="text3Ar"
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
          <h3 className="text-lg font-semibold mb-4">Images de gallerie</h3>
          <FormField
            control={form.control}
            name="carouselImages"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <FileUploader
                    onFieldChange={field.onChange}
                    imageUrls={field.value || []}
                    setFiles={setFiles}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Video 1 Section */}
        <div className="border-t-2 pt-4">
          <h3 className="text-lg font-semibold mb-4">Video 1</h3>

          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="video1TitleFr"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="Titre vidéo 1 (Français)"
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
              name="video1TitleAr"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="العنوان الأول (اختياري)"
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
              name="video1IframeLink"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="Lien iframe vidéo 1 (embed link)"
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
              name="video1Thumbnail"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl className="h-72">
                    <VideoFileUploader
                      onFieldChange={field.onChange}
                      imageUrl={field.value || ''}
                      setFile={setVideo1File}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Video 2 Section */}
        <div className="border-t-2 pt-4">
          <h3 className="text-lg font-semibold mb-4">Video 2</h3>

          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="video2TitleFr"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="Titre vidéo 2 (Français)"
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
              name="video2TitleAr"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="العنوان الثاني (اختياري)"
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
              name="video2IframeLink"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="Lien iframe vidéo 2 (embed link)"
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
              name="video2Thumbnail"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl className="h-72">
                    <VideoFileUploader
                      onFieldChange={field.onChange}
                      imageUrl={field.value || ''}
                      setFile={setVideo2File}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="border-t-2 pt-4">
          <h3 className="text-lg font-semibold mb-4">Video 3</h3>

          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="video3TitleFr"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="Titre vidéo 3 (Français)"
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
              name="video3TitleAr"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="العنوان الثالث (اختياري)"
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
              name="video3IframeLink"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="Lien iframe vidéo 3 (embed link)"
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
              name="video3Thumbnail"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl className="h-72">
                    <VideoFileUploader
                      onFieldChange={field.onChange}
                      imageUrl={field.value || ''}
                      setFile={setVideo3File}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <SubmitButton isLoading={isLoading}>Modifier la page AR2D</SubmitButton>
      </form>
    </Form>
  );
};

export default Ar2dForm;
