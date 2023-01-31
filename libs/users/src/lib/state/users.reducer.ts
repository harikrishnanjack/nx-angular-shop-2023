import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import { stat } from 'fs';
import { User } from '../models/user';

import * as UsersActions from './users.actions';
import { UsersEntity } from './users.models';

export const USERS_FEATURE_KEY = 'users';

export interface UsersState{
  user:User | any,
  isAuthenticated:boolean
}

export interface UsersPartialState{
  readonly [USERS_FEATURE_KEY] : UsersState
}

export const initialState:UsersState={
  user:undefined,
  isAuthenticated:false
}

const reducer = createReducer(
  initialState,
  on(UsersActions.buildUserSession,(state)=>({...state})),
  on(UsersActions.buildUserSessionSuccess,(state,action)=>({
    ...state,
    user:action.user,
    isAuthenticated:true
  })),
  on(UsersActions.buildUserSessionSuccess,(state,action)=>({
    ...state,
    user:null,
    isAuthenticated:false
  })),

);

export function usersReducer(state: UsersState | undefined, action: Action) {
  return reducer(state, action);
}
