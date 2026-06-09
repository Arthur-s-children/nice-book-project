import { Button } from '@mui/material';
import { Icon } from '../Icon';
import styles from './SliderArrow.module.scss';

type Direction = 'left' | 'right' | 'down' | 'up';

type Props = {
  direction: Direction;
  disabled?: boolean;
  onClick: () => void;
};

export const SliderArrow = ({ disabled, direction, onClick }: Props) => {
  return (
    <Button
      className={styles.button}
      onClick={onClick}
      disabled={disabled}
      disableRipple
    >
      <Icon name={`arrow-${direction}`} />
    </Button>
  );
};
