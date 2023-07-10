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
          this.input.value = "";
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

class GetShards extends HTMLElement {
  constructor() {
    super();
    const GS = document.createElement("template");
    GS.innerHTML = `
      <style>
        textarea,
        button {
          background: transparent;
          font: inherit;
          transition: 0.4s all;
          border: transparent;
        }

        .input {
          opacity: 0;
          animation: fadeIn 0.4s 2s ease-in forwards;
          color: #fff;
          border-radius: 100px;
          padding: 0.9em 0.9em 0 0.9em;
          font-size: 1.4rem;
          width: 85%;
          outline: none;
          text-align: center;
          border-right: solid 1px #fbe9954d;
          border-left: solid 1px #fbe9954d;
          min-height: 6rem;
          resize: none;
        }

        .submit {
          opacity: 0;
          animation: fadeIn 0.4s 2.7s ease-in forwards;
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
          display: flex;
          align-items: center;
          flex-direction: column;
          width: 100%;
          min-height: 700px;
          margin: 0 auto;
          border-radius: 50%;
        }

        .input__area {
          width: 50%;
          max-width: 700px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
        }

        .heading__container {
          opacity: 0;
          text-align: center;
          margin-top: 4.5rem;
          animation: fadeIn 0.4s 1.8s ease-in forwards;
        }

        .queryText {
          font-size: 1.65rem;
          text-align: center;
          filter: drop-shadow(0 0 0.2em var(--flame-color));
          color: #fff;
          transition: 1s all;
        }

        .flame-outermost {
          opacity: 0;
          animation: fadeIn 0.2s 0.6s ease-in forwards;
          gap: 0rem;
          margin-top: 4rem;
          margin-bottom: 4rem;
          align-items: flex-end;
          justify-content: space-evenly;
        }

        .flame-container,
        .flame {
          min-height: 1.5rem;
          max-width: 1.5rem;
          width: 100%;
        }

        .flame-container {
          position: absolute;
          filter: blur(0.07rem);
          display: inline;
        }

        .flame-circle {
          position: relative;
          min-height: 6.5rem;
          width: 6.5rem;
          border-radius: 50%;
          animation: rotate 3.3s linear infinite;
        }

        .flame {
          border-radius: 56% 44% 88% 12% / 100% 0% 100% 0%;
          transform: rotate(-40deg);
          animation: dissolve 1.5s 0.1s ease-in-out infinite alternate;
          transition: 0.5s all;
          background: var(--close-circle);
          filter: drop-shadow(0 0 0.8em var(--close-circle));
        }

        .flame-1 {
          top: -0.6rem;
          right: 2.4rem;
          rotate: 90deg;
        }

        .flame-2 {
          bottom: 0.8rem;
          left: -0.3rem;
          rotate: -30deg;
        }

        .flame-3 {
          bottom: 0.6rem;
          right: -0.2rem;
          rotate: 210deg;
        }

        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          20% {
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes dissolve {
          100% {
            rotate: 240deg;
            min-height: 0.1rem;
          }
        }

        @keyframes fadeIn {
          100% {
            opacity: 1;
          }
        }

      </style>

      <div class="input__container">
        <div class="heading__container">
          <p class="queryText">Offer Shard 1.</p>
        </div>

        <div class="flame-outermost">
          <div class="flame-circle">
            <div class="flame-container flame-1">
              <div class="flame"></div>
            </div>
            <div class="flame-container flame-2">
              <div class="flame"></div>
            </div>
            <div class="flame-container flame-3">
              <div class="flame"></div>
            </div>
          </div>
        </div>

        <div class="input__area">
          <textarea type="text" class="input"></textarea>
          <button class="submit">⤗</button>
        </div>
      </div>
    `;
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(GS.content.cloneNode(true));

    this.input = shadow.querySelector(".input");
    const submitBTN = shadow.querySelector(".submit");
    const queryText = shadow.querySelector(".queryText");
    let accumulator = 0;

    this.collectShards = new Promise((resolve) => {
      submitBTN.addEventListener("click", () => {
        if (accumulator === $.thresholdClose - 1) {
          $.shards.push(this.input.value.trim());
          this.input.value = "";
          resolve(true);
        } else {
          $.shards.push(this.input.value.trim());
          accumulator++;
          this.input.value = "";
          this.input.focus();
          queryText.innerText = `Offer Shard ${accumulator + 1}.`;
        }
      });
    });
  }
}

