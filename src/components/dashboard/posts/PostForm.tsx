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
import { IPost } from '@/lib/database/models/post.model';
import { useEffect, useState } from 'react';
import { postDefaultValues } from '@/constants';
import { useRouter } from 'next/navigation';
import { useUploadThing } from '@/lib/uploadthing';
import { postFormSchema } from '@/lib/validator';
import { createPost, updatePost } from '@/lib/actions/post.actions';
import { handleError } from '@/lib/utils';
import { FileUploader } from '../FileUploader';
import SubmitButton from '../SubmitButton';
import { Checkbox } from '@/components/ui/checkbox';
import TiptapEditor from '../TiptapEditor';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fr } from 'date-fns/locale';
import Image from 'next/image';
import Dropdown from './DropDown';
import { IArtist } from '@/lib/database/models/artist.model';
import ArtistMultiSelect from './ArtistMultiSelect';
import { getAllArtists } from '@/lib/actions/artists.actions';
import SubCategoryDropdown from './SubcategoryDropdown';
import { ThumbnailUploader } from './ThumbnailUploader';

type PostFormProps = {
  type: 'Create' | 'Update';
  post?: IPost;
  postId?: string;
};

const PostForm = ({ type, post, postId }: PostFormProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [artists, setArtists] = useState<IArtist[]>([]);

  const initialValues =
    post && type === 'Update'
      ? {
          ...post,
          startDateTime: new Date(post.startDateTime),
          endDateTime: new Date(post.endDateTime),
        }
      : postDefaultValues;
  const router = useRouter();

  const { startUpload } = useUploadThing('imageUploader');

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const artistsData = await getAllArtists();
        setArtists(artistsData || []);
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    };

    fetchArtists();
  }, []);

  const form = useForm<z.infer<typeof postFormSchema>>({
    resolver: zodResolver(postFormSchema),
    defaultValues: initialValues as z.infer<typeof postFormSchema>,
  });

  async function onSubmit(values: z.infer<typeof postFormSchema>) {
    setIsLoading(true);

    let uploadedImageUrls = values.images;
    let uploadedThumbnailUrl = values.thumbnailImage;

    if (files.length > 0) {
      const uploadedImages = await startUpload(files);

      if (!uploadedImages) {
        return;
      }

      uploadedImageUrls = uploadedImages.map((img) => img.url);
    }

    if (thumbnailFile) {
      const uploadedThumbnails = await startUpload([thumbnailFile]);
      if (!uploadedThumbnails) {
        return;
      }
      uploadedThumbnailUrl = uploadedThumbnails[0].url;
    }

    if (type === 'Create') {
      try {
        const newPost = await createPost({
          ...values,
          images: uploadedImageUrls,
          thumbnailImage: uploadedThumbnailUrl,
        });

        if (newPost) {
          console.log(newPost.images);
          form.reset();
          router.push(`/darja-admin/posts`);
        }
      } catch (error) {
        console.log('Error creating a new post:', error);
      }
    }

    if (type === 'Update' && postId) {
      if (!postId) {
        router.back();
        return;
      }

      try {
        const updatedPost = await updatePost({
          post: {
            ...values,
            images: uploadedImageUrls,
            thumbnailImage: uploadedThumbnailUrl,
            _id: postId,
          },
        });

        if (updatedPost) {
          form.reset();
          router.push(`/darja-admin/posts`);
        }
      } catch (error) {
        console.error('Error updating the post', error);
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
            name="frenchTitle"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Titre du poste en français"
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
            name="arabicTitle"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="العنوان  باللغة العربية"
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
            name="startDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="input-field flex justify-center items-center">
                    <Image
                      src="/assets/icons/calendar.svg"
                      alt="calendar"
                      width={24}
                      height={24}
                      className="filter-grey"
                    />
                    <p className="ml-3 whitespace-nowrap text-grey-600">
                      Date de début:
                    </p>
                    <DatePicker
                      locale={fr}
                      selected={field.value}
                      onChange={(date: Date | null) => field.onChange(date)}
                      showTimeSelect
                      timeInputLabel="Time:"
                      dateFormat="dd/MM/yyyy h:mm aa"
                      wrapperClassName="datePicker"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="input-field flex justify-center items-center">
                    <Image
                      src="/assets/icons/calendar.svg"
                      alt="calendar"
                      width={24}
                      height={24}
                      className="filter-grey"
                    />
                    <p className="ml-3 whitespace-nowrap text-grey-600">
                      Date de fin:
                    </p>
                    <DatePicker
                      locale={fr}
                      selected={field.value}
                      onChange={(date: Date | null) => field.onChange(date)}
                      showTimeSelect
                      timeInputLabel="Time:"
                      dateFormat="dd/MM/yyyy h:mm aa"
                      wrapperClassName="datePicker"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="postCategory"
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
            name="location"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Lieu de l'événement"
                    className="input-field"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Conditional subCategory field when postCategory is "autres" */}
        {form.watch('postCategory') === 'autres' && (
          <FormField
            control={form.control}
            name="subCategory"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <SubCategoryDropdown
                    value={field.value}
                    onChangeHandler={(value) => field.onChange(value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="artists"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <ArtistMultiSelect
                  value={field.value}
                  onChangeHandler={field.onChange}
                  artists={artists}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="frenchText"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <TiptapEditor
                    content={field.value}
                    onChange={field.onChange}
                    dir="ltr"
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
                  <TiptapEditor
                    content={field.value}
                    onChange={field.onChange}
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
            name="videoSource"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Source d'audio"
                    className="input-field"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
          name="thumbnailImage"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl className="h-72">
                <ThumbnailUploader
                  imageUrl={field.value || ''}
                  onFieldChange={field.onChange}
                  setFile={setThumbnailFile}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitButton isLoading={isLoading}>
          {type === 'Create' ? 'Créer Le Poste' : 'Modifier Le Poste'}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default PostForm;
