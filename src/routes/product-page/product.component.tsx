import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowBackSVGIcon,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Divider,
  Grid,
  GridCell,
  TextIconSpacing,
} from 'react-md';
import { useContext, useState } from 'react';
import { DocumentData } from 'firebase/firestore';

import ProductTable from '../../components/product-table.component';
import { getListQuery, updateItem } from '../../utils/firestore/firestore.utils';
import EditProductButtons from '../../components/edit-product-buttons';

import { PaddedDiv, PaddedMediaContainer, ProductContainer } from './product.styles';
import { UserContext, authState } from '../../contexts/user.context';
import FavoriteToggle from '../../components/favorite-toggle.component';

const Product = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { isLoggedIn } = useContext(UserContext);
  const [editable, setEditable] = useState(false);
  const [product, setProduct] = useState({} as DocumentData);
  const [showImageFull, setShowImageFull] = useState(false);
  const [users, setUsers] = useState([] as string[]);
  const [hasUsers, setHasUsers] = useState(false);

  const productListQuery = getListQuery('products');
  const productList = productListQuery.data;
  const bottleList = getListQuery('bottles').data;
  const userList = getListQuery('users').data;
  const productMutation = updateItem(productId, 'products');

  // get all relevant info and save in state
  if (productList && productId && Object.keys(product).length === 0) {
    setProduct(productList.get(productId) || {});
  }

  // 1. get this product's bottles
  // 2. go thru bottles to save user ids
  // 3. also save if there are any bottles of this product
  // 4. if not, set users to fake array so we skip this check
  if (bottleList && userList && users.length === 0) {
    const relevantUsers = new Set<string>();
    bottleList.forEach((bottle) => {
      if (bottle.productId === productId) {
        relevantUsers.add(bottle.userId);
      }
    });

    if (relevantUsers.size > 0) {
      setHasUsers(true);
      setUsers(Array.from(relevantUsers));
    } else {
      setUsers(['']);
    }
  }

  const productMissingData = () => {
    if (product.brand.length > 0 && product.name.length > 0 && product.color.length > 0) return false;
    else return true;
  };

  const owningUsers = () => {
    return (
      hasUsers &&
      userList &&
      users?.map((userId: string) => {
        return (
          <div key={userId}>
            • <Link to={`/users/${userId}`}>{userList?.get(userId)?.displayName}</Link>
          </div>
        );
      })
    );
  };

  const saveClickedFromChild = () => {
    if (productMissingData()) alert('Please fill all required fields before saving!');
    else {
      productMutation && productMutation.mutate(product);
      productListQuery?.remove();
      setEditable(false);
    }
  };

  const cancelClickedFromChild = () => {
    if (productId) {
      const originalProduct = productList?.get(productId);
      if (originalProduct) setProduct(originalProduct);
    }
    setEditable(false);
  };

  return (
    <ProductContainer>
      <Grid>
        <GridCell colSpan={11} tablet={{ colSpan: 7 }} phone={{ colSpan: 4 }}>
          <Button themeType="contained" onClick={() => navigate('/products')}>
            <TextIconSpacing icon={<ArrowBackSVGIcon />}>Back to product list</TextIconSpacing>
          </Button>
        </GridCell>
        {isLoggedIn === authState.SignedIn && (
          <GridCell colSpan={1} phone={{ colSpan: 4 }} style={{ margin: 'auto' }}>
            <FavoriteToggle productId={productId || ' '} />
          </GridCell>
        )}
      </Grid>
      {productList && (
        <>
          {isLoggedIn === authState.SignedIn && (
            <PaddedDiv>
              <EditProductButtons
                editable={editable}
                seteditable={(editable: boolean) => setEditable(editable)}
                onSaveClicked={saveClickedFromChild}
                onCancelClicked={cancelClickedFromChild}
                mutation={productMutation}
              />
            </PaddedDiv>
          )}
          <Grid>
            <GridCell colSpan={7}>
              <ProductTable
                productId={productId}
                product={product}
                editable={editable}
                setproduct={(product: DocumentData) => setProduct(product)}
              />
            </GridCell>
            <GridCell colSpan={5}>
              <PaddedMediaContainer>
                {product.imageUrl ? (
                  <>
                    <img onClick={() => setShowImageFull(true)} src={product.imageUrl} />
                    <Dialog
                      id={`${productId}-img`}
                      visible={showImageFull}
                      onRequestClose={() => setShowImageFull(false)}
                      aria-labelledby="dialog-title"
                    >
                      <DialogHeader>
                        <DialogTitle id="dialog-title">{`${product.brand} - ${product.name}`}</DialogTitle>
                      </DialogHeader>
                      <DialogContent>
                        <img onClick={() => setShowImageFull(false)} src={product.imageUrl} />
                      </DialogContent>
                    </Dialog>
                  </>
                ) : (
                  'No photo'
                )}
              </PaddedMediaContainer>
              <Divider />
              {hasUsers && (
                <>
                  <p>Users who own this polish:</p>
                  {owningUsers()}
                </>
              )}
            </GridCell>
          </Grid>
        </>
      )}
    </ProductContainer>
  );
};

export default Product;
