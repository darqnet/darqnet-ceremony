"use strict";

// COMPONENTS

const welcome = document.querySelector(".welcome");

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
  }
}

customElements.define("choose-ceremony", chooseCeremony);

const loadComponents = () => {
  setTimeout(() => welcome.replaceWith(new chooseCeremony()), 6000);
};

loadComponents();
