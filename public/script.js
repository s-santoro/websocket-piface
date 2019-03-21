let piState = null;

// create status page
function createTable(json) {
  let inputs = json.inputs.state.toString();
  // fill inputs to size of 8, somehow at outputs it works
  for (x = inputs.length; x < 4; x++) {
    inputs = "0" + inputs;
  }
  let outputs = json.outputs.state;
  const input = document.getElementById("instatus");
  const output = document.getElementById("outstatus");
  const buttons = document.getElementById("buttons");
  // reset table
  input.innerHTML = "<div class='h4'>status</div>";
  output.innerHTML = "<div class='h4'>status</div>";
  buttons.innerHTML = "<div class='h4'>buttons</div>";
  for (x = 0; x < 8; x++) {
    if (x < 4) {
      //
      // create input element
      let intext = document.createTextNode(
        `pin: ${x} ---- value: ${inputs.substr(3 - x, 1)}`
      );
      let inelement = document.createElement("p");
      inelement.appendChild(intext);
      input.append(inelement);
    }
    //
    // create output element
    let outtext = document.createTextNode(
      `pin: ${x} ---- value: ${outputs.substr(7 - x, 1)}`
    );
    let outelement = document.createElement("p");
    outelement.appendChild(outtext);
    output.append(outelement);
    //
    // create change output button
    let buttontext = `<button id="button${x}" class="inactive">change state</button><br>`;
    buttons.insertAdjacentHTML("beforeend", buttontext);
    // give all buttons event-listeners
    let button = document.getElementById(`button${x}`);
    button.addEventListener("click", changeState.bind(button));
  }
  // create set new ouput button
  let buttontext = `<button id="setOutput">set new output</button>`;
  output.insertAdjacentHTML("beforeend", buttontext);
  let setButton = document.getElementById("setOutput");
  setButton.addEventListener("click", setNewOutput);
}

// change state of output pins
function changeState() {
  let classname = this.getAttribute("class");
  if (classname === "inactive") {
    this.setAttribute("class", "active");
  }
  if (classname === "active") {
    this.setAttribute("class", "inactive");
  }
}

// send new state to server
function setNewOutput() {
  let newJson = piState;
  let output = piState.outputs.state;
  let newOutput = "";
  for (x = 0; x < 8; x++) {
    let button = document.getElementById(`button${x}`);
    if (button.getAttribute("class") === "active") {
      if (output.substr(7 - x, 1) === "0") {
        newOutput = "1" + newOutput;
      } else {
        newOutput = "0" + newOutput;
      }
    } else {
      if (output.substr(7 - x, 1) === "0") {
        newOutput = "0" + newOutput;
      } else {
        newOutput = "1" + newOutput;
      }
    }
  }
  newJson.outputs.state = newOutput;
  doSend(JSON.stringify(newJson));
}
