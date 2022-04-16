import React from './node_modules/react';
import { render } from './node_modules/react-dom';
import { addEvent } from "./syntheticEvent.js"

let root = document.getElementById("root");
const jsx = (
  <section ONCLICK={(e) => console.log('click section')}>
    <h3>
      你好
    </h3>
    <button ONCLICK={(e) => {
      // e.stopPropagation();
      console.log('click button');
    }}>
      点击
    </button>
  </section>
)

addEvent(root, "click");
render(jsx, root)