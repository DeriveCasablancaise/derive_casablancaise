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
import { IHomepage } from '@/lib/database/models/homepage.model';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUploadThing } from '@/lib/uploadthing';
import { updateHomepage } from '@/lib/actions/homepage.actions';
import { handleError } from '@/lib/utils';
import SubmitButton from '../SubmitButton';
import TiptapEditor from '../TiptapEditor';
import { VideoFileUploader } from './VideoFileUploader';
import { homepageFormSchema } from '@/lib/validator';
import { BgImageUploader } from './BgImageUploader';

type HomepageFormProps = {
  homepage?: IHomepage;
};

const HomepageForm = ({ homepage }: HomepageFormProps) => {
  const [video1File, setVideo1File] = useState<File[] | null>(null);
  const [video2File, setVideo2File] = useState<File[] | null>(null);
  const [bgImageFile, setBgImageFile] = useState<File[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = homepage || {
    textFr: '',
    textAr: '',
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

  const form = useForm<z.infer<typeof homepageFormSchema>>({
    resolver: zodResolver(homepageFormSchema),
    defaultValues: initialValues as z.infer<typeof homepageFormSchema>,
  });

  useEffect(() => {
    if (homepage) {
      form.reset({
        textFr: homepage.textFr || '',
        textAr: homepage.textAr || '',
        backgroundImage: homepage.backgroundImage || '',
        video1Thumbnail: homepage.video1Thumbnail || '',
        video1IframeLink: homepage.video1IframeLink || '',
        video1TitleFr: homepage.video1TitleFr || '',
        video1TitleAr: homepage.video1TitleAr || '',
        video2Thumbnail: homepage.video2Thumbnail || '',
        video2IframeLink: homepage.video2IframeLink || '',
        video2TitleFr: homepage.video2TitleFr || '',
        video2TitleAr: homepage.video2TitleAr || '',
      });
      setVideo1File(null);
      setVideo2File(null);
      setBgImageFile(null);
    }
  }, [homepage, form]);

  async function onSubmit(values: z.infer<typeof homepageFormSchema>) {
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
      const result = await updateHomepage({
        homepage: {
          ...updatedValues,
          _id: homepage?._id,
        },
      });

      if (result) {
        router.push('/darja-admin/homepage');
      }
    } catch (error) {
      console.error('Error updating homepage:', error);
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
          <h3 className="text-lg font-semibold mb-4">Textes de description</h3>

          <div className="flex flex-col gap-5 mb-4">
            <FormField
              control={form.control}
              name="textFr"
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
              name="textAr"
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
          Modifier la page d'accueil
        </SubmitButton>
      </form>
    </Form>
  );
};

export default HomepageForm;
