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
import type * as z from 'zod';
import type { IPartner } from '@/lib/database/models/partner.model';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUploadThing } from '@/lib/uploadthing';
import { toast } from '@/components/hooks/use-toast';
import { containsBlobUrl, uploadFilesOrThrow } from '@/lib/upload-helpers';
import { partnerFormSchema } from '@/lib/validator';
import { createPartner, updatePartner } from '@/lib/actions/partner.actions';
import FormActions from '../FormActions';
import { FieldHelp, FieldLabel, notifyInvalid } from '../admin-ui';
import { PartnerLogoUploader } from './PartnerLogoUploader';
import { Checkbox } from '@/components/ui/checkbox';
import { EDITION_YEARS } from '@/constants/editions';
import { getPartnerEditions } from '@/lib/partner-editions';
import { partnerDefaultValues } from '@/constants';

type PartnerFormProps = {
  type: 'Create' | 'Update';
  partner?: IPartner;
  partnerId?: string;
};

const PartnerForm = ({ type, partner, partnerId }: PartnerFormProps) => {
  const [file, setFile] = useState<File[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues =
    partner && type === 'Update'
      ? {
          frenchName: partner.frenchName,
          arabicName: partner.arabicName || '',
          hrefLink: partner.hrefLink || '',
          // an unmigrated partner still has to show its old edition ticked
          editions: getPartnerEditions(partner),
          logoImage: partner.logoImage,
          invertLogo: partner.invertLogo ?? false,
        }
      : partnerDefaultValues;

  const router = useRouter();
  const { startUpload } = useUploadThing('imageUploader');

  const form = useForm<z.infer<typeof partnerFormSchema>>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: initialValues as z.infer<typeof partnerFormSchema>,
  });

  async function onSubmit(values: z.infer<typeof partnerFormSchema>) {
    setIsLoading(true);

    try {
      let uploadedLogoUrl = values.logoImage;

      // Upload logo if a new file is provided
      if (file && file.length > 0) {
        [uploadedLogoUrl] = await uploadFilesOrThrow(startUpload, file);
      }

      if (containsBlobUrl(uploadedLogoUrl)) {
        throw new Error('Image invalide, veuillez la téléverser à nouveau');
      }

      if (type === 'Create') {
        const newPartner = await createPartner({
          ...values,
          logoImage: uploadedLogoUrl,
        });

        if (newPartner) {
          form.reset();
          toast({ title: 'Partenaire créé' });
          router.push(`/darja-admin/partners`);
        }
      }

      if (type === 'Update') {
        if (!partnerId) {
          router.back();
          return;
        }

        const updatedPartner = await updatePartner({
          partner: {
            ...values,
            logoImage: uploadedLogoUrl,
            _id: partnerId,
          },
        });

        if (updatedPartner) {
          form.reset();
          toast({ title: 'Partenaire modifié' });
          router.push(`/darja-admin/partners`);
        }
      }
    } catch (error) {
      console.error('Error saving the partner', error);
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
                      placeholder="Nom du partenaire en français"
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
                  <FieldLabel>Nom (arabe)</FieldLabel>
                  <FormControl>
                    <Input
                      placeholder="اسم الشريك باللغة العربية"
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
              name="hrefLink"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FieldLabel>Lien du partenaire</FieldLabel>
                  <FormControl>
                    <Input
                      placeholder="https://..."
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
          </div>
        </div>

        <div className="admin-section">
          <h2 className="admin-section-title">Images</h2>
          <FormField
            control={form.control}
            name="logoImage"
            render={({ field }) => (
              <FormItem className="w-full">
                <FieldLabel required>Logo</FieldLabel>
                <FormControl>
                  <PartnerLogoUploader
                    onFieldChange={field.onChange}
                    imageUrl={field.value}
                    setFile={setFile}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="invertLogo"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="flex items-center gap-2 py-2">
                  <Checkbox
                    id="invert-logo"
                    checked={field.value ?? false}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                  <label htmlFor="invert-logo" className="checkbox-label">
                    Logo clair (inverser)
                  </label>
                </div>
                <FieldHelp>
                  À cocher pour un logo clair, peu lisible sur un fond clair.
                </FieldHelp>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormActions
          isLoading={isLoading}
          submitLabel={
            type === 'Create' ? 'Créer le partenaire' : 'Modifier le partenaire'
          }
          cancelHref="/darja-admin/partners"
        />
      </form>
    </Form>
  );
};

export default PartnerForm;
