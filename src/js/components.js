"use strict";

// DOM
const welcome = document.querySelector(".welcome");

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

    this.open = shadow.querySelector(".open");
    this.close = shadow.querySelector(".close");
    this.selection = new Promise((resolve, reject) => {
      try {
        this.open.addEventListener("click", () => {
          resolve("open");
        });
      } catch (err) {
        reject(err);
      }
      try {
        this.close.addEventListener("click", () => {
          resolve("close");
        });
      } catch (err) {
        reject(err);
      }
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
        background: #0c0c0c;
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
    this.acquired_participants = false;

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

    this.input_num = 0;

    this.get_ppl = function () {
      this.acquired_participants = true;
      this.input_num = input.value;
      return input.value;
    };

    this.participantCount = new Promise((resolve, reject) => {
      submitBTN.addEventListener("click", () => {
        resolve(this.get_ppl());
      });
    }).then(() => {
      if (this.acquired_participants) {
        input.setAttribute("placeholder", "");
        input.value = "";
        this.setPlaceholder("What is your threshold? ");

        this.thresholdSize = new Promise((resolve, reject) => {
          submitBTN.addEventListener("click", () => {
            resolve(input.value);
          });
        });
      }
    });
  }
}

class getConjurations extends HTMLElement {
  constructor() {
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
          background: #0c0c0c;
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
          min-height: 15rem;
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
          justify-content: space-evenly;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }

      </style>

      <div class="input__container">
        <textarea type="text" class="input"></textarea>
        <button class="submit">&#10140;</button>
      </div>
    `;
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(getConjurations__temp.content.cloneNode(true));

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

    this.acquiredDreams = false;
    this.acquiredConjurations = false;

    this.input_dream = [];
    this.input_conjuration = [];
    this.input_essence = [];

    this.push_inputs = function () {
      if (!this.acquiredDreams) {
        this.input_dream.push(input.value);
        this.acquiredDreams = true;
        console.log("dreams:", this.input_dream);
      } else if (!this.acquiredConjurations) {
        this.input_conjuration.push(input.value);
        this.acquiredConjurations = true;
        console.log("conjurations:", this.input_conjuration);
      } else if (this.acquiredDreams && this.acquiredConjurations) {
        console.log("moment's essence", this.input_essence);
      }
      return input.value;
    };

    // this.push_conjurations = function () {
    //   this.input_conjuration.push(input.value);
    //   console.log("conjurations:", input.conjuration);
    //   return input.value;
    // };

    // this.capture_essence = function () {
    //   return input.value;
    // };

    this.acquire_dreams = new Promise((resolve, reject) => {
      submitBTN.addEventListener("click", () => {
        resolve(this.push_inputs());
      });
    }).then(() => {
      input.setAttribute("placeholder", "");
      input.value = "";
      this.setPlaceholder(" What will you conjure by the summer solstice?");

      this.acquire_conjurations = new Promise((resolve, reject) => {
        submitBTN.addEventListener("click", () => {
          resolve(this.push_inputs());
        });
      });
    });
    // .then(() => {
    //   input.setAttribute("placeholder", "");
    //   input.value = "";
    //   this.setPlaceholder(" Feel into the moment and capture its essence!");

    //   this.acquire_essence = new Promise((resolve, reject) => {
    //     submitBTN.addEventListener("click", () => {
    //       resolve(this.capture_essence());
    //     });
    //   });
    // });

    this.setPlaceholder(" What is your biggest dream for the new year?");
  }
}

function declareComponents() {
  customElements.define("choose-ceremony", chooseCeremony);
  customElements.define("participant-input", getParticipants);
  customElements.define("conjuration-input", getConjurations);
}

declareComponents();

export default {
  welcome,
  chooseCeremony,
  getParticipants,
  getConjurations,
  declareComponents,
};
