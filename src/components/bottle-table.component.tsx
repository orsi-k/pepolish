import { useEffect, useState } from 'react';
import { Button, Form, Select, TextField } from 'react-md';
import { ArrowDropDownSVGIcon } from '@react-md/material-icons';
import { BottleTableProps } from '../routes/bottle-page/bottle.component';
import {
  getListQuery,
} from '../utils/firestore/firestore.utils';
import { sortAndUniqList } from '../utils/helperFunctions';
import ProductModal from './product-modal/product-modal.component';

const BottleTable = ({
  bottle,
  selectedProduct,
  selectedUser,
  selectedLocationUser,
  editable,
  setbottle,
  setselectedproduct,
  setselecteduser,
  setselectedlocationuser,
  newBottle,
}: BottleTableProps) => {
  const [brands, setBrands] = useState([] as string[]);
  const [names, setNames] = useState([] as string[]);
  const [userNames, setUserNames] = useState([] as string[]);
  const [brand, setBrand] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const productList = getListQuery('products').data;
  const userList = getListQuery('users').data;

  if (productList && brands.length === 0 && names.length === 0) {
    const allBrands = Object.getOwnPropertyNames(productList).map((productId) => productList[productId].brand);
    setBrands(sortAndUniqList(allBrands));
    const allNames = Object.getOwnPropertyNames(productList).map((productId) => productList[productId].name);
    setNames(sortAndUniqList(allNames));
  }

  if (userList && userNames.length === 0) {
    const allUsernames = Object.getOwnPropertyNames(userList).map((userId) => userList[userId].displayName);
    setUserNames(sortAndUniqList(allUsernames));
  }

  const getBrand = () => (productList ? productList[bottle.productId].brand : '');
  // Name needs to be filtered! 
  const getName = () => (productList ? productList[bottle.productId].name : '');
  const getUserName = () => (userList ? userList[bottle.userId].displayName : '');
  const getLocationUserName = () => (userList ? userList[bottle.locationUserId].displayName : '');

  useEffect(() => {
    if (productList && !newBottle) {
      setselectedproduct({
        ...selectedProduct,
        brand: productList[bottle.productId].brand,
        name: productList[bottle.productId].name,
      });
      setBrand(productList[bottle.productId].brand);
    }
  }, [productList]);

  useEffect(() => {
    if (userList && !newBottle) {
      setselecteduser(userList[bottle.userId].displayName);
      setselectedlocationuser(userList[bottle.locationUserId].displayName);
    }
  }, [userList]);

  return (
    <Form>
      <p>Product:</p>
      {!editable ? (
        <TextField id="productId" name="Product Id" disabled={!editable} value={`${getBrand()} - ${getName()}`} />
      ) : (
        <>
          (required)
          <Select
            id="brand"
            name="Brand"
            value={brand}
            options={brands}
            onChange={(item) => setBrand(item)}
            rightChildren={<ArrowDropDownSVGIcon />}
          />
          <Select
            id="name"
            name="Name"
            value={selectedProduct.name}
            disabled={brand.length === 0}
            options={names}
            onChange={(item) =>
              setselectedproduct({
                ...selectedProduct,
                brand: brand,
                name: item,
              })
            }
            rightChildren={<ArrowDropDownSVGIcon />}
          />
          <Button themeType="outline" onClick={() => setIsVisible(true)}>
            Can't find polish in list? Add new!
          </Button>
          <ProductModal
            isVisible={isVisible}
            setProductFromModal={(brand, name) => {
              setBrand(brand);
              setselectedproduct({
                ...selectedProduct,
                brand: brand,
                name: name,
              });
            }}
            closeModal={() => setIsVisible(false)}
          />
        </>
      )}
      <p>User:</p>
      {!editable ? (
        <TextField id="userName" name="Username" disabled={!editable} value={getUserName()} />
      ) : (
        <>
          (required)
          <Select
            id="username"
            name="Username"
            value={selectedUser}
            options={userNames}
            onChange={(item) => setselecteduser(item)}
            rightChildren={<ArrowDropDownSVGIcon />}
          />
        </>
      )}
      <p>Location User:</p>
      {!editable ? (
        <TextField id="locationUsername" name="Location Username" disabled={!editable} value={getLocationUserName()} />
      ) : (
        <>
          (required)
          <Select
            id="locationUsername"
            name="Location Username"
            value={selectedLocationUser}
            options={userNames}
            onChange={(item) => setselectedlocationuser(item)}
            rightChildren={<ArrowDropDownSVGIcon />}
          />
        </>
      )}
      <p>Percentage:</p>
      <TextField
        id="fullPercentage"
        name="Percentage"
        type="number"
        min="0"
        disabled={!editable}
        value={`${bottle.fullPercentage}`}
        onChange={(event) =>
          setbottle({
            ...bottle,
            fullPercentage: event.currentTarget.value,
          })
        }
      />
      <p>Photo URL:</p>
      <TextField
        id="photoUrl"
        name="Photo URL"
        disabled={!editable}
        value={`${bottle.photoUrl}`}
        onChange={(event) =>
          setbottle({
            ...bottle,
            photoUrl: event.currentTarget.value,
          })
        }
      />
    </Form>
  );
};

export default BottleTable;
