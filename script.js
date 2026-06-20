document.addEventListener("DOMContentLoaded", () => {
  const themeBtn = document.querySelector("#theme-toggle");
  const form = document.querySelector("#task-form");
  const input = document.querySelector("#task-title");
  const category = document.querySelector("#task-category");
  const list = document.querySelector("#task-list");

  const search = document.querySelector("#search-input");
  const filter = document.querySelector("#filter-category");
  const clearBtn = document.querySelector("#clear-all-btn");

  const pendingEl = document.querySelector("#pending-count");
  const completedEl = document.querySelector("#completed-count");

  let tasks = JSON.parse(localStorage.getItem("dom_lab_tasks")) || [];

  function save() {
    localStorage.setItem("dom_lab_tasks", JSON.stringify(tasks));
  }

  function updateUI() {
    save();

    const pending = tasks.filter((t) => t.status === "pending").length;
    const done = tasks.filter((t) => t.status === "completed").length;

    pendingEl.textContent = pending;
    completedEl.textContent = done;

    render();
  }

  function render() {
    list.innerHTML = "";

    const q = search.value.toLowerCase().trim();
    const cat = filter.value;

    const filtered = tasks.filter((t) => {
      return (
        t.title.toLowerCase().includes(q) &&
        (cat === "all" || t.category === cat)
      );
    });

    if (!filtered.length) {
      list.innerHTML = `<p style="text-align:center; padding:1rem;">No tasks</p>`;
      return;
    }

    filtered.forEach((task) => {
      const div = document.createElement("div");
      div.className = "task-card";
      div.dataset.id = task.id;
      div.dataset.status = task.status;

      div.innerHTML = `
        <div class="task-text">
          <span class="task-meta">${task.category}</span>
          <span>${task.title}</span>
        </div>

        <div class="task-actions">
          <button class="btn ${task.status === "completed" ? "btn-warning" : "btn-success"} toggle-status-btn">
            ${task.status === "completed" ? "Undo" : "Done"}
          </button>

          <button class="btn btn-blue edit-task-btn">Edit</button>
          <button class="btn btn-danger delete-task-btn">Delete</button>
        </div>
      `;

      list.appendChild(div);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const val = input.value.trim();
    if (!val) return alert("Empty task");

    const newTask = {
      id: Date.now().toString(),
      title: val,
      category: category.value,
      status: "pending",
    };

    tasks.unshift(newTask);
    input.value = "";

    console.log("task added");
    updateUI();
  });

  list.addEventListener("click", (e) => {
    const btn = e.target;
    const card = btn.closest(".task-card");
    if (!card) return;

    const id = card.dataset.id;

    if (btn.classList.contains("toggle-status-btn")) {
      tasks = tasks.map((t) => {
        if (t.id === id) {
          t.status = t.status === "pending" ? "completed" : "pending";
        }
        return t;
      });
      updateUI();
    } else if (btn.classList.contains("edit-task-btn")) {
      const t = tasks.find((x) => x.id === id);
      const val = prompt("Edit task:", t.title);

      if (val && val.trim()) {
        t.title = val.trim();
        updateUI();
      }
    } else if (btn.classList.contains("delete-task-btn")) {
      tasks = tasks.filter((t) => t.id !== id);
      updateUI();
    }
  });

  search.addEventListener("input", render);
  filter.addEventListener("change", render);

  clearBtn.addEventListener("click", () => {
    if (confirm("Clear all?")) {
      tasks = [];
      updateUI();
    }
  });

  const savedTheme = localStorage.getItem("dom_lab_theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  themeBtn.textContent = savedTheme === "dark" ? "Light Mode" : "Dark Mode";

  themeBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("dom_lab_theme", next);

    themeBtn.textContent = next === "dark" ? "Light Mode" : "Dark Mode";
  });

  const demoInput = document.getElementById("demo-input");
  const showBtn = document.getElementById("show-diff-btn");
  const out1 = document.getElementById("prop-output");
  const out2 = document.getElementById("attr-output");

  showBtn.addEventListener("click", () => {
    out1.textContent = demoInput.value;
    out2.textContent = demoInput.getAttribute("value");
  });

  const gp = document.querySelector("#grandparent");
  const parent = document.querySelector("#parent");
  const child = document.querySelector("#child-btn");

  const bubbleBtn = document.querySelector("#btn-bubbling-toggle");
  const captureBtn = document.querySelector("#btn-capturing-toggle");

  const output = document.querySelector("#propagation-output");

  let mode = "";

  captureBtn.addEventListener("click", () => {
    mode = "capture";
    output.innerHTML = "Ready for Capturing...";
  });

  bubbleBtn.addEventListener("click", () => {
    mode = "bubble";
    output.innerHTML = "Ready for Bubbling...";
  });

  child.addEventListener("click", () => {
    if (mode === "capture") {
      output.innerHTML = "Grandparent → Parent → Child";
    } else if (mode === "bubble") {
      output.innerHTML = "Child → Parent → Grandparent";
    } else {
      output.innerHTML = "Select mode first";
    }
  });

  updateUI();
});
