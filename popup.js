const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

// Load the previous result from storage
chrome.storage.local.get("calculatorResult", (data) => {
  const savedResult = data.calculatorResult;
  display.innerText = savedResult !== undefined ? savedResult : "0";
});

buttons.forEach((item) => {
  item.onclick = () => {
    if (item.getAttribute("data-action") === "clear") {
      display.innerText = "0";

      // Remove the value from local storage
      chrome.storage.local.remove("calculatorResult");
    }
    // i really don't like prettier
    else if (item.getAttribute("data-action") === "backspace") {
      let string = display.innerText.toString();
      if (string.length === 1) {
        display.innerText = "0";
      } else display.innerText = string.slice(0, -1);
    }
    // i really don't like prettier
    else if (display.innerText !== "" && item.getAttribute("data-action") === "result") {
      if (display.innerText.startsWith("0/")) {
        chrome.storage.local.remove("calculatorResult");
        display.innerText = "Error!";
      } else {
        display.innerText = evaluateExpression(display.innerText);
      }
    }
    // i really don't like prettier
    else if (display.innerText === "0" && item.getAttribute("data-action") === "result") {
      display.innerText = "Empty!";
      setTimeout(() => (display.innerText = ""), 2000);
    }
    // i really don't like prettier
    else if (display.innerText === "0" && ["/", "*", "+", "-"].indexOf(item.getAttribute("data-action")) !== -1) {
      let operator = item.getAttribute("data-action");
      if (display.innerText.slice(-1) !== operator) display.innerText += operator;
    }
    // i really don't like prettier
    else if (display.innerText === "0") {
      display.innerText = item.getAttribute("data-action");
    }

    // i really don't like prettier
    else if (["/", "*", "+", "-"].indexOf(item.getAttribute("data-action")) !== -1) {
      let operator = item.getAttribute("data-action");
      if (display.innerText.slice(-1) !== operator) display.innerText += operator;
    }

    // i really don't like prettier
    else {
      display.innerText += item.getAttribute("data-action");
    }

    // Save the current display value to storage
    const currentValue = display.innerText;
    if (currentValue !== "Error!" && currentValue !== "Empty!") {
      chrome.storage.local.set({ calculatorResult: currentValue });
    }
  };
});

function evaluateExpression(expression) {
  try {
    const result = math.evaluate(expression);
    // Save the result to storage
    chrome.storage.local.set({ calculatorResult: result });
    return result;
  } catch (error) {
    console.error("Error evaluating expression:", error);
    // Remove the value from local storage
    chrome.storage.local.remove("calculatorResult");
    return "Error!";
  }
}

const themeToggleBtn = document.querySelector(".theme-toggler");
const calculator = document.querySelector(".calculator");
const toggleIcon = document.querySelector(".toggler-icon");
let isDark = true;

// Load the previous theme from storage
chrome.storage.local.get("calculatorTheme", (data) => {
  const savedTheme = data.calculatorTheme;
  if (data.calculatorTheme === undefined) {
    chrome.storage.local.set({ calculatorTheme: "dark" });
  } else if (savedTheme === "dark") {
    calculator.classList.add("dark");
    themeToggleBtn.classList.add("active");
    isDark = true;
  } else {
    calculator.classList.remove("dark");
    themeToggleBtn.classList.remove("active");
    isDark = false;
  }
});

themeToggleBtn.onclick = () => {
  calculator.classList.toggle("dark");
  themeToggleBtn.classList.toggle("active");
  isDark = !isDark;
  // Save the current theme to storage
  const theme = isDark ? "dark" : "light";
  chrome.storage.local.set({ calculatorTheme: theme });
};
