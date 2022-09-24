import { useState } from 'react';
import { Form, Select, TextField } from 'react-md';
import { BottleTableProps } from '../../routes/bottle-page/bottle.component';
import {
  getItemQuery,
  getItemsByWhereFilteredFieldsQuery,
  getListFilteredFieldsQuery,
} from '../../utils/firestore/firestore.utils';
import { sortAndUniqList } from '../../utils/helperFunctions';

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
  const [brand, setBrand] = useState('');
  const productQuery = getItemQuery(bottle.productId, 'products', !newBottle);
  const userQuery = getItemQuery(bottle.userId, 'users', !newBottle);
  const locationQuery = getItemQuery(
    bottle.locationUserId,
    'users',
    !newBottle
  );
  const allBrandsQuery = getListFilteredFieldsQuery('products', 'brand');
  const allNamesQuery = getItemsByWhereFilteredFieldsQuery(
    brand,
    'brand',
    'products',
    brand.length > 0
  );
  const allUserNamesQuery = getListFilteredFieldsQuery('users', 'displayName');

  const getBrand = () => {
    if (productQuery && productQuery.isSuccess && productQuery.data) {
      return productQuery.data?.brand;
    } else {
      return '';
    }
  };

  const getName = () => {
    if (productQuery && productQuery.isSuccess && productQuery.data) {
      return productQuery.data?.name;
    } else {
      return '';
    }
  };

  const getUserName = () => {
    if (userQuery && userQuery.isSuccess && userQuery.data) {
      return userQuery.data?.displayName;
    } else {
      return '';
    }
  };

  const getLocationUserName = () => {
    if (locationQuery && locationQuery.isSuccess && locationQuery.data) {
      return locationQuery.data?.displayName;
    } else {
      return '';
    }
  };

  const sortedBrands = () => {
    if (allBrandsQuery && allBrandsQuery.isSuccess && allBrandsQuery.data) {
      return sortAndUniqList(allBrandsQuery.data);
    } else {
      return [];
    }
  };

  const sortedNames = () => {
    if (allNamesQuery && allNamesQuery.isSuccess && allNamesQuery.data) {
      return sortAndUniqList(allNamesQuery.data);
    } else {
      return [];
    }
  };

  const sortedUserNames = () => {
    if (
      allUserNamesQuery &&
      allUserNamesQuery.isSuccess &&
      allUserNamesQuery.data
    ) {
      return sortAndUniqList(allUserNamesQuery.data);
    } else {
      return [];
    }
  };

  return (
    <Form>
      <p>Product:</p>
      {!editable ? (
        <TextField
          id="productId"
          name="Product Id"
          disabled={!editable}
          value={`${getBrand()} - ${getName()}`}
        />
      ) : (
        <>
          (required)
          <Select
            id="brand"
            name="Brand"
            value={brand}
            options={sortedBrands()}
            onChange={(item) => setBrand(item)}
          />
          <Select
            id="name"
            name="Name"
            value={selectedProduct.name}
            disabled={brand.length === 0}
            options={sortedNames()}
            onChange={(item) =>
              setselectedproduct({
                ...selectedProduct,
                brand: brand,
                name: item,
              })
            }
          />
        </>
      )}
      <p>User:</p>
      {!editable ? (
        <TextField
          id="userName"
          name="Username"
          disabled={!editable}
          value={getUserName()}
        />
      ) : (
        <>
          (required)
          <Select
            id="username"
            name="Username"
            value={selectedUser}
            options={sortedUserNames()}
            onChange={(item) => setselecteduser(item)}
          />
        </>
      )}
      <p>Location User:</p>
      {!editable ? (
        <TextField
          id="locationUsername"
          name="Location Username"
          disabled={!editable}
          value={getLocationUserName()}
        />
      ) : (
        <>
          (required)
          <Select
            id="locationUsername"
            name="Location Username"
            value={selectedLocationUser}
            options={sortedUserNames()}
            onChange={(item) => setselectedlocationuser(item)}
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
