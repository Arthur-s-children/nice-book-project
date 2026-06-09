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
  | 'arrow-right'
  | 'arrow-down'
  | 'arrow-up'
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
      src={`/icons/${name}.svg`}
      className={styles.icon}
      alt={name}
      height={size}
    />
  );
};