class RevealIntentions extends HTMLElement {
  constructor() {
    super();
    const RI = document.createElement("template");
    RI.innerHTML = `
      <style>
        @keyframes fadeIn {
          100% {
            opacity: 1;
          }
        }

        .teardrop-wrap {
          margin: 0 auto;
          margin-top: 5rem;
          margin-bottom: 1.5rem;
          min-height: 2rem;
          width: 2rem;
          filter: blur(0.025rem);
        }

        .teardrop {
          opacity: 0;
          animation: fadeIn 0.4s 0.5s ease-in forwards;
          position: relative;
          margin: 0 auto;
          min-height: 2rem;
          width: 2rem;
          border-radius: 95% 15% 100% 0% / 100% 15% 95% 0%;
          border: solid 1px transparent;
          background: var(--success);
          rotate: -45deg;
          filter: drop-shadow(0 0 0.8em var(--success));
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

        .display-container {
          max-width: 1200px;
          min-height: 500px;
          margin: 0 auto;
          position: relative;
          background-color: #05001900;
          border-radius: 30px;
          /* border: solid 1px #fff; */
        }

        .scrollable-content {
          opacity: 0;
          animation: fadeIn 0.4s 1.8s ease-in forwards;
          /* border: solid 0.5px #fff; */
          padding: 0 1em 0 1em;
          min-width: 1200px;
          max-height: 420px;
          overflow-y: auto;
          scrollbar-width: none;
        }

        h1,
        h2 {
          text-align: center;
        }

        h1 {
          opacity: 0;
          font-size: 2.4rem;
          font-variant: small-caps;
          color: #fff;
          filter: drop-shadow(0 0 0.1em #fff);
          margin-top: 0rem;
          margin-bottom: 1rem;
          text-align: center;
          animation: fadeIn 0.4s 1s ease-in forwards;
        }

        h2 {
          opacity: 0;
          position: relative;
          margin-top: 2rem;
          font-size: 1.85rem;
          font-variant: small-caps;
          color: var(--success);
          filter: drop-shadow(0 0 0.05em var(--success));
          transition: 0.4s all;
        }

        .h2-1 {
          margin-top: 2.5rem;
        }

        h2::after {
          content: "";
          position: absolute;
          width: 2rem;
          min-height: 2rem;
          border-bottom: solid 4px var(--success);
          border-radius: 50%;
          filter: drop-shadow(0 0 0.05em var(--success));
          top: -3rem;
          right: 51.5%;
        }

        .responses {
          text-align: left;
          padding: 0 5em 0 7em;
        }

        .responses p {
          font-size: 1.2rem;
        }

        .response-block {
          transition: filter 0.4s;
        }

        .dream-responses {
          opacity: 0;
          animation: fadeIn 0.4s 2.1s ease-in forwards;
        }

        p.participant-label {
          font-size: 1.4rem;
          color: #6486ff;
          filter: drop-shadow(0 0 0.1em #6486ff);
        }

        .blur {
          filter: blur(3px);
        }

        .intention-text {
          min-width: 100%;
          min-height: 4rem;
          margin-bottom: 0;
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

        button {
          opacity: 0;
          animation: fadeIn 0.4s 3s ease-in forwards;
          display: block;
          margin: 0 auto;
          background: transparent;
          font: inherit;
          transition: 0.4s all;
          border: transparent;
        }
      </style>

      <div class="display-container">
        <div class="teardrop-wrap">
          <div class="teardrop"></div>
        </div>
        <h1 class="title">summoned intentions</h1>
        <div class="scrollable-content">
          <div class="responses">
            <h2 class="h2-1">what is your biggest dream for the new year?</h2>
            <div class="dream-responses">
              <div class="response-block">
                <p class="participant-label">Participant 1</p>
                <p class="intention-text">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
              </div>
              <div class="response-block">
                <p class="participant-label">Participant 1</p>
                <p class="intention-text">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
              </div>
              <div class="response-block">
                <p class="participant-label">Participant 1</p>
                <p class="intention-text">Lorem ipsum</p>
              </div>
              <div class="response-block">
                <p class="participant-label">Participant 1</p>
                <p class="intention-text">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
              </div>
            </div>
          </div>
          <div class="responses">
            <h2 class="h2-2">what will you conjure by the summer solstice?</h2>
            <div class="conjure-responses">
              <div class="response-block">
                <p class="participant-label">Participant 1</p>
                <p class="intention-text">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
              </div>
              <div class="response-block">
                <p class="participant-label">Participant 1</p>
                <p class="intention-text">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
              </div>
            </div>
          </div>
          <div class="responses">
            <h2 class="h2-3">feel into the moment and capture its essence.</h2>
            <div class="essence-responses">
              <div class="response-block">
                <p class="participant-label">Participant 1</p>
                <p class="intention-text">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
              </div>
              <div class="response-block">
                <p class="participant-label">Participant 1</p>
                <p class="intention-text">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
              </div>
            </div>
          </div>
        </div>
        <button class="submit">⤗</button>
      </div>
    `;
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(RI.content.cloneNode(true));

    const blurObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("blur");
          } else {
            entry.target.classList.add("blur");
          }
        });
      },
      {
        root: shadow.querySelector(".scrollable-content"),
        threshold: 0.9,
      }
    );

    const targetElements = shadow.querySelectorAll(".response-block");
    targetElements.forEach((el) => {
      blurObserver.observe(el);
    });

    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.filter = "none";
            entry.target.style.animation = "fadeIn 0.4s ease-in forwards";
          } else {
            entry.target.style.filter = "blur(3px)";
          }
        });
      },
      {
        root: shadow.querySelector(".scrollable-content"),
        threshold: 1,
      }
    );
    const h2s = shadow.querySelectorAll("h2");
    h2s.forEach((el) => {
      fadeObserver.observe(el);
    });
  }
}

function declareComponents() {
  customElements.define("threshold-input", GetThreshold);
  customElements.define("shard-input", GetShards);
  customElements.define("reveal-intentions", RevealIntentions);
}

export default {
  GetThreshold,
  GetShards,
  RevealIntentions,
  declareComponents,
};
