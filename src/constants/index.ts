import { IPartner } from '@/lib/database/models/partner.model';
import { editionHref, type EditionYear } from './editions';

export const navLinks = [
  {
    title: 'Acceuil',
    href: '/',
  },
  {
    title: 'A propos',
    href: '/about',
  },
  {
    title: 'Édition 2026',
    href: editionHref('2026'),
  },
  {
    title: 'Dérive 2024',
    href: editionHref('2024'),
  },
  {
    title: 'Editions précédentes',
    href: editionHref('2022'),
  },
  {
    title: 'Espace Darja',
    href: '/espace-darja',
  },
  {
    title: 'Communauté',
    href: '/community',
  },
  {
    title: 'Contact',
    href: '/contact',
  },
];

export const postDefaultValues = {
  frenchTitle: '',
  arabicTitle: '',
  frenchText: '',
  arabicText: '',
  images: [],
  videoSource: '',
  startDateTime: new Date(),
  endDateTime: new Date(),
  postCategory: '',
  location: '',
  locationAr: '',
  isInHomepage: false,
  yearOfEdition: '2024' as EditionYear,
  artists: [],
  url: '',
};

export const artistDefaultValues = {
  frenchName: '',
  arabicName: '',
  frenchText: '',
  arabicText: '',
  images: [],
  videoSource: '',
  editions: [],
  isInHomepage: false,
  url: '',
};

// Slider configuration and data
export const slider1 = [
  {
    color: 'linear-gradient(135deg, #094142 0%, #00b0db 100%)',
    src: 'slider3.jpg',
  },
  {
    color: 'linear-gradient(90deg, #00b0db 0%, #ee7103 100%)',
    src: 'slider5.jpg',
  },
  {
    color: 'linear-gradient(90deg, #ee7103 0%, #00b0db 100%)',
    src: 'slider2.jpg',
  },
  {
    color: 'linear-gradient(135deg, #00b0db 0%, #094142 100%)',
    src: 'slider7.jpg',
  },
];

export const slider2 = [
  {
    color: 'linear-gradient(135deg, #00b0db 0%, #094142 100%)',
    src: 'slider2.jpg',
  },
  {
    color: 'linear-gradient(90deg, #ee7103 0%, #00b0db 100%)',
    src: 'slider1.jpg',
  },
  {
    color: 'linear-gradient(90deg, #00b0db 0%, #ee7103 100%)',
    src: 'slider7.jpg',
  },
  {
    color: 'linear-gradient(135deg, #094142 0%, #00b0db 100%)',
    src: 'slider3.jpg',
  },
];

export const partnerDefaultValues: Partial<IPartner> = {
  frenchName: '',
  arabicName: '',
  hrefLink: '',
  editions: [],
  logoImage: '',
};
