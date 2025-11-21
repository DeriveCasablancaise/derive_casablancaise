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
import { partnerFormSchema } from '@/lib/validator';
import { createPartner, updatePartner } from '@/lib/actions/partner.actions';
import { handleError } from '@/lib/utils';
import SubmitButton from '../SubmitButton';
import { PartnerLogoUploader } from './PartnerLogoUploader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { partnerDefaultValues, partnerYearOptions } from '@/constants';

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
          yearOfPartnership: String(partner.yearOfPartnership),
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

    let uploadedLogoUrl = values.logoImage;

    // Upload logo if a new file is provided
    if (file && file.length > 0) {
      const uploadedImages = await startUpload(file);

      if (!uploadedImages) {
        setIsLoading(false);
        return;
      }

      uploadedLogoUrl = uploadedImages[0].url;
    }

    if (type === 'Create') {
      try {
        const newPartner = await createPartner({
          ...values,
          yearOfPartnership: values.yearOfPartnership as '2022' | '2024',
          logoImage: uploadedLogoUrl,
        });

        if (newPartner) {
          form.reset();
          router.push(`/darja-admin/partners`);
        }
      } catch (error) {
        console.error('Error creating a new partner:', error);
        handleError(error);
      }
    }

    if (type === 'Update' && partnerId) {
      if (!partnerId) {
        router.back();
        return;
      }

      try {
        const updatedPartner = await updatePartner({
          partner: {
            ...values,
            yearOfPartnership: values.yearOfPartnership as '2022' | '2024',
            logoImage: uploadedLogoUrl,
            _id: partnerId,
          },
        });

        if (updatedPartner) {
          form.reset();
          router.push(`/darja-admin/partners`);
        }
      } catch (error) {
        console.error('Error updating the partner', error);
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
            name="yearOfPartnership"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="input-field">
                      <SelectValue placeholder="Sélectionner l'année" />
                    </SelectTrigger>
                    <SelectContent>
                      {partnerYearOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
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
