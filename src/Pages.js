import React from "react";
import { Switch, Route } from "react-router-dom";
import App from "./App";
import UserSide from "./UserSide";

function Pages() {
  return (
    <Switch>
      <Route path="/" exact component={App} />
      {/* <Route path="/user/:id" exact component={UserSide} /> */}
      <Route path="/user" exact component={UserSide} />
    </Switch>
  );
}

export default Pages;
