import { getImageUrl } from '../../../services/getImageUrl.ts';

export const categories = [
  {
    title: 'Paper books',
    type: 'paperback',
    video: getImageUrl('categories/paper.mp4'),
    poster: getImageUrl('categories/paper_poster.webp'),
  },
  {
    title: 'Audiobooks',
    type: 'audiobook',
    video: getImageUrl('categories/audio.mp4'),
    poster: getImageUrl('categories/audio_poster.webp'),
  },
  {
    title: 'Kindle books',
    type: 'kindle',
    video: getImageUrl('categories/kindlebook.mp4'),
    poster: getImageUrl('categories/kindlebook_poster.webp'),
  },
];
