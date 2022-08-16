import { configureStore } from '@reduxjs/toolkit';
//import { compose, applyMiddleware } from 'redux';
//import logger from 'redux-logger';

import { rootReducer } from './root-reducer';


//const middleWares = [logger]

//const composedEnhancers = compose(applyMiddleware(...middleWares));

export const store = configureStore({ reducer: rootReducer });

export type RootState = ReturnType<typeof rootReducer>;