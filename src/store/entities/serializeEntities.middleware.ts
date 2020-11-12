import { Action, Dispatch, Middleware } from '@reduxjs/toolkit';

import { map } from '@vendor';

import { createNotification } from '../notifications.slice';
import { serializeAccount, serializeNotification } from './helpers';
import { createAccount, updateAccount, updateAccounts } from './index';

/**
 * 2020-11-02: BN and bignumber objects are not serializable so the @reduxjs/toolkit
 * serializableCheck middleware from `getDefaultMiddleware` throws an error (in dev env).
 * We create a custom middleware that runs before it to convert the bigish values to string.
 */

export const serializeEntitiesMiddleware: Middleware<TObject, any, Dispatch<Action>> = (_) => (
  next
) => (action) => {
  switch (action.type) {
    /** Transform bigish values to string */
    case createAccount.type:
    case updateAccount.type:
      next({ type: action.type, payload: serializeAccount(action.payload) });
      break;
    // Payload is an array of accounts
    case updateAccounts.type:
      next({
        type: action.type,
        payload: map(serializeAccount, action.payload)
      });
      break;
    /** Transform date formats to string */
    case createNotification.type:
      next({
        type: action.type,
        payload: serializeNotification(action.payload)
      });
      break;
    default:
      next(action);
  }
};
