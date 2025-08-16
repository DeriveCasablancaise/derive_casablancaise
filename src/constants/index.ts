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
    title: 'Dérive 2024',
    href: '/derive-2024',
  },
  {
    title: 'Editions précédentes',
    href: '/previous',
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
  isInHomepage: false,
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
  artistCategory: '',
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
