import paperVideo from '/img/categories/paper.mp4';
import audioVideo from '/img/categories/audio.mp4';
import kindleVideo from '/img/categories/kindlebook.mp4';

import paperPoster from '/img/categories/paper_poster.webp';
import audioPoster from '/img/categories/audio_poster.webp';
import kindlePoster from '/img/categories/kindlebook_poster.webp';

export const categories = [
  {
    title: 'Paper books',
    type: 'paperback',
    video: paperVideo,
    poster: paperPoster,
  },
  {
    title: 'Audiobooks',
    type: 'audiobook',
    video: audioVideo,
    poster: audioPoster,
  },
  {
    title: 'Kindle books',
    type: 'kindle',
    video: kindleVideo,
    poster: kindlePoster,
  },
];
