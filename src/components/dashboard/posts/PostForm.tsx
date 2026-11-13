'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
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
import { useEffect, useRef, useState } from 'react';
import { postDefaultValues } from '@/constants';
import { useRouter } from 'next/navigation';
import { useUploadThing } from '@/lib/uploadthing';
import { toast } from '@/components/hooks/use-toast';
import { containsBlobUrl, uploadFilesOrThrow } from '@/lib/upload-helpers';
import { MAX_SESSIONS, postFormSchema } from '@/lib/validator';
import { fromFloatingUTC, toFloatingUTC } from '@/lib/post-sessions';
import { createPost, updatePost } from '@/lib/actions/post.actions';
import { FileUploader } from '../FileUploader';
import FormActions from '../FormActions';
import {
  AdminButton,
  FieldHelp,
  FieldLabel,
  notifyInvalid,
} from '../admin-ui';
import TiptapEditor from '../TiptapEditor';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fr } from 'date-fns/locale';
import { CalendarDays } from 'lucide-react';
import Dropdown from './DropDown';
import { IArtist } from '@/lib/database/models/artist.model';
import ArtistMultiSelect from './ArtistMultiSelect';
import { getAllArtists } from '@/lib/actions/artists.actions';
import { getArtistEditions } from '@/lib/artist-editions';
import SubCategoryDropdown from './SubcategoryDropdown';
import { ThumbnailUploader } from './ThumbnailUploader';
import EditionDropdown from './EditionDropdown';
import {
  creditFor,
  keepCredits,
  remapCredits,
  setCredit,
} from '@/lib/photo-credits';
import {
  isEditionCategory,
  isEditionYear,
  resolveCategory,
} from '@/constants/editions';

type PostFormProps = {
  type: 'Create' | 'Update';
  post?: IPost;
  postId?: string;
};

// id comes from FormControl, so the label above focuses the input
const DateTimeInput = ({
  id,
  value,
  onChange,
  clearable = false,
}: {
  id?: string;
  value?: Date | null;
  onChange: (date: Date | null) => void;
  // end dates may be emptied
  clearable?: boolean;
}) => (
  <div className="input-field flex items-center gap-3">
    <CalendarDays className="h-5 w-5 shrink-0" aria-hidden="true" />
    <DatePicker
      id={id}
      locale={fr}
      selected={value ?? null}
      onChange={onChange}
      showTimeSelect
      timeCaption="Heure"
      timeInputLabel="Heure :"
      dateFormat="dd/MM/yyyy h:mm aa"
      wrapperClassName="datePicker"
      isClearable={clearable}
    />
  </div>
);

