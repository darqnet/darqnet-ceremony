"use strict";

import $ from "../stores.js";

class GetThreshold extends HTMLElement {
  constructor() {
    super();
    const GT = document.createElement("template");
    GT.innerHTML = `
      <style>
        @keyframes fadeIn {
          100% {
            opacity: 1;
          }
        }
  
        input,
        button {
          background: transparent;
          font: inherit;
          transition: 0.4s all;
          border: transparent;
        }
  
        .input {
          color: #fff;
          border-radius: 50%;
          padding: 0.5em;
          font-size: 2.3rem;
          width: 100%;
          outline: none;
          text-align: center;
          border-bottom: solid 1px var(--flame-color);
          transition: border-color 0.4s;
        }
  
        .input::placeholder {
          color: #f0f0f0;
          animation: fadeIn 1s ease-in forwards;
        }
  
        .submit {
          font-size: 2.7rem;
          outline-color: transparent;
          color: #fff;
          filter: drop-shadow(0 0 0.1em var(--flame-color));
          border-radius: 50%;
          width: min-content;
        }
  
        .submit:hover,
        .submit:focus {
          cursor: pointer;
          color: #9d9d9d;
          outline: transparent;
        }
  
        .input__container {
          opacity: 0;
          animation: fadeIn 0.4s 2.2s ease-in forwards;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.1rem;
          width: 100%;
          max-width: 150px;
          margin: 0 auto;
          margin-top: 4.5rem;
        }
  
        .query__container {
          margin: 0 auto;
          max-width: 600px;
          width: 100%;
        }
  
        .queryText {
          opacity: 0;
          font-size: 2.1rem;
          text-align: center;
          filter: drop-shadow(0 0 0.1em var(--flame-color));
          animation: fadeIn 0.4s 1.8s ease-in forwards;
          transition: 1s all;
        }
  
        .teardrop-wrap {
          margin: 0 auto;
          margin-bottom: 6.5rem;
          min-height: 2rem;
          width: 2rem;
          filter: blur(0.025rem);
        }
  
        .teardrop {
          opacity: 0;
          animation: fadeIn 0.4s 0.8s ease-in forwards;
          position: relative;
          margin: 0 auto;
          min-height: 2rem;
          width: 2rem;
          border-radius: 95% 15% 100% 0% / 100% 15% 95% 0%;
          border: solid 1px transparent;
          background: var(--close-circle);
          rotate: -45deg;
          filter: drop-shadow(0 0 0.8em var(--close-circle));
          transition: 0.5s all;
        }
  
        .teardrop::after {
          content: "";
          position: absolute;
          width: 3rem;
          min-height: 3rem;
          border-bottom: solid 2px var(--flame-color);
          border-radius: 50%;
          left: 0.2rem;
          bottom: 0.2rem;
          rotate: 225deg;
        }
      </style>
  
      <div class="query__container">
          <div class="teardrop-wrap">
            <div class="teardrop"></div>
          </div>
          <p class="queryText">What was the threshold of your opening ceremony?</p>
          <div class="input__container">
            <input type="text" class="input" autofocus />
            <button class="submit">⤗</button>
          </div>
      </div>
      `;
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(GT.content.cloneNode(true));

    this.input = shadow.querySelector(".input");
    const submitBTN = shadow.querySelector(".submit");

    this.acquiredThreshold = new Promise((resolve) => {
      submitBTN.addEventListener("click", () => {
        if (!isNaN(parseInt(this.input.value))) {
          $.thresholdClose = parseInt(this.input.value);
          resolve(true);
        }
      });
    });

    this.input.addEventListener("keyup", () => {
      if (isNaN(parseInt(this.input.value)) && this.input.value != "")
        this.input.style.borderColor = "red";
      else {
        this.input.style.borderColor = "var(--flame-color)";
      }
    });
  }
}

function declareComponents() {
  customElements.define("threshold-input", GetThreshold);
}

export default {
  GetThreshold,
  declareComponents,
};
