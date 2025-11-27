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
import { handleError } from '@/lib/utils';
import SubmitButton from '../SubmitButton';
import TiptapEditor from '../TiptapEditor';
import { VideoFileUploader } from './VideoFileUploader';
import { derive2024FormSchema } from '@/lib/validator';
import { BgImageUploader } from './BgImageUploader';
import { IDerive2024 } from '@/lib/database/models/derive2024.model';
import { updateDerive2024 } from '@/lib/actions/derive2024.actions';

type Derive2024FormProps = {
  derive2024?: IDerive2024;
};

const Derive2024Form = ({ derive2024 }: Derive2024FormProps) => {
  const [video1File, setVideo1File] = useState<File[] | null>(null);
  const [video2File, setVideo2File] = useState<File[] | null>(null);
  const [bgImageFile, setBgImageFile] = useState<File[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = derive2024 || {
    text1Fr: '',
    text1Ar: '',
    text2Fr: '',
    text2Ar: '',
    text3Fr: '',
    text3Ar: '',
    backgroundImage: '',
    video1Thumbnail: '',
    video1IframeLink: '',
    video1TitleFr: '',
    video1TitleAr: '',
    video2Thumbnail: '',
    video2IframeLink: '',
    video2TitleFr: '',
    video2TitleAr: '',
  };

  const router = useRouter();
  const { startUpload } = useUploadThing('imageUploader');

  const form = useForm<z.infer<typeof derive2024FormSchema>>({
    resolver: zodResolver(derive2024FormSchema),
    defaultValues: initialValues as z.infer<typeof derive2024FormSchema>,
  });

  useEffect(() => {
    if (derive2024) {
      form.reset({
        text1Fr: derive2024.text1Fr || '',
        text1Ar: derive2024.text1Ar || '',
        text2Fr: derive2024.text2Fr || '',
        text2Ar: derive2024.text2Ar || '',
        text3Fr: derive2024.text3Fr || '',
        text3Ar: derive2024.text3Ar || '',
        backgroundImage: derive2024.backgroundImage || '',
        video1Thumbnail: derive2024.video1Thumbnail || '',
        video1IframeLink: derive2024.video1IframeLink || '',
        video1TitleFr: derive2024.video1TitleFr || '',
        video1TitleAr: derive2024.video1TitleAr || '',
        video2Thumbnail: derive2024.video2Thumbnail || '',
        video2IframeLink: derive2024.video2IframeLink || '',
        video2TitleFr: derive2024.video2TitleFr || '',
        video2TitleAr: derive2024.video2TitleAr || '',
      });
      setVideo1File(null);
      setVideo2File(null);
      setBgImageFile(null);
    }
  }, [derive2024, form]);

  async function onSubmit(values: z.infer<typeof derive2024FormSchema>) {
    setIsLoading(true);

    let updatedValues = { ...values };

    if (video1File && video1File.length > 0) {
      const uploadedImage = await startUpload(video1File);
      if (uploadedImage) {
        updatedValues.video1Thumbnail = uploadedImage[0].url;
      }
    } else if (!updatedValues.video1Thumbnail) {
      updatedValues.video1Thumbnail = '';
    }

    if (video2File && video2File.length > 0) {
      const uploadedImage = await startUpload(video2File);
      if (uploadedImage) {
        updatedValues.video2Thumbnail = uploadedImage[0].url;
      }
    } else if (!updatedValues.video2Thumbnail) {
      updatedValues.video2Thumbnail = '';
    }

    if (bgImageFile && bgImageFile.length > 0) {
      const uploadedImage = await startUpload(bgImageFile);
      if (uploadedImage) {
        updatedValues.backgroundImage = uploadedImage[0].url;
      }
    } else if (!updatedValues.backgroundImage) {
      updatedValues.backgroundImage = '';
    }

    try {
      const result = await updateDerive2024({
        derive2024: {
          ...updatedValues,
          _id: derive2024?._id,
        },
      });

      if (result) {
        router.push('/darja-admin/derive-2024');
      }
    } catch (error) {
      console.error('Error updating derive2024:', error);
      handleError(error);
    }

    setIsLoading(false);
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

        <SubmitButton isLoading={isLoading}>
          Modifier la page derive 2024
        </SubmitButton>
      </form>
    </Form>
  );
};

export default Derive2024Form;
