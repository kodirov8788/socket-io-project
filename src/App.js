import React from "react";
import "./App.css";
import { Link } from "react-router-dom";
function App() {
  return (
    <div className="container">
      <Link className="link" to="/adminside">
        Admin side
      </Link>
      <Link className="link" to="/userside">
        User side
      </Link>
    </div>
  );
}

export default App;
