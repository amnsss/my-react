// import React from "react";
// import { createRoot } from 'react-dom/client';
import ReactDOM from "./myreact/react-dom";
import Component from "./myreact/Component";
import "./index.css";
// import App from './App';

// createRoot(document.getElementById('root')).render(<App />);

class ClassComponent extends Component {
  render() {
    return <div>class component</div>;
  }
}

function FunctionComponent() {
  return <div>function component</div>;
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
