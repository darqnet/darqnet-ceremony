"use strict";

import $ from "../stores.js";
import * as Bip39 from "bip39";

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
          opacity: 0;
          animation: fadeIn 0.4s 2.8s ease-in forwards;
          rotate: 90deg;
          margin-top: 1rem;
          font-size: 2.7rem;
          outline-color: transparent;
          color: #fff;
          filter: drop-shadow(0 0 0.1em var(--flame-color));
          border-radius: 50%;
          width: min-content;
        }
  
        .submit:hover,
        .submit:focus {
          rotate: 0deg;
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
          width: 100%;
        }
  
        .queryText {
          opacity: 0;
          font-size: 2.1rem;
          font-weight: 700;
          text-align: center;
          filter: drop-shadow(0 0 0.3em var(--flame-color));
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
          <p class="queryText">Mark your opening ceremony threshold.</p>
          <div class="input__container">
            <input type="text" class="input" autofocus />
            <button class="submit">&#5129;</button>
          </div>
      </div>
      `;
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(GT.content.cloneNode(true));

    this.input = shadow.querySelector(".input");
    const submitBTN = shadow.querySelector(".submit");

    setTimeout(() => {
      this.input.focus();
    }, 3000);

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
          padding: 1.2em 0.9em 0 0.9em;
          font-size: 1.2rem;
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
          animation: fadeIn 0.4s 2.6s ease-in forwards;
          rotate: 90deg;
          margin-top: 1rem;
          font-size: 2.7rem;
          outline-color: transparent;
          color: #fff;
          filter: drop-shadow(0 0 0.1em var(--flame-color));
          border-radius: 50%;
          width: min-content;
        }
  
        .submit:hover,
        .submit:focus {
          rotate: 0deg;
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
          font-size: 2rem;
          font-weight: 700;
          text-align: center;
          filter: drop-shadow(0 0 0.3em var(--flame-color));
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
          <p class="queryText">OFFER SHARD 1.</p>
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
          <button class="submit">&#5129</button>
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
        if (
          !Bip39.validateMnemonic(
            this.input.value.trim().split(" ").slice(1).join(" ")
          )
        ) {
          queryText.style.opacity = 0;
          this.input.focus();
          setTimeout(() => {
            queryText.style.color = "var(--close-circle)";
            queryText.style.filter =
              "drop-shadow(0 0 0.4em var(--close-circle))";
            queryText.style.opacity = 1;
            queryText.innerText = `INVALID. OFFER SHARD ${
              accumulator + 1
            } AGAIN.`;
          }, 1200);
        } else {
          queryText.style.opacity = 0;
          setTimeout(() => {
            queryText.style.color = "#fff";
            queryText.style.filter =
              "drop-shadow(0 0 0.3em var(--flame-color))";
          }, 1200);
          if (accumulator === $.thresholdClose - 1) {
            $.shards.push(this.input.value.trim());
            this.input.value = "";
            resolve(true);
          } else {
            $.shards.push(this.input.value.trim());
            accumulator++;
            this.input.value = "";
            this.input.focus();
            setTimeout(() => {
              queryText.style.opacity = 1;
              queryText.innerText = `OFFER SHARD ${accumulator + 1}.`;
            }, 1200);
          }
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
        }

        .scrollable-content {
          opacity: 0;
          animation: fadeIn 0.4s 1.8s ease-in forwards;
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

        .h2-2, .h2-3 {
          margin-bottom: 2.5rem;
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
          filter: drop-shadow(0 0 0.1em var(--success));
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
          right: 50%;
        }

        .responses {
          padding: 0 5em;
        }

        response-block {
          transition: filter 0.4s;
          text-align: center;
        }

        .dream-responses {
          opacity: 0;
          animation: fadeIn 0.4s 2.1s ease-in forwards;
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
          rotate: 90deg;
          margin-top: 1rem;
          font-size: 2.7rem;
          outline-color: transparent;
          color: #fff;
          filter: drop-shadow(0 0 0.1em var(--flame-color));
          border-radius: 50%;
          width: min-content;
        }
  
        .submit:hover,
        .submit:focus {
          rotate: 0deg;
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
            <div class="dream-responses"></div>
          </div>
          <div class="responses">
            <h2 class="h2-2">what will you conjure by the summer solstice?</h2>
            <div class="conjure-responses"></div>
          </div>
          <div class="responses">
            <h2 class="h2-3">feel into the moment and capture its essence.</h2>
            <div class="essence-responses"></div>
          </div>
        </div>
      </div>
    `;
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(RI.content.cloneNode(true));

    const dreamResponses = shadow.querySelector(".dream-responses");
    const conjureResponses = shadow.querySelector(".conjure-responses");
    const essenceResponses = shadow.querySelector(".essence-responses");

    // Inserting and displaying ResponseBlock components
    for (let i = 0; i < $.clearText.d.length; i++) {
      dreamResponses.appendChild(new ResponseBlock(i, $.clearText.d[i]));
      conjureResponses.appendChild(new ResponseBlock(i, $.clearText.c[i]));
      essenceResponses.appendChild(new ResponseBlock(i, $.clearText.e[i]));
    }

    // Blurring and Fading on Scroll
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
        threshold: 1,
      }
    );

    const targetElements = shadow.querySelectorAll("response-block");
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

class ResponseBlock extends HTMLElement {
  constructor(participant, responseText) {
    super();
    const RB = document.createElement("template");
    RB.innerHTML = `
      <style>
        @keyframes fadeIn {
          100% {
            opacity: 1;
          }
        }

        .response-block {
          opacity: 0;
          position: relative;
          margin-bottom: 3rem;
          padding-right: 2em;
          padding-left: 2em;
          transition: filter 0.4s;
          border-radius: 100px;
          border-right: solid 1px #04eca3ad;
          border-left: solid 1px #04eca3ad;
          transition-property: opacity;
          transition-duration: 0.4s;
        }

        p.participant-label {
          font-size: 1.4rem;
          color: #6486ff;
          filter: drop-shadow(0 0 0.1em #6486ff);
          padding-right: 1.1em;
        }

        .intention-text {
          font-size: 1.2rem;
          min-width: 100%;
          min-height: 2.5rem;
          padding-bottom: 1.5em; 
          position: relative;
          z-index: 1;
        }
      </style>
    
      <div class="response-block">
        <p class="participant-label">Participant 1</p>
        <p class="intention-text"></p>
      </div>
    `;
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(RB.content.cloneNode(true));

    const participantLabel = shadow.querySelector(".participant-label");
    const intentionText = shadow.querySelector(".intention-text");
    const responseBlock = shadow.querySelector(".response-block");
    participantLabel.innerText = `PARTICIPANT ${participant + 1}`;
    intentionText.innerText = responseText;
    setTimeout(() => {
      responseBlock.style.transitionDelay = `${participant * 0.2 + 0.8}s`;
      responseBlock.style.opacity = 1;
    }, 2500);
  }
}

class DecryptionMessage extends HTMLElement {
  constructor() {
    super();
    const DM = document.createElement("template");
    DM.innerHTML = `
      <style>
      .teardrop-wrap {
        opacity: 0;
        animation: fadeIn 0.7s ease-in forwards;
        margin: 0 auto;
        margin-top: 5rem;
        margin-bottom: 1.5rem;
        min-height: 2rem;
        width: 2rem;
        filter: blur(0.025rem);
      }

      .teardrop {
        animation: shiftColor 0.5s 9.5s ease-in forwards;
        position: relative;
        margin: 0 auto;
        margin-bottom: 5rem;
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

      .container {
        max-width: 18rem;
      }
      
      .flame-container {
        position: absolute;
        width: 10%;
        bottom: 10rem;
        display: flex;
        justify-content: center;
      }
      
      .flame-base {
        min-height: 1.25rem;
        max-width: 2.5rem;
        width: 100%;
        background-color: var(--flame-color);
        border-radius: 2.5rem 2.5rem 0 0;
        transform: rotate(180deg);
        filter: drop-shadow(0 0 0.3em var(--flame-color));
        z-index: 4;
        margin: 8rem 0 1rem 0;
        transition: 0.5s all;
      }

      .flame-base[type="success"] {
        background-color: var(--success);
        filter: drop-shadow(0 0 0.3em var(--success));
      }
      
      .flame {
        position: absolute;
        z-index: -1;
        opacity: 0;
        bottom: 0.4rem;
        min-height: 1.8rem;
        max-width: 1.8rem;
        width: 100%;
        background-color: var(--success);
        filter: drop-shadow(0 0 0.3em var(--success));
        border-radius: 56% 44% 88% 12% / 100% 0% 100% 0%;
        transform: rotate(-40deg);
        transition: 0.5s all;
      }
      
      .flame-1 {
        animation: float 1.5s 0.5s 5;
      }
      
      .flame-2 {
        animation: float 1.5s 1s 5;
      }
      
      .flame-3 {
        animation: float 1.5s 1.5s 5;
      }
      
      .orb-container {
        opacity: 0;
        animation: fadeIn 0.7s 0.4s ease-in forwards;
        position: relative;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        filter: blur(0.055rem);
        border-bottom: solid 1px var(--flame-color);
        border-radius: 50%;
      }
      
      .orb {
        min-height: 5.5rem;
        max-width: 5.5rem;
        width: 100%;
        background-image: var(--decrypt-gradient);
        background-size: 300%;
        filter: drop-shadow(0 0 0.3em #04eca3);
        background-position: right;
        border: solid 2px var(--decrypt-gradient);
        animation: shiftGradient 1.2s infinite ease-in-out alternate;
        border-radius: 50%;
        transform: translateY(2.3rem);
        transition: 0.5s all;
      }
      
      @keyframes shiftGradient {
        100% {
          filter: drop-shadow(0 0 0.9em #04eca3);
          background-position: left;
          border: solid 2px var(--decrypt-gradient);
          transform: translateY(3.2rem);
        }
      }

      @keyframes shiftColor {
        100% {
          background: var(--success);
          filter: drop-shadow(0 0 0.8em var(--success));
        }
      }
      
      @keyframes float {
        40% {
          opacity: 1;
        }
        80% {
          transform: translate(0rem, -8.5rem);
        }
        90% {
          opacity: 0;
        }
        95% {
          transform: rotate(200deg);
        }
        100% {
          min-height: 0;
        }
      }

      @keyframes fadeIn {
        100% {
          opacity: 1;
        }
      }

      .message {
        opacity: 0;
        font-size: 2.1rem;
        font-weight: 700;
        text-align: center;
        margin-top: 5rem;
        filter: drop-shadow(0 0 0.1em #fff);
        text-align: center;
        transition: 0.5s all;
      }
    </style>
        <div class="teardrop-wrap">
          <div class="teardrop"></div>
        </div>
        <div class="orb-container container">
          <div class="orb" type="default"></div>
            <div class="flame-container container">
              <div class="flame flame-1"></div>
              <div class="flame flame-2"></div>
              <div class="flame flame-3"></div>
            </div>
          <div class="flame-base" type="default"></div>
        </div>
        <p class="message">DECRYPTING INTENTIONS</p>
    `;
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(DM.content.cloneNode(true));

    const base = shadow.querySelector(".flame-base");
    const msg = shadow.querySelector(".message");
    setTimeout(() => {
      msg.style.opacity = 1;
    }, 2500);
    setTimeout(() => {
      msg.style.opacity = 0;
      base.setAttribute("type", "success");
    }, 10000);

    this.transition = new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 12000);
    });
  }
}

function declareComponents() {
  customElements.define("threshold-input", GetThreshold);
  customElements.define("shard-input", GetShards);
  customElements.define("reveal-intentions", RevealIntentions);
  customElements.define("response-block", ResponseBlock);
  customElements.define("decryption-message", DecryptionMessage);
}

export default {
  GetThreshold,
  GetShards,
  RevealIntentions,
  ResponseBlock,
  DecryptionMessage,
  declareComponents,
};
