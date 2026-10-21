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
import SubmitButton from '../SubmitButton';
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
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        {/* French and Arabic Names */}
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="frenchName"
            render={({ field }) => (
              <FormItem className="w-full">
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

        {/* Partner Link and Year */}
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="hrefLink"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Lien du partenaire (URL)"
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

        {/* Logo Uploader */}
        <FormField
          control={form.control}
          name="logoImage"
          render={({ field }) => (
            <FormItem className="w-full">
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

        {/* Submit Button */}
        <SubmitButton isLoading={isLoading}>
          {type === 'Create' ? 'Créer Le Partenaire' : 'Modifier Le Partenaire'}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default PartnerForm;
