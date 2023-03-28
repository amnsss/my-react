// import React from "react";
// import { createRoot } from 'react-dom/client';
import ReactDOM from "./myreact/react-dom";
import Component from "./myreact/Component";
import "./index.css";
import { useReducer } from "./myreact/Hook";
// import App from './App';

// createRoot(document.getElementById('root')).render(<App />);

class ClassComponent extends Component {
  render() {
    return <div>class component</div>;
  }
}

const reducer = (state, action) => {
  switch (action) {
    case "add":
      return state + 1;
    case "minus":
      return state - 1;
    default:
      return state;
  }
}

function FunctionComponent() {
  const [count, dispatch] = useReducer(reducer, 0);

  return (
    <div style="border: 1px dashed black">
      <div>function component</div>
      <div>{count}</div>
      <div>
        <button onClick={() => dispatch("add")}>add</button>
        <button onClick={() => dispatch("minus")}>minus</button>
      </div>
    </div>
  );
}

const jsx = (
  <div>
    <h1>1</h1>
    <h2>2</h2>
    <>123</>
    <FunctionComponent />
    <ClassComponent />
  </div>
);

ReactDOM.render(jsx, document.getElementById("root"));
