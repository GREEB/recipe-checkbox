import siteData from "./sites.json";

let wakeLock = null;
let checkAllCheckbox = null;

const site = siteData.sites.find((e) => window.location.host.includes(e.url)); // Get site data
if (!site) console.error("No site configuration found for the current host.");

const containerElement = document.querySelector(site.selector); // Get list from selector in config
if (!containerElement) console.log("No container element found");

/**
 * Append elements
 */
containerElement.insertAdjacentElement("afterbegin", setupCheckAll());
if (!site.dontAddWakelock) containerElement.insertAdjacentElement("afterbegin", setupWakeLock());

/**
 * Create checkboxes
 */
if (!site.dontAddCheckboxes){
  containerElement.querySelectorAll("li:not(.rc-check-all-item)").forEach((listItem) => { // For each item that is not our select all switch
    const checkbox = document.createElement("input")
    checkbox.type = "checkbox";
    checkbox.className = "ingredient-checkbox";
    listItem.insertAdjacentElement("afterbegin", checkbox); // Insert at the beginging of the li
  
    listItem.addEventListener("click", (event) => { // Click event for li text
      if (event.target.tagName !== "A" && event.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
        listItem.classList.toggle("rc-checked", checkbox.checked); 
      }
    });
    checkbox.addEventListener("change", () => { // Click event for checkbox
      listItem.classList.toggle("rc-checked", checkbox.checked);
    });
  });
}

/**
 * Functions
 */
const changeAllCheckboxChange = () =>{
  const allChecked = checkAllCheckbox.checked;
  containerElement.querySelectorAll("li").forEach((listItem) => {
    const checkbox = listItem.querySelector("input[type='checkbox']");
    if (checkbox && checkbox !== checkAllCheckbox) {
      checkbox.checked = allChecked;
      listItem.classList.toggle("rc-checked", allChecked);
    }
  });
}

async function setWakeLock(on){
  if (on){
    try {
      wakeLock = await navigator.wakeLock.request("screen");
    } catch (err) {
      console.log(`${err.name}, ${err.message}`)
    }
  }else{
    wakeLock.release().then(() => {
      wakeLock = null;
    });
  }
}

function setupCheckAll(){
  const checkAllItem = document.createElement("li")
  checkAllItem.className = "rc-check-all-item"; 
  checkAllCheckbox = document.createElement("input")
  checkAllCheckbox.type = "checkbox";
  checkAllCheckbox.className = "rc-check-all-checkbox";
  checkAllItem.appendChild(checkAllCheckbox);
  checkAllItem.appendChild(document.createTextNode(" Check All / Uncheck All"));

  checkAllItem.addEventListener("click", () => {
    checkAllCheckbox.checked = !checkAllCheckbox.checked;
    changeAllCheckboxChange()});

  checkAllCheckbox.addEventListener("click", () => {
    checkAllCheckbox.checked = !checkAllCheckbox.checked;
    changeAllCheckboxChange()
  });
  return checkAllItem
}

function setupWakeLock(){
  const container = document.createElement('div')
  container.className = "rc-wakelock"
  const label = document.createElement('label')
  label.className = 'rc-switch'; 
  const input = document.createElement('input')
  input.type = 'checkbox';
  const span = document.createElement('span')
  span.className = 'rc-slider rc-round';
  label.appendChild(input);
  label.appendChild(span);
  container.appendChild(document.createTextNode("Prevent your screen from going dark"));
  container.appendChild(label)

  input.addEventListener("change", (event) => {
    if (event.target.checked){
      setWakeLock(true)
    }else{
      setWakeLock(false)
    }
  });
  return container
}