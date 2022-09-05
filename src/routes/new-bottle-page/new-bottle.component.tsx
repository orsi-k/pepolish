import { useNavigate } from 'react-router-dom';
import { Button } from 'react-md';
import { useState } from 'react';
import { DocumentData } from 'firebase/firestore';

import BottleTable from '../../components/bottle-table/bottle-table.component';
import { PolishBottle } from '../../store/product/product.types';
import NewBottleButtons from '../../components/new-bottle-buttons/new-bottle-buttons';

import { BottleContainer } from './new-bottle.styles';

const NewBottle = () => {
  const emptyBottle: PolishBottle = {
    productId: '',
    userId: '',
    locationUserId: '',
    fullPercentage: 0,
    photoUrl: '',
  };

  const navigate = useNavigate();
  const [bottle, setBottle] = useState(emptyBottle);

  const setBottleFromChild = (bottle: PolishBottle | DocumentData) => {
    setBottle(bottle as PolishBottle);
  };

  const cancelClickedFromChild = () => {
    navigate('/bottles');
  };

  return (
    <BottleContainer>
      <Button themeType="contained" onClick={() => navigate('/bottles')}>
        Back to bottle list
      </Button>
      <NewBottleButtons
        bottle={bottle}
        bottleId={''}
        editable={true}
        seteditable={()=>{}}
        onCancelClicked={cancelClickedFromChild}
      />
      <BottleTable bottle={bottle} editable={true} setbottle={setBottleFromChild} />
    </BottleContainer>
  );
};

export default NewBottle;

// új bottlenál
