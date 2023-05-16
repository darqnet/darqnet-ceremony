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
    @keyframes fadeIn {
        100% {
          opacity: 1;
        }
      }

    .chooseCeremony__container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5em;
        opacity: 0;
        animation: fadeIn 0.5s ease-in forwards;
      }
      
      .button__container {
        display: flex;
        gap: 1.6em;
      }
      
      .cerBtn {
        font-size: 1rem;
        padding: 1em;
        border-radius: 30px;
        border: solid 2px #fff;
        background-color: transparent;
        color: #fff;
        transition: 0.2s all;
      }
      
      .cerBtn:hover,
      .cerBtn:focus {
        background-color: #1a1a1a;
        cursor: pointer;
      }
      
      .cerBtn + .cerBtn {
        margin-right: 1em;
      }
    </style>
    <div class="chooseCeremony__container">
        <h2>What ceremony will this be?</h2>
        <div class="button__container">
          <button class="cerBtn open">Opening</button>
          <button class="cerBtn close">Closing</button>
        </div>
    </div>
    `;
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(chooseCeremony__temp.content.cloneNode(true));

    const open = shadow.querySelector(".open");
    const close = shadow.querySelector(".close");
    this.selection = new Promise((resolve) => {
      open.addEventListener("click", () => {
        resolve("open");
      });
      close.addEventListener("click", () => {
        resolve("close");
      });
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
        font-size: 2rem;
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
      @keyframes fadeIn {
        100% {
          opacity: 1;
        }
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .encryptionMessage__container {
        opacity: 0;
        animation: fadeIn 0.7s ease-in forwards;
      }

      .encryptionMessage__content {
        font-size: 2rem;
      }

      .loadingSymbol {
        display: inline;
        max-width: 50px;
        height: auto;
        vertical-align: -0.65em;
      }
      </style>
      <div class="encryptionMessage__container">
        <p class="encryptionMessage__content">
          Encrypting Intentions
          <img class="loadingSymbol" src="https://i.gifer.com/ODkF.gif" alt="blue flame" />
        </p>
      </div>
    `;

    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(encryptionMessage__temp.content.cloneNode(true));
    this.msg_content = shadow.querySelector(".encryptionMessage__content");
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
