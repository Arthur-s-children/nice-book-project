import styles from './Icon.module.scss';

type IconName =
  | 'home'
  | 'search'
  | 'cart'
  | 'heart'
  | 'heart-filled'
  | 'minus'
  | 'plus'
  | 'close'
  | 'arrow-left'
  | 'arrow-left-dark'
  | 'arrow-right'
  | 'arrow-right-dark'
  | 'arrow-down'
  | 'arrow-up'
  | 'arrow-up-dark'
  | 'burger'
  | 'truck'
  | 'headphones';

type Props = {
  name: IconName;
  size?: number;
};

export const Icon = ({ name, size = 16 }: Props) => {
  return (
    <img
      src={`${import.meta.env.BASE_URL}icons/${name}.svg`}
      className={styles.icon}
      alt={name}
      height={size}
    />
  );
};
