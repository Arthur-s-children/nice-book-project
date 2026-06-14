import paperVideo from '/img/categories/paper.mp4';
import audioVideo from '/img/categories/audio.mp4';
import kindleVideo from '/img/categories/kindlebook.mp4';

import paperPoster from '/img/categories/paper_poster.webp';
import audioPoster from '/img/categories/audio_poster.webp';
import kindlePoster from '/img/categories/kindlebook_poster.webp';

export const categories = [
  {
    titleKey: 'catalog.title.paperback',
    type: 'paperback',
    video: paperVideo,
    poster: paperPoster,
  },
  {
    titleKey: 'catalog.title.audiobook',
    type: 'audiobook',
    video: audioVideo,
    poster: audioPoster,
  },
  {
    titleKey: 'catalog.title.kindle',
    type: 'kindle',
    video: kindleVideo,
    poster: kindlePoster,
  },
];
