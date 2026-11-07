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
import { Checkbox } from '@/components/ui/checkbox';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/hooks/use-toast';
import FormActions from '../FormActions';
import { FieldHelp, FieldLabel, notifyInvalid } from '../admin-ui';
import BannerStrip from '@/components/shared/BannerStrip';
import { bannerFormSchema } from '@/lib/validator';
import { BANNER_DEFAULTS, getBannerView } from '@/lib/banner';
import { IBanner } from '@/lib/database/models/banner.model';
import { updateBanner } from '@/lib/actions/banner.actions';

type BannerFormProps = {
  banner?: IBanner;
};

type FormValues = z.infer<typeof bannerFormSchema>;

const BannerForm = ({ banner }: BannerFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: BANNER_DEFAULTS,
  });

  useEffect(() => {
    if (banner) {
      form.reset({
        isActive: banner.isActive === true,
        textFr: banner.textFr || '',
        textAr: banner.textAr || '',
        linkUrl: banner.linkUrl || '',
        linkLabelFr: banner.linkLabelFr || '',
        linkLabelAr: banner.linkLabelAr || '',
      });
    }
  }, [banner, form]);

  // the preview ignores the switch so I can check the wording while it is off
  const values = form.watch();
  const previewFr = getBannerView({ ...values, isActive: true }, 'fr');
  const previewAr = getBannerView({ ...values, isActive: true }, 'ar');

  async function onSubmit(values: FormValues) {
    setIsLoading(true);

    try {
      const result = await updateBanner({
        banner: { ...values, _id: banner?._id },
      });

      if (result) {
        toast({ title: 'Bannière enregistrée' });
        router.refresh();
      }
    } catch (error) {
      console.error('Error updating banner:', error);
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
          <h2 className="admin-section-title">Affichage</h2>
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Checkbox
                      id="isActive"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <label htmlFor="isActive" className="checkbox-label">
                      Afficher la bannière sur la page d&apos;accueil
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="admin-section">
          <h2 className="admin-section-title">Texte</h2>
          <p className="admin-help">
            Le texte défile sous le titre de la page d&apos;accueil (200
            caractères max).
          </p>
          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="textFr"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FieldLabel>Texte (français)</FieldLabel>
                  <FormControl>
                    <Input
                      placeholder="Texte en français"
                      className="input-field"
                      maxLength={200}
                      {...field}
                    />
                  </FormControl>
                  <FieldHelp>
                    Obligatoire quand la bannière est affichée.
                  </FieldHelp>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="textAr"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FieldLabel>Texte (arabe)</FieldLabel>
                  <FormControl>
                    <Input
                      placeholder="النص بالعربية (اختياري)"
                      className="input-field"
                      maxLength={200}
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

        <div className="admin-section">
          <h2 className="admin-section-title">Lien (optionnel)</h2>
          <FormField
            control={form.control}
            name="linkUrl"
            render={({ field }) => (
              <FormItem className="w-full">
                <FieldLabel>Adresse du lien</FieldLabel>
                <FormControl>
                  <Input
                    placeholder="https://... ou /fr/derive-2026"
                    className="input-field"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-5 md:flex-row mt-4">
            <FormField
              control={form.control}
              name="linkLabelFr"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FieldLabel>Texte du lien (français)</FieldLabel>
                  <FormControl>
                    <Input
                      placeholder="Texte du lien (français)"
                      className="input-field"
                      maxLength={60}
                      {...field}
                    />
                  </FormControl>
                  <FieldHelp>Obligatoire quand un lien est renseigné.</FieldHelp>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkLabelAr"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FieldLabel>Texte du lien (arabe)</FieldLabel>
                  <FormControl>
                    <Input
                      placeholder="نص الرابط (اختياري)"
                      className="input-field"
                      maxLength={60}
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

        <div className="admin-section">
          <h2 className="admin-section-title">Aperçu</h2>
          <div className="flex flex-col gap-4">
            {(
              [
                ['Français', previewFr],
                ['العربية', previewAr],
              ] as const
            ).map(([label, view]) => (
              <div key={label}>
                <p className="text-sm mb-1">{label}</p>
                {view ? (
                  <BannerStrip view={view} preview />
                ) : (
                  <p className="admin-help">Rien à afficher</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <FormActions
          isLoading={isLoading}
          submitLabel="Enregistrer la bannière"
          cancelHref="/darja-admin/pages-to-modify"
          showRequiredHint={false}
        />
      </form>
    </Form>
  );
};

export default BannerForm;
