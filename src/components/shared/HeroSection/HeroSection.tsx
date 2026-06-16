import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../../layout/Header/useTheme';
import './HeroSection.scss';

export const HeroSection = () => {
  const { isDark } = useTheme();

  return (
    <section className="hero">
      <motion.div
        className="hero__background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        style={{
          backgroundImage:
            isDark ?
              'url(/img/hero/night-theme-hero.jpg)'
            : 'url(/img/hero/hero-photo.jpg)',
        }}
      />
      <div className="hero__content">
        <motion.div
          className="hero__text"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
        >
          <h1 className="hero__title">
            Discover Your Next <span className="hero__accent">Great Read</span>
          </h1>
          <p className="hero__subtitle">
            Explore our curated collection of books that inspire, educate, and
            entertain. From timeless classics to modern masterpieces.
          </p>
          <Link
            to="/catalog"
            className="hero__button"
          >
            Shop Now
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
