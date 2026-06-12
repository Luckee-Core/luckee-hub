import { combineReducers } from "@reduxjs/toolkit";
import { appReducer } from "./appSlice";
import { devHubStudiosReducer } from "./dumps/devHubStudios";
import { breadcrumbBuilderReducer } from "./builders/breadcrumbBuilder";
import { devHubBuilderReducer } from "./builders/devHubBuilder";

export const rootReducer = combineReducers({
  app: appReducer,
  breadcrumbBuilder: breadcrumbBuilderReducer,
  devHubStudios: devHubStudiosReducer,
  devHubBuilder: devHubBuilderReducer,
});
