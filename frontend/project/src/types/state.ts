import store from '../store';

import type { Offer, Comment, City, SortName, User, ImagesFile } from './types';
import { AuthorizationStatus, SubmitStatus } from '../const';


export type SiteData = {
    offers: Offer[];
    isOffersLoading: boolean;
    offer: Offer | null;
    isOfferLoading: boolean;
    favoriteOffers: Offer[];
    isFavoriteOffersLoading: boolean;
    premiumOffers: Offer[];
    comments: Comment[];
    commentStatus: SubmitStatus;
};

export type SiteProcess = {
    city: City;
    sorting: SortName;
    imagesFileArr: ImagesFile[];
}

export type UserProcess = {
    authorizationStatus: AuthorizationStatus;
    user: User['email'];
    avatarUrl: User['avatarUrl'];
}

export type State = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
