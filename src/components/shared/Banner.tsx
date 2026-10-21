import type { BannerView } from '@/lib/banner';
import BannerStrip from './BannerStrip';

// Announcement above the landing, the page passes null when it must stay hidden
const Banner = ({ view }: { view: BannerView | null }) => {
  if (!view) return null;

  // the menu button floats at the top right below lg, the fixed bar is 10vh from lg
  return (
    <div className="mt-[84px] lg:mt-[10vh]">
      <BannerStrip view={view} />
    </div>
  );
};

export default Banner;
