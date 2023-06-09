"use strict";

import $ from "./stores.js";

// DOM
const welcome = document.querySelector(".welcome");
const ripple = document.querySelector(".ripple");
const ceremonyContainer = document.querySelector(".ceremonyContainer");

// COMPONENTS

// || CHOOSE CEREMONY ||
class chooseCeremony extends HTMLElement {
  constructor() {
    super();
    const chooseCeremony__temp = document.createElement("template");
    chooseCeremony__temp.innerHTML = `
    <style>
      .container {
        margin: 0 auto;
        max-width: 700px;
        width: 100%;
      }
      
      .row {
        display: flex;
        align-items: center;
        justify-content: space-around;
      }
      
      .selection-options {
        opacity: 0;
        animation: fadeIn 0.4s ease-in forwards;
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
        gap: 3.5rem;
        justify-content: center;
        align-items: center;
        max-width: 100%;
        margin: 0 auto;
        margin-top: 4.5rem;
      }
      
      .btn {
        opacity: 0;
        animation: fadeIn 0.4s 1.8s ease-in forwards;
        color: #fff;
        font: inherit;
        text-align: center;
        font-size: 1.6rem;
        display: block;
        padding: 0 1.3em 1.3em 1.3em;
        background: transparent;
        border: transparent;
        border-radius: 50%;
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
        animation: fadeIn 0.4s 1.2s ease-in forwards;
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
        <button class="btn btn-open">Opening Ceremony</button>
        <button class="btn btn-close">Closing Ceremony</button>
      </div>
    </div>
    `;
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(chooseCeremony__temp.content.cloneNode(true));

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
class getParticipants extends HTMLElement {
  constructor() {
    super();
    const getParticipants__temp = document.createElement("template");
    getParticipants__temp.innerHTML = `
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
        border-radius: 30px;
        padding: 0.5em;
        font-size: 1.85rem;
        width: 85%;
        outline: none;
        text-align: right;
      }

      .input::placeholder {
        color: #f0f0f0;
        animation: fadeIn 1s ease-in forwards;
      }

      .submit {
        opacity: 0;
        animation: fadeIn 0.5s 1.3s ease-in forwards;
        font-size: 1.5rem;
        outline-color: transparent;
        color: #808080;
        border-radius: 50%;
        width: min-content;
      }

      .submit:hover {
        cursor: pointer;
        color: #fff;
      }

      .input__container {
        display: flex;
        justify-content: space-evenly;
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
      }
    </style>

    <div class="input__container">
        <input type="text" class="input" />
        <button class="submit">&#10140;</button>
    </div>
    `;
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(getParticipants__temp.content.cloneNode(true));

    const input = shadow.querySelector(".input");
    const submitBTN = shadow.querySelector(".submit");

    this.setPlaceholder = function (text) {
      let count = 1;
      const loadText = setInterval(() => {
        if (count <= text.length) {
          let text_segment = text.slice(0, count);
          input.setAttribute("placeholder", text_segment);
          count++;
        } else {
          input.focus();
          clearInterval(loadText);
        }
      }, 40);
    };

    let gotPar = false;
    let gotThresh = false;

    this.acquiredPT = new Promise((resolve) => {
      submitBTN.addEventListener("click", () => {
        if (!gotPar) {
          $.participants = parseInt(input.value);
          gotPar = true;
          input.value = "";
          input.setAttribute("placeholder", "");
          this.setPlaceholder("What is your threshold? ");
        } else if (!gotThresh) {
          $.threshold = parseInt(input.value);
          gotThresh = true;
          input.setAttribute("placeholder", "");
          input.value = "";
          resolve(true);
        }
      });
    });
  }
}

class getConjurations extends HTMLElement {
  constructor(ptNum) {
    super();
    const getConjurations__temp = document.createElement("template");
    getConjurations__temp.innerHTML = `
      <style>
        @keyframes fadeIn {
          100% {
            opacity: 1;
          }
        }
    
        textarea,
        button {
          background: transparent;
          font: inherit;
          transition: 0.4s all;
          border: transparent;
        }
    
        .input {
          color: #fff;
          border-radius: 20px;
          padding: 0.5em;
          font-size: 1.4rem;
          width: 85%;
          outline: none;
          text-align: left;
          border: solid 1px #ffffff24;
          min-height: 4rem;
          resize: none;
        }
    
        .input::placeholder {
          color: #f0f0f0;
          animation: fadeIn 1s ease-in forwards;
          text-align: center;
          font-size: 1.53rem;
        }
    
        .submit {
          opacity: 0;
          animation: fadeIn 0.5s 1.3s ease-in forwards;
          font-size: 1.5rem;
          outline-color: transparent;
          color: #808080;
          border-radius: 50%;
          width: min-content;
        }
    
        .submit:hover {
          cursor: pointer;
          color: #fff;
        }
    
        .input__container {
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: space-evenly;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }

        .input__area {
          width: 95%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 2rem;
        }

        p {
          font-size: 1.5rem;
          text-align: center;
        }

      </style>

      <div class="input__container">
        <p class="participant-label"></p>
        <div class="input__area">
          <textarea type="text" class="input"></textarea>
          <button class="submit">&#10140;</button>
        </div>
      </div>
    `;
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(getConjurations__temp.content.cloneNode(true));

    const input = shadow.querySelector(".input");
    const submitBTN = shadow.querySelector(".submit");
    const participantLabel = shadow.querySelector(".participant-label");
    participantLabel.innerText = `Participant ${ptNum + 1}`;

    this.setPlaceholder = function (text) {
      let count = 1;
      const loadText = setInterval(() => {
        if (count <= text.length) {
          let text_segment = text.slice(0, count);
          input.setAttribute("placeholder", text_segment);
          count++;
        } else {
          input.focus();
          clearInterval(loadText);
        }
      }, 40);
    };

    let acquiredDreams = false;
    let acquiredConjurations = false;
    let acquiredEssence = false;

    this.push_inputs = function () {
      if (!acquiredDreams) {
        $.dreams = [...$.dreams, input.value];
        acquiredDreams = true;
        input.setAttribute("placeholder", "");
        input.value = "";
        this.setPlaceholder(" What will you conjure by the summer solstice?");
      } else if (!acquiredConjurations) {
        $.conjurations = [...$.conjurations, input.value];
        acquiredConjurations = true;
        input.setAttribute("placeholder", "");
        input.value = "";
        this.setPlaceholder(" Feel into the moment and capture its essence!");
      } else if (acquiredDreams && acquiredConjurations) {
        $.essence = [...$.essence, input.value];
        acquiredEssence = true;
      }
      return true;
    };

    this.acquire_entries = new Promise((resolve) => {
      submitBTN.addEventListener("click", () => {
        this.push_inputs();
        if (acquiredEssence) resolve(true);
      });
    });
  }
}

// || SEED PHRASE DISPLAY ||
class seedphraseDisplay extends HTMLElement {
  constructor(seedphraseText) {
    super();
    const seedphraseDisplay__temp = document.createElement("template");
    seedphraseDisplay__temp.innerHTML = `
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
          font-size: 1.7rem;
          animation: fadeIn 0.7s ease-in forwards;
          margin-bottom: 0;
        }

        .seedphrase__content {
          font-size: 1.25rem;
          animation: fadeIn 0.7s 0.8s ease-in forwards;
          margin: 5.5rem 0 2rem 0;
        }

        .seedphrase__acceptBTN {
          opacity: 0;
          color: #fff;
          background: transparent;
          animation: fadeIn 0.7s 2s ease-in forwards;
          font: inherit;
          border: solid 1.5px #fff;
          padding: 0.5em;
          font-size: 1.25rem;
          outline-color: transparent;
          border-radius: 30px;
          transition: 0.4s all;
        }

        .seedphrase__acceptBTN:hover {
          cursor: pointer;
          background: #3a3a3a;
        }
      </style>

      <div class="seedphrase__container">
        <p class="seedphrase__directive">
          Make a note of your seed phrase.
        </p>
        <p class="seedphrase__content">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo
          voluptate nesciunt quidem eos, cumque dolorem totam excepturi
          similique quasi iste!
        </p>
        <button class="seedphrase__acceptBTN">Accept Phrase</button>
      </div>
    `;
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(seedphraseDisplay__temp.content.cloneNode(true));

    const seedphraseContent = shadow.querySelector(".seedphrase__content");
    const acceptBTN = shadow.querySelector(".seedphrase__acceptBTN");
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
class encryptionMessage extends HTMLElement {
  constructor() {
    super();
    const encryptionMessage__temp = document.createElement("template");
    encryptionMessage__temp.innerHTML = `
      <style>
        .container {
          max-width: 16rem;
        }
        
        .flame-container {
          position: absolute;
          width: 10%;
          bottom: 1rem;
          display: flex;
          justify-content: center;
        }
        
        .flame-base {
          min-height: 1rem;
          max-width: 2rem;
          width: 100%;
          background-color: #fad1b5;
          border-radius: 1rem 1rem 0 0;
          transform: rotate(180deg);
          filter: drop-shadow(0 0 0.3em #ffc881);
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
          min-height: 1.5rem;
          max-width: 1.5rem;
          width: 100%;
          /* #f1b162 */
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
          filter: blur(0.07rem);
          border-bottom: solid 1px #fff;
          border-radius: 50%;
        }
        
        .orb {
          min-height: 4.5rem;
          max-width: 4.5rem;
          width: 100%;
          background-image: var(--dark-gradient);
          background-size: 300%;
          filter: drop-shadow(0 0 0.3em #fbc381);
          background-position: right;
          border: solid 2px var(--dark-gradient);
          animation: shiftGradient 1.2s infinite ease-in-out alternate;
          border-radius: 50%;
          transform: translateY(2.5rem);
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
      <h2 class="encryptionMessage__content">Encrypting Intentions</h2>
    `;

    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(encryptionMessage__temp.content.cloneNode(true));
    this.msg_content = shadow.querySelector(".encryptionMessage__content");

    this.encryptionComplete = function () {
      setTimeout(() => {
        console.log("fading back in msg");
        this.msg_content.style.opacity = 1;
        this.msg_content.innerText = "Ceremony Complete.";
      }, 1500);
      setTimeout(() => {
        this.msg_content.style.opacity = 0;
      }, 5000);
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

function declareComponents() {
  customElements.define("choose-ceremony", chooseCeremony);
  customElements.define("participant-input", getParticipants);
  customElements.define("conjuration-input", getConjurations);
  customElements.define("seedphrase-display", seedphraseDisplay);
  customElements.define("encryption-message", encryptionMessage);
}

// this is only for testing, remove once component is implemented into ceremony_ui.js
// declareComponents();

export default {
  welcome,
  ripple,
  ceremonyContainer,
  chooseCeremony,
  getParticipants,
  getConjurations,
  seedphraseDisplay,
  encryptionMessage,
  declareComponents,
};
