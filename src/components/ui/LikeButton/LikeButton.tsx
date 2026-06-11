import { Button } from '@mui/material';
import { Icon } from '../Icon';
import styles from './LikeButton.module.scss';

type Props = {
  isSelected: boolean;
  onClick: () => void;
  colored?: boolean;
};

export const LikeButton = ({
  onClick,
  isSelected = false,
  colored = false,
}: Props) => {
  return (
    <Button
      className={`${styles.button} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
      disableRipple
    >
      {isSelected ?
        <Icon
          name="heart-filled"
          colored={colored}
        />
      : <Icon name="heart" />}
    </Button>
  );
};
