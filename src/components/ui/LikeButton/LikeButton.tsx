import { Button } from '@mui/material';
import { Icon } from '../Icon';
import styles from './LikeButton.module.scss';

type Props = {
  isSelected: boolean;
  onClick: () => void;
};

export const LikeButton = ({ onClick, isSelected = false }: Props) => {
  return (
    <Button
      className={`${styles.button} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
      disableRipple
    >
      {isSelected ?
        <Icon name="heart-filled" />
      : <Icon name="heart" />}
    </Button>
  );
};