const PostForm = ({ type, post, postId }: PostFormProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [artists, setArtists] = useState<IArtist[]>([]);

  const initialValues =
    post && type === 'Update'
      ? {
          ...post,
          // an old 2026 key (concert, lectures) is offered as its new category
          postCategory: isEditionYear(post.yearOfEdition)
            ? resolveCategory(post.yearOfEdition, post.postCategory)
            : post.postCategory,
          startDateTime: fromFloatingUTC(post.startDateTime),
          endDateTime: fromFloatingUTC(post.endDateTime),
          sessions: (post.sessions ?? []).map((session) => ({
            start: fromFloatingUTC(session.start),
            end: fromFloatingUTC(session.end),
            venueFr: session.venueFr ?? '',
            venueAr: session.venueAr ?? '',
          })),
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

  const sessionFields = useFieldArray({
    control: form.control,
    name: 'sessions',
  });
  const hasSessionList = sessionFields.fields.length > 0;

  // a new session starts from the previous one, or from the single dates
  const addSession = () => {
    const sessions = form.getValues('sessions') ?? [];
    const last = sessions[sessions.length - 1];
    sessionFields.append({
      start: last?.start ?? form.getValues('startDateTime') ?? new Date(),
      end: last ? undefined : form.getValues('endDateTime'),
      venueFr: '',
      venueAr: '',
    });
  };

  // picker follows the post's edition, but selected artists stay visible
  const watchedEdition = form.watch('yearOfEdition');
  const selectedArtistIds = form.watch('artists') ?? [];
  const pickerArtists = artists.filter(
    (artist) =>
      selectedArtistIds.includes(artist._id) ||
      getArtistEditions(artist).includes(watchedEdition)
  );

  // a second click before the button greys out, or after a save while the
  // page changes, must not save again
  const savingRef = useRef(false);

  async function onSubmit(values: z.infer<typeof postFormSchema>) {
    if (savingRef.current) return;
    savingRef.current = true;
    setIsLoading(true);

    try {
      let uploadedImageUrls = values.images;

      let uploadedThumbnailUrl = values.thumbnailImage;

      // new files are in the same order as their previews, so I swap them in place
      if (files.length > 0) {
        const newImageUrls = await uploadFilesOrThrow(startUpload, files);
        uploadedImageUrls = values.images.map((url) =>
          url.startsWith('blob:') ? newImageUrls.shift() ?? url : url,
        );
      }

      if (thumbnailFile) {
        [uploadedThumbnailUrl] = await uploadFilesOrThrow(startUpload, [
          thumbnailFile,
        ]);
      }

      if (uploadedThumbnailUrl?.startsWith('blob:')) {
        throw new Error('Image invalide, veuillez la téléverser à nouveau');
      }

      // credits typed on a preview follow it to its uploaded URL
      const imageCredits = keepCredits(
        remapCredits(
          values.imageCredits,
          [...values.images, values.thumbnailImage],
          [...uploadedImageUrls, uploadedThumbnailUrl],
        ),
        [...uploadedImageUrls, uploadedThumbnailUrl],
      );

      const finalStart = toFloatingUTC(values.startDateTime);
      const finalEnd = toFloatingUTC(values.endDateTime ?? undefined);

      const payload = {
        ...values,
        startDateTime: finalStart,
        endDateTime: finalEnd,
        sessions: values.sessions?.map((session) => ({
          ...session,
          start: toFloatingUTC(session.start)!,
          end: toFloatingUTC(session.end ?? undefined),
        })),
        images: uploadedImageUrls,
        thumbnailImage: uploadedThumbnailUrl,
        imageCredits,
      };

      if (containsBlobUrl(payload)) {
        throw new Error('Image invalide, veuillez la téléverser à nouveau');
      }

      if (type === 'Create') {
        const newPost = await createPost(payload);

        if (!newPost) savingRef.current = false;
        if (newPost) {
          form.reset();
          toast({ title: 'Poste créé' });
          router.push(`/darja-admin/posts`);
        }
      }

      if (type === 'Update') {
        if (!postId) {
          savingRef.current = false;
          router.back();
          return;
        }

        const updatedPost = await updatePost({
          post: { ...payload, _id: postId },
        });

        if (!updatedPost) savingRef.current = false;
        if (updatedPost) {
          form.reset();
          toast({ title: 'Poste modifié' });
          router.push(`/darja-admin/posts`);
        }
      }
    } catch (error) {
      savingRef.current = false;
      console.error('Error saving the post', error);
      toast({
        variant: 'destructive',
        title: "L'enregistrement a échoué",
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      // after a save the button stays disabled until the list opens
      if (!savingRef.current) setIsLoading(false);
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
              name="frenchTitle"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FieldLabel required>Titre (français)</FieldLabel>
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
                  <FieldLabel>Titre (arabe)</FieldLabel>
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
              name="yearOfEdition"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FieldLabel required>Édition</FieldLabel>
                  <FormControl>
                    <EditionDropdown
                      value={field.value}
                      onChangeHandler={(value) => {
                        field.onChange(value);
                        // the chosen category may not exist in the new edition
                        const current = form.getValues('postCategory');
                        if (
                          current &&
                          isEditionYear(value) &&
                          !isEditionCategory(value, current)
                        ) {
                          form.setValue('postCategory', '' as typeof current);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postCategory"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FieldLabel required>Catégorie</FieldLabel>
                  <FormControl>
                    <Dropdown
                      edition={watchedEdition}
                      value={field.value}
                      onChangeHandler={(value) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {form.watch('postCategory') === 'autres' && (
            <FormField
              control={form.control}
              name="subCategory"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FieldLabel>Sous-catégorie</FieldLabel>
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
                <FieldLabel>Artistes</FieldLabel>
                <FormControl>
                  <ArtistMultiSelect
                    value={field.value}
                    onChangeHandler={field.onChange}
                    artists={pickerArtists}
                  />
                </FormControl>
                <FieldHelp>
                  La liste suit l&apos;édition choisie. Les artistes déjà
                  sélectionnés restent affichés.
                </FieldHelp>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="admin-section">
          <h2 className="admin-section-title">Dates et séances</h2>
          {!hasSessionList && (
            <div className="flex flex-col gap-5 md:flex-row">
              <FormField
                control={form.control}
                name="startDateTime"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FieldLabel>Date de début</FieldLabel>
                    <FormControl>
                      <DateTimeInput
                        value={field.value}
                        onChange={(date) => field.onChange(date ?? undefined)}
                      />
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
                    <FieldLabel>Date de fin</FieldLabel>
                    <FormControl>
                      <DateTimeInput
                        value={field.value}
                        onChange={(date) => field.onChange(date ?? undefined)}
                        clearable
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex-1">
              <h3 className="font-semibold">Séances</h3>
              <p className="admin-help">
                {hasSessionList
                  ? 'Les séances remplacent les dates du poste. Un lieu vide reprend le lieu du poste.'
                  : 'Pour un spectacle joué plusieurs fois, ajoutez une séance par représentation.'}
              </p>
            </div>
            <AdminButton
              type="button"
              variant="secondary"
              onClick={addSession}
              disabled={sessionFields.fields.length >= MAX_SESSIONS}
            >
              Ajouter une séance
            </AdminButton>
          </div>

          {sessionFields.fields.map((item, index) => (
            <div key={item.id} className="admin-subcard">
              <p className="text-sm font-semibold">Séance {index + 1}</p>
              <div className="flex flex-col gap-3 md:flex-row">
                <FormField
                  control={form.control}
                  name={`sessions.${index}.start`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FieldLabel required>Début</FieldLabel>
                      <FormControl>
                        <DateTimeInput
                          value={field.value}
                          onChange={(date) => field.onChange(date ?? undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`sessions.${index}.end`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FieldLabel>Fin</FieldLabel>
                      <FormControl>
                        <DateTimeInput
                          value={field.value}
                          onChange={(date) => field.onChange(date ?? undefined)}
                          clearable
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-3 md:flex-row">
                <FormField
                  control={form.control}
                  name={`sessions.${index}.venueFr`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FieldLabel>Lieu de la séance (français)</FieldLabel>
                      <FormControl>
                        <Input
                          placeholder="Facultatif"
                          className="input-field"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`sessions.${index}.venueAr`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FieldLabel>Lieu de la séance (arabe)</FieldLabel>
                      <FormControl>
                        <Input
                          placeholder="مكان العرض (اختياري)"
                          className="input-field"
                          {...field}
                          value={field.value ?? ''}
                          dir="rtl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <AdminButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={index === 0}
                  onClick={() => sessionFields.move(index, index - 1)}
                >
                  Monter
                </AdminButton>
                <AdminButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={index === sessionFields.fields.length - 1}
                  onClick={() => sessionFields.move(index, index + 1)}
                >
                  Descendre
                </AdminButton>
                <AdminButton
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => sessionFields.remove(index)}
                >
                  Supprimer
                </AdminButton>
              </div>
            </div>
          ))}
          <FormField
            control={form.control}
            name="sessions"
            render={() => (
              <FormItem>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="admin-section">
          <h2 className="admin-section-title">Lieu</h2>
          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FieldLabel required>Lieu (français)</FieldLabel>
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
            <FormField
              control={form.control}
              name="locationAr"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FieldLabel>Lieu (arabe)</FieldLabel>
                  <FormControl>
                    <Input
                      placeholder="مكان الحدث باللغة العربية"
                      className="input-field"
                      {...field}
                      value={field.value ?? ''}
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
          <h2 className="admin-section-title">Textes</h2>
          <div className="flex flex-col gap-5 lg:flex-row">
            <FormField
              control={form.control}
              name="frenchText"
              render={({ field }) => (
                <FormItem className="w-full lg:w-1/2">
                  <FieldLabel required>Texte (français)</FieldLabel>
                  <FormControl>
                    <TiptapEditor
                      content={field.value}
                      onChange={field.onChange}
                      dir="ltr"
                      label="Texte (français)"
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
                <FormItem className="w-full lg:w-1/2">
                  <FieldLabel>Texte (arabe)</FieldLabel>
                  <FormControl>
                    <TiptapEditor
                      content={field.value}
                      onChange={field.onChange}
                      dir="rtl"
                      label="Texte (arabe)"
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

            <FormField
              control={form.control}
              name="videoSource"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FieldLabel>Source audio</FieldLabel>
                  <FormControl>
                    <Input
                      placeholder="Lien de l'audio"
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
                <FieldLabel>Images du poste</FieldLabel>
                <FormControl>
                  <FileUploader
                    onFieldChange={field.onChange}
                    imageUrls={field.value}
                    setFiles={setFiles}
                    reorderable
                    credits={form.watch('imageCredits')}
                    onCreditsChange={(credits) =>
                      form.setValue('imageCredits', credits, {
                        shouldDirty: true,
                      })
                    }
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
                <FieldLabel>Miniature</FieldLabel>
                <FormControl>
                  <ThumbnailUploader
                    imageUrl={field.value || ''}
                    onFieldChange={field.onChange}
                    setFile={setThumbnailFile}
                    credit={creditFor(form.watch('imageCredits'), field.value)}
                    onCreditChange={(credit) =>
                      field.value &&
                      form.setValue(
                        'imageCredits',
                        setCredit(
                          form.getValues('imageCredits'),
                          field.value,
                          credit,
                        ),
                        { shouldDirty: true },
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormActions
          isLoading={isLoading}
          submitLabel={type === 'Create' ? 'Créer le poste' : 'Modifier le poste'}
          cancelHref="/darja-admin/posts"
        />
      </form>
    </Form>
  );
};

export default PostForm;
