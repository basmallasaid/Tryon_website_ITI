import { useTranslation } from 'react-i18next';
import SharedEmptyState from '../EmptyState';

const EmptyState = ({ onAdd }) => {
  const { t } = useTranslation();
  return (
    <SharedEmptyState
      message={t('wardrobe.empty')}
      description={t('wardrobe.emptyDesc')}
      buttonText={t('wardrobe.addFirstItem')}
      onButtonClick={onAdd}
    />
  );
};

export default EmptyState;
