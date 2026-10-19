import { loadFont as loadOutfit } from '@remotion/google-fonts/Outfit';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';

export const outfitFont = loadOutfit('normal', {
  weights: ['700', '800', '900'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

export const montserratFont = loadMontserrat('normal', {
  weights: ['400', '600', '700'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

export const interFont = loadInter('normal', {
  weights: ['500', '600'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

export const FONT_FAMILY = {
  heading: outfitFont.fontFamily,
  body: montserratFont.fontFamily,
  mono: interFont.fontFamily,
};
