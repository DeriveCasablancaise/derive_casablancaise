import PartnerForm from '@/components/dashboard/partners/PartnerForm';
import Navbar from '@/components/shared/Navbar';
import { getPartnerById } from '@/lib/actions/partner.actions';

type UpdatePartnerProps = {
  params: Promise<{
    partnerId: string;
  }>;
};

const UpdatePartner = async ({ params }: UpdatePartnerProps) => {
  const { partnerId } = await params;
  const partner = await getPartnerById(partnerId);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Navbar title="Modifier ce partenaire" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <PartnerForm type="Update" partner={partner} partnerId={partnerId} />
      </main>
    </div>
  );
};

export default UpdatePartner;
