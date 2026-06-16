import { useRef, useState, useCallback } from 'react';
import styles from './SoundMenu.module.scss';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { getImageUrl } from '../../../services/getImageUrl.ts';

const SOUNDS = [
  {
    id: 'forest',
    label: 'Ліс',
    icon: getImageUrl('icons/forest.png'),
  },
  {
    id: 'bonfire',
    label: 'Вогнище',
    icon: getImageUrl('icons/bonfire.png'),
  },
  {
    id: 'rain',
    label: 'Дощ',
    icon: getImageUrl('icons/rain.png'),
  },
  {
    id: 'mindfulness',
    label: 'Усвідомленість',
    icon: getImageUrl('icons/mindfulness.png'),
  },
] as const;

type SoundId = (typeof SOUNDS)[number]['id'];

const isMobile = window.innerWidth < 640;

const ARC_RADIUS = isMobile ? 88 : 110;
const START_ANGLE = -90;
const END_ANGLE = -180;

const arcPosition = SOUNDS.map((_, i) => {
  const step = (END_ANGLE - START_ANGLE) / (SOUNDS.length - 1);
  const deg = START_ANGLE + step * i;
  const rad = (deg * Math.PI) / 180;

  return {
    x: Math.cos(rad) * ARC_RADIUS,
    y: Math.sin(rad) * ARC_RADIUS,
  };
});

export const SoundMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState<Set<SoundId>>(new Set());

  const itemRefs = useRef<HTMLButtonElement[]>([]);
  const audioRefs = useRef<Partial<Record<SoundId, HTMLAudioElement>>>({});

  useGSAP(() => {
    gsap.set(itemRefs.current, { x: 0, y: 0, scale: 0, opacity: 0 });
  });

  const openMenu = useCallback(() => {
    setIsOpen(true);

    gsap.to(itemRefs.current, {
      x: (i) => arcPosition[i].x,
      y: (i) => arcPosition[i].y,
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: 'back.out(2)',
      stagger: 0.07,
    });
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    gsap.to(itemRefs.current, {
      x: 0,
      y: 0,
      scale: 0,
      opacity: 0,
      duration: 0.3,
      ease: 'back.in(1.5)',
      stagger: { each: 0.05, from: 'end' },
    });
  }, []);

  const toggleSound = useCallback((id: SoundId) => {
    if (!audioRefs.current[id]) {
      const audio = new Audio(`${import.meta.env.BASE_URL}sounds/${id}.mp3`);
      audio.loop = true;
      audioRefs.current[id] = audio;
    }

    const audio = audioRefs.current[id]!;
    const index = SOUNDS.findIndex((s) => s.id === id);

    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        audio.pause();
      } else {
        next.add(id);
        audio.play().catch(console.error);
      }
      return next;
    });

    gsap.fromTo(
      itemRefs.current[index],
      { scale: 0.72 },
      { scale: 1, duration: 0.4, ease: 'back.out(2)' },
    );
  }, []);

  const handleTrigger = () => (isOpen ? closeMenu() : openMenu());

  return (
    <div className={styles.widget}>
      {SOUNDS.map((sound, i) => (
        <button
          key={sound.id}
          ref={(el) => {
            if (el) itemRefs.current[i] = el;
          }}
          type="button"
          aria-label={sound.label}
          aria-pressed={active.has(sound.id)}
          className={`${styles.item} ${active.has(sound.id) ? styles.itemActive : ''}`}
          onClick={() => toggleSound(sound.id)}
        >
          <img
            src={sound.icon}
            alt={sound.label}
            className={styles.icon}
            aria-hidden="true"
          />
        </button>
      ))}

      <button
        type="button"
        aria-label="Sound background"
        aria-expanded={isOpen}
        className={`${styles.trigger} ${active.size > 0 ? styles.triggerActive : ''}`}
        onClick={handleTrigger}
      >
        <img
          src={getImageUrl('icons/wave-sound.png')}
          className={styles.trigger__icon}
          alt="Sound waves"
          aria-hidden={true}
        />
      </button>
    </div>
  );
};
