import {
  useFirestoreCollectionMutation,
  useFirestoreDocumentData,
  useFirestoreDocumentMutation,
  useFirestoreQuery,
} from '@react-query-firebase/firestore';
import {
  collection,
  doc,
  DocumentData,
  documentId,
  DocumentReference,
  FirestoreError,
  query,
  where,
  WithFieldValue,
} from 'firebase/firestore';
import { UseMutationResult } from 'react-query';

import { db } from '../firebase/firebase.utils';

export const getListQuery = (collName: string) => {
  const ref = collection(db, collName);

  const query = useFirestoreQuery([collName], ref, {
    subscribe: true,
  });

  return query;
};

export const getItemQuery = (productId: string | undefined, collName: string, isQueryEnabled = true) => {
  if (productId === '' || productId === null) {
    return;
  }
  const collectionRef = collection(db, collName);
  const ref = doc(collectionRef, productId);
  const query = useFirestoreDocumentData([collName, productId], ref, {}, { enabled: isQueryEnabled });

  return query;
};

export const getItemsByWhereQuery = (id: string | undefined, field: string, collName: string) => {
  const ref = query(
    collection(db, collName),
    where(field, '==', id)
  );

  const whereQuery = useFirestoreQuery([id], ref);

  return whereQuery;
};

export const getListSubsetQuery = (ids: string[] | undefined, collName: string, isQueryEnabled = true) => {
  const ref = query(
    collection(db, collName),
    where(documentId(), 'in', ids)
  );

  const whereQuery = useFirestoreQuery([ids], ref, {}, { enabled: isQueryEnabled });

  return whereQuery;
};

export const getListFilteredFieldsQuery = (collName: string, field: string, isQueryEnabled = true) => {
  const ref = collection(db, collName);

  const query = useFirestoreQuery([collName], ref, {
    subscribe: true
  }, {
    enabled: isQueryEnabled,
    select(snapshot) {
      return snapshot.docs.map((docSnapshot) => docSnapshot.data()[field])
    }
  });

  return query;
};

export const getItemsByWhereFilteredFieldsQuery = (id: string | undefined, field: string, collName: string, isQueryEnabled = true) => {
  const ref = query(
    collection(db, collName),
    where(field, '==', id)
  );

  const whereQuery = useFirestoreQuery([id], ref, {}, {
    enabled: isQueryEnabled,
    select(snapshot) {
      return snapshot.docs.map((docSnapshot) => docSnapshot.data().name)
    }
  });

  return whereQuery;
};

export const addNewItem = (collName: string) => {
  const ref = collection(db, collName);
  const mutation = useFirestoreCollectionMutation(ref);

  return mutation;
};

export const updateItem = (id: string | undefined, collName: string) => {
  if (id === '' || id === null) {
    return;
  }
  const coll = collection(db, collName);
  const ref = doc(coll, id);
  const mutation = useFirestoreDocumentMutation(ref);

  return mutation;
};

export type mutationResult =
  UseMutationResult<void, FirestoreError, WithFieldValue<DocumentData>, unknown> |
  UseMutationResult<DocumentReference<DocumentData>, FirestoreError, WithFieldValue<DocumentData>, unknown>;