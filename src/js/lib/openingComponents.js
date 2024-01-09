"use strict";

import $ from "../stores.js";

// DOM
const welcome = document.querySelector(".welcome");
const ceremonyContainer = document.querySelector(".ceremonyContainer");

// COMPONENTS

// || CHOOSE CEREMONY ||
class ChooseCeremony extends HTMLElement {
  constructor() {
    super();
    const CC = document.createElement("template");
    CC.innerHTML = `
    <style>
      .container {
        margin: 0 auto;
        width: 100%;
      }
      
      .row {
        display: flex;
        align-items: center;
        justify-content: space-around;
      }
      
      .selection-options {
        opacity: 0;
        animation: fadeIn 0.2s 0.6s ease-in forwards;
        gap: 0rem;
        margin-top: 2rem;
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
        background: var(--flame-color);
        filter: drop-shadow(0 0 0.8em #6c85f9);
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
      
      .selection-buttons {
        display: flex;
        gap: 6.5rem;
        justify-content: center;
        align-items: center;
        max-width: 100%;
        margin: 0 auto;
        margin-top: 8.5rem;
      }
      
      .btn {
        opacity: 0;
        animation: fadeIn 0.4s 2.2s ease-in forwards;
        color: #fff;
        font: inherit;
        text-align: center;
        font-size: 2.2rem;
        font-weight: 700;
        font-variant: small-caps;
        display: block;
        padding: 0;
        background: transparent;
        border: transparent;
        transition: 0.4s all;
        filter: drop-shadow(0 0 0.5em var(--flame-color));
      }
      
      .btn:hover,
      .btn:focus {
        cursor: pointer;
        color: #999999;
        outline: transparent;
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
        animation: fadeIn 0.4s 1.8s ease-in forwards;
        position: relative;
        margin: 0 auto;
        min-height: 2rem;
        width: 2rem;
        border-radius: 95% 15% 100% 0% / 100% 15% 95% 0%;
        border: solid 1px transparent;
        background: #fff;
        rotate: -45deg;
        filter: drop-shadow(0 0 0.5em #fff);
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

      @media screen and (-webkit-min-device-pixel-ratio:0) {
        /* Safari and Chrome */
        .btn {
          font-size: 2.5rem;
        }
      }

      @-moz-document url-prefix() {
        /* Firefox */
        .btn {
          font-size: 2.2rem;
        }
      }
    </style>
    <div class="container">
      <div class="teardrop-wrap">
        <div class="teardrop"></div>
      </div>
      <div class="row selection-options">
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
      <div class="selection-buttons">
        <button class="btn btn-open">opening ceremony</button>
        <button class="btn btn-close">closing ceremony</button>
      </div>
    </div>
    `;
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(CC.content.cloneNode(true));

    const flames = Array.from(shadow.querySelectorAll(".flame"));
    const teardrop = shadow.querySelector(".teardrop");
    const openBtn = shadow.querySelector(".btn-open");
    const closeBtn = shadow.querySelector(".btn-close");
    this.selection = new Promise((resolve) => {
      openBtn.addEventListener("click", () => {
        resolve("open");
      });
      closeBtn.addEventListener("click", () => {
        resolve("close");
      });
    });
    openBtn.addEventListener("mouseover", () => {
      flames.map((e) => {
        e.style.background = "var(--open-circle)";
        e.style.filter = "drop-shadow(0 0 0.8em var(--open-circle))";
      });
      teardrop.style.background = "var(--open-circle)";
      teardrop.style.filter = "drop-shadow(0 0 0.8em var(--open-circle))";
      teardrop.style.transform = "rotate(15deg)";
    });
    openBtn.addEventListener("mouseout", () => {
      flames.map((e) => {
        e.style.background = "var(--flame-color)";
        e.style.filter = "drop-shadow(0 0 0.8em #6c85f9)";
      });
      teardrop.style.background = "#fff";
      teardrop.style.filter = "drop-shadow(0 0 0.5em #fff)";
      teardrop.style.transform = "rotate(0deg)";
    });
    closeBtn.addEventListener("mouseover", () => {
      flames.map((e) => {
        e.style.background = "var(--close-circle)";
        e.style.filter = "drop-shadow(0 0 0.8em var(--close-circle))";
      });
      teardrop.style.background = "var(--close-circle)";
      teardrop.style.filter = "drop-shadow(0 0 0.8em var(--close-circle))";
      teardrop.style.transform = "rotate(-15deg)";
    });
    closeBtn.addEventListener("mouseout", () => {
      flames.map((e) => {
        e.style.background = "var(--flame-color)";
        e.style.filter = "drop-shadow(0 0 0.8em #6c85f9)";
      });
      teardrop.style.background = "#fff";
      teardrop.style.filter = "drop-shadow(0 0 0.5em #fff";
      teardrop.style.transform = "rotate(0deg)";
    });
  }
}

// || PARTICIPANT INPUT ||
class GetParticipants extends HTMLElement {
  constructor() {
    super();
    const GP = document.createElement("template");
    GP.innerHTML = `
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
        max-width: 600px;
        width: 100%;
      }

      .queryText {
        opacity: 0;
        font-size: 2.1rem;
        font-weight: 700;
        text-align: center;
        filter: drop-shadow(0 0 0.35em var(--flame-color));
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
        background: var(--open-circle);
        rotate: -45deg;
        filter: drop-shadow(0 0 0.8em var(--open-circle));
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
        <p class="queryText">How many have gathered?</p>
        <div class="input__container">
          <input type="text" class="input" autofocus />
          <button class="submit">&#5129</button>
        </div>
    </div>
    `;
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(GP.content.cloneNode(true));

    this.input = shadow.querySelector(".input");
    const submitBTN = shadow.querySelector(".submit");
    const queryText1 = shadow.querySelector(".queryText");

    let gotPar = false;
    let gotThresh = false;

    setTimeout(() => {
      queryText1.style.opacity = 1;
      this.input.focus();
    }, 2400);

    this.acquiredPT = new Promise((resolve) => {
      submitBTN.addEventListener("click", () => {
        if (!gotPar) {
          if (!isNaN(parseInt(this.input.value))) {
            queryText1.style.opacity = 0;
            $.participants = parseInt(this.input.value);
            gotPar = true;
            setTimeout(() => {
              queryText1.innerText = "What is your threshold?";
              queryText1.style.opacity = 1;
            }, 1200);
            this.input.value = "";
            this.input.focus();
          }
        } else if (!gotThresh) {
          if (
            !isNaN(parseInt(this.input.value)) &&
            parseInt(this.input.value) <= $.participants
          ) {
            $.threshold = parseInt(this.input.value);
            gotThresh = true;
            this.input.value = "";
            resolve(true);
          }
        }
      });
    });

    this.input.addEventListener("keyup", () => {
      if (gotPar && parseInt(this.input.value) > $.participants)
        this.input.style.borderColor = "red";
      else {
        this.input.style.borderColor = "var(--flame-color)";
      }
    });
  }
}

class GetConjurations extends HTMLElement {
  constructor(ptNum) {
    super();
    const GC = document.createElement("template");
    GC.innerHTML = `
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

        .participant-label {
          font-size: 1.8rem;
          color: var(--open-circle);
          filter: drop-shadow(0 0 0.2em var(--open-circle));
        }

        .queryText {
          font-size: 1.65rem;
          font-weight: 700;
          text-align: center;
          filter: drop-shadow(0 0 0.1em #fff);
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
          background: var(--open-circle);
          filter: drop-shadow(0 0 0.8em var(--open-circle));
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
          <p class="participant-label"></p>
          <p class="queryText">What is your biggest dream for the new year?</p>
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
    shadow.append(GC.content.cloneNode(true));

    this.input = shadow.querySelector(".input");
    const submitBTN = shadow.querySelector(".submit");
    const participantLabel = shadow.querySelector(".participant-label");
    participantLabel.innerText = `PARTICIPANT ${ptNum + 1}`;
    const queryText = shadow.querySelector(".queryText");

    let acquiredDreams = false;
    let acquiredConjurations = false;
    let acquiredEssence = false;

    this.push_inputs = function () {
      if (!acquiredDreams) {
        $.dreams = [...$.dreams, this.input.value];
        acquiredDreams = true;
        this.input.focus();
      } else if (!acquiredConjurations) {
        $.conjurations = [...$.conjurations, this.input.value];
        acquiredConjurations = true;
        this.input.focus();
      } else if (acquiredDreams && acquiredConjurations) {
        $.essence = [...$.essence, this.input.value];
        acquiredEssence = true;
      }
      return true;
    };

    this.acquire_entries = new Promise((resolve) => {
      submitBTN.addEventListener("click", () => {
        queryText.style.opacity = 0;
        this.push_inputs();
        this.input.value = "";
        setTimeout(() => {
          if (acquiredDreams && !acquiredConjurations) {
            queryText.innerText = $.conjurationPrompt;
          } else if (acquiredConjurations) {
            queryText.innerText = $.essencePrompt;
          }
          if (acquiredEssence) resolve(true);
          else queryText.style.opacity = 1;
        }, 1000);
      });
    });
  }
}

// || SEED PHRASE DISPLAY ||
class SeedphraseDisplay extends HTMLElement {
  constructor(seedphraseText) {
    super();
    const SD = document.createElement("template");
    SD.innerHTML = `
      <style>
        @keyframes fadeIn {
          100% {
            opacity: 1;
          }
        }

        .seedphrase__container {
          max-width: 625px;
          text-align: center;
        }

        .seedphrase__directive,
        .seedphrase__content {
          opacity: 0;
        }

        .seedphrase__directive {
          font-size: 1.8rem;
          font-weight: 700;
          filter: drop-shadow(0 0 0.4em var(--flame-color));
          animation: fadeIn 0.4s 1.2s ease-in forwards;
          margin: 0;
        }

        .seedphrase__content {
          font-size: 1.35rem;
          animation: fadeIn 0.4s 1.9s ease-in forwards;
          margin: 4.7rem 0 2rem 0;
          color: var(--open-circle);
        }

        button {
          background: transparent;
          font: inherit;
          transition: 0.4s all;
          border: transparent;
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
          background: var(--open-circle);
          rotate: -45deg;
          filter: drop-shadow(0 0 0.8em var(--open-circle));
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

      <div class="seedphrase__container">
        <div class="teardrop-wrap">
          <div class="teardrop"></div>
        </div>
        <p class="seedphrase__directive">Make a note of your seed phrase.</p>
        <p class="seedphrase__content">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo
          voluptate nesciunt quidem eos, cumque dolorem totam excepturi
          similique quasi iste!
        </p>
        <button class="submit">&#5129</button>
      </div>
    `;
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(SD.content.cloneNode(true));

    const seedphraseContent = shadow.querySelector(".seedphrase__content");
    const acceptBTN = shadow.querySelector(".submit");
    seedphraseContent.innerText = seedphraseText;

    this.acceptPhrase = new Promise((resolve, reject) => {
      acceptBTN.addEventListener("click", () => {
        resolve(true);
        console.log("resolved - user accepted seed phrase.");
      });
    });
  }
}

// || ENCRYPTION MESSAGE ||
class EncryptionMessage extends HTMLElement {
  constructor() {
    super();
    const EM = document.createElement("template");
    EM.innerHTML = `
      <style>
        .container {
          max-width: 18rem;
        }
        
        .flame-container {
          position: absolute;
          width: 10%;
          bottom: 1rem;
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
          background-color: #e1423f;
          filter: drop-shadow(0 0 0.3em #ff5555);
        }
        
        .flame {
          position: absolute;
          z-index: -1;
          opacity: 0;
          bottom: 0.4rem;
          min-height: 1.8rem;
          max-width: 1.8rem;
          width: 100%;
          background-color: #fbe995;
          filter: drop-shadow(0 0 0.3em #ffe366);
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
          animation: fadeIn 0.7s ease-in forwards;
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
          background-image: var(--dark-gradient);
          background-size: 300%;
          filter: drop-shadow(0 0 0.3em #fbc381);
          background-position: right;
          border: solid 2px var(--dark-gradient);
          animation: shiftGradient 1.2s infinite ease-in-out alternate;
          border-radius: 50%;
          transform: translateY(2.3rem);
          transition: 0.5s all;
        }
        
        .orb[type="success"] {
          background-image: var(--success-gradient);
          filter: drop-shadow(0 0 0.9em #ac441c);
          animation: successGradient 1.2s infinite ease-in-out alternate;
        }
        
        @keyframes shiftGradient {
          100% {
            filter: drop-shadow(0 0 0.9em #fbc381);
            background-position: left;
            border: solid 2px var(--light-gradient);
            transform: translateY(3.2rem);
          }
        }
        
        @keyframes successGradient {
          100% {
            filter: drop-shadow(0 0 0.9em #fd4444);
            background-position: left;
            border: solid 2px var(--success-border);
            transform: translateY(3.2rem);
          }
        }
        
        @keyframes float {
          40% {
            opacity: 1;
          }
          80% {
            transform: translate(0rem, -5.5rem);
          }
          90% {
            opacity: 0;
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

        .encryptionMessage__content {
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
      <div class="orb-container container">
        <div class="orb" type="default"></div>
          <div class="flame-container container">
            <div class="flame flame-1"></div>
            <div class="flame flame-2"></div>
            <div class="flame flame-3"></div>
          </div>
        <div class="flame-base" type="default"></div>
      </div>
      <p class="encryptionMessage__content">ENCRYPTING INTENTIONS</p>
    `;
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(EM.content.cloneNode(true));
    this.msg_content = shadow.querySelector(".encryptionMessage__content");

    this.encryptionComplete = function () {
      setTimeout(() => {
        this.msg_content.style.opacity = 1;
        this.msg_content.innerText = "CEREMONY COMPLETE";
      }, 10000);
      setTimeout(() => {
        this.msg_content.style.opacity = 0;
      }, 15000);
    };

    const orb = shadow.querySelector(".orb");
    const base = shadow.querySelector(".flame-base");

    setTimeout(() => {
      this.msg_content.style.opacity = 1;
    }, 2500);
    setTimeout(() => {
      orb.style.opacity = 0;
      this.msg_content.style.opacity = 0;
    }, 9500);
    setTimeout(() => {
      orb.setAttribute("type", "success");
      orb.style.opacity = 1;
      base.setAttribute("type", "success");
    }, 10500);
  }
}

export default {
  welcome,
  ceremonyContainer,
  ChooseCeremony,
  GetParticipants,
  GetConjurations,
  SeedphraseDisplay,
  EncryptionMessage,
};
