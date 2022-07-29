import { Fragment } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home/Home";
import Nav from "./components/Nav/Nav";
import Transaction from "./components/Transaction/Transaction";
import TransactionHash from "./components/Transaction/TransactionHash";

const App = () => {
  return (
    <Router>
      <Fragment>
        <Nav />
        <div className="mainBody">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route
              exact
              path="/Exchange/Transaction/:id"
              element={<Transaction />}
            />
            <Route
              exact
              path="/Exchange/TransactionHash/:id"
              element={<TransactionHash />}
            />
          </Routes>
        </div>
      </Fragment>
    </Router>
  );
};

export default App;
