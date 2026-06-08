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
};

// use it like this -> <Icon name='heart' />

export const Icon = ({ name }: Props) => {
  return (
    <img
      src={`/icons/${name}.svg`}
      className={styles.icon}
      alt={name}
    />
  );
};
