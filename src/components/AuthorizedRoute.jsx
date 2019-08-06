import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";

import { useSelectors, useActions } from "../redux";
import * as unboundAuthActions from "../actions/auth";
import * as unboundContactActions from "../actions/contacts";
import { getIsLoggedIn, getIsLoading } from "../selectors";
import { Ripple, CenterContent } from "./styles";

export default function AuthorizedRoute(props) {
  const { component: Component, ...rest } = props;

  const [isLoading, isLoggedIn] = useSelectors(getIsLoading, getIsLoggedIn);
  const { loginUserWithToken, fetchContacts } = useActions({
    ...unboundAuthActions,
    ...unboundContactActions
  });

  useEffect(() => {
    if (!isLoggedIn) {
      loginUserWithToken();
      fetchContacts();
    }
  }, [isLoggedIn, loginUserWithToken, fetchContacts]);

  return (
    <Route
      {...rest}
      render={() => {
        if (isLoading) {
          return (
            <CenterContent>
              <Ripple />
            </CenterContent>
          );
        } else if (isLoggedIn) {
          return <Component {...props} />;
        } else {
          return <Redirect to="/login" />;
        }
      }}
    />
  );
}
