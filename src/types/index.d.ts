/* eslint-disable no-unused-vars */

// ====== URL QUERY PARAMS
export type UrlQueryParams = {
  params: string;
  key: string;
  value: string | null;
};

export type RemoveUrlQueryParams = {
  params: string;
  keysToRemove: string[];
};

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// ====== USER PARAMS
export type CreateUserParams = {
  clerkId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  photo: string;
};

export type UpdateUserParams = {
  firstName: string;
  lastName: string;
  username: string;
  photo: string;
};

// ====== CATEGORY PARAMS
export type CreatePostCategoryParams = {
  postCategoryName: string;
};

export type CreateArtistCategoryParams = {
  artistCategoryName: string;
};

// POST PARAMS
export type CreatePostParams = {
  frenchTitle: string;
  arabicTitle: string;
  frenchText: string;
  arabicText: string;
  images: string[];
  videoSource?: string;
  startDateTime: Date;
  endDateTime: Date;
  postCategory:
    | 'danse'
    | 'musique'
    | 'theatre'
    | 'lectures'
    | 'cinema'
    | 'conference'
    | 'ateliers'
    | 'autres';
  location: string;
  isInHomepage: boolean;
  url?: string;
};

export type UpdatePostParams = {
  post: {
    _id: string;
    frenchTitle: string;
    arabicTitle: string;
    frenchText: string;
    arabicText: string;
    images: string[];
    videoSource?: string;
    startDateTime: Date;
    endDateTime: Date;
    postCategory:
      | 'danse'
      | 'musique'
      | 'theatre'
      | 'lectures'
      | 'cinema'
      | 'conference'
      | 'ateliers'
      | 'autres';
    location: string;
    isInHomepage: boolean;
    url?: string;
  };
};

export type DeletePostParams = {
  postId: string;
};

// Artist Params
export type CreateArtistParams = {
  frenchName: string;
  arabicName: string;
  frenchText: string;
  arabicText: string;
  images: string[];
  videoSource?: string;
  artistCategory: '2022' | '2024';
  isInHomepage: boolean;
  url?: string;
};

export type UpdateArtistParams = {
  artist: {
    _id: string;
    frenchName: string;
    arabicName: string;
    frenchText: string;
    arabicText: string;
    images: string[];
    videoSource?: string;
    artistCategory: '2022' | '2024';
    isInHomepage: boolean;
    url?: string;
  };
};

export type DeleteArtistParams = {
  artistId: string;
};
