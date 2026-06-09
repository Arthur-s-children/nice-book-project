import paperVideo from '../../../../public/img/categories/paper.mp4';
import audioVideo from '../../../../public/img/categories/audio.mp4';
import kindleVideo from '../../../../public/img/categories/kindlebook.mp4';

import paperPoster from '../../../../public/img/categories/paper_poster.webp';
import audioPoster from '../../../../public/img/categories/audio_poster.webp';
import kindlePoster from '../../../../public/img/categories/kindlebook_poster.webp';

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
