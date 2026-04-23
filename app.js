const FOCUS_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

const modeLabel = document.getElementById("modeLabel");
const timeDisplay = document.getElementById("timeDisplay");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const switchBtn = document.getElementById("switchBtn");
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const doneCount = document.getElementById("doneCount");

let isFocusMode = true;
let secondsLeft = FOCUS_SECONDS;
let intervalId = null;
let completed = 0;

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function renderTime() {
  timeDisplay.textContent = formatTime(secondsLeft);
  modeLabel.textContent = isFocusMode ? "Focus Mode" : "Break Mode";
}

function stopTimer() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function startTimer() {
  if (intervalId) {
    return;
  }

  intervalId = setInterval(() => {
    secondsLeft -= 1;
    renderTime();

    if (secondsLeft <= 0) {
      stopTimer();
      alert(isFocusMode ? "Focus session complete. Take a break." : "Break complete. Back to focus.");
      isFocusMode = !isFocusMode;
      secondsLeft = isFocusMode ? FOCUS_SECONDS : BREAK_SECONDS;
      renderTime();
    }
  }, 1000);
}

function resetTimer() {
  stopTimer();
  secondsLeft = isFocusMode ? FOCUS_SECONDS : BREAK_SECONDS;
  renderTime();
}

function switchMode() {
  isFocusMode = !isFocusMode;
  resetTimer();
}

function addTask(text) {
  const item = document.createElement("li");
  item.className = "task-item";

  const label = document.createElement("span");
  label.textContent = text;

  const toggleBtn = document.createElement("button");
  toggleBtn.className = "done-btn";
  toggleBtn.textContent = "Done";

  toggleBtn.addEventListener("click", () => {
    const alreadyDone = item.classList.contains("done");
    item.classList.toggle("done");
    toggleBtn.textContent = alreadyDone ? "Done" : "Undo";

    completed += alreadyDone ? -1 : 1;
    doneCount.textContent = String(completed);
  });

  item.append(label, toggleBtn);
  taskList.appendChild(item);
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", stopTimer);
resetBtn.addEventListener("click", resetTimer);
switchBtn.addEventListener("click", switchMode);

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const task = taskInput.value.trim();

  if (!task) {
    return;
  }

  addTask(task);
  taskInput.value = "";
});

renderTime();