const API = "http://localhost:8080/api/students";
const studentsBody = document.getElementById("studentsBody");
const noData = document.getElementById("noData");
const tableWrap = document.getElementById("tableWrap");

document.getElementById("btn-show").addEventListener("click", fetchAll);
document.getElementById("btn-add").addEventListener("click", openAddModal);
document.getElementById("btn-clear").addEventListener("click", clearAll);

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalClose = document.getElementById("modalClose");
const studentForm = document.getElementById("studentForm");
const cancelBtn = document.getElementById("cancelBtn");

modalClose.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);
studentForm.addEventListener("submit", onSave);

// initial fetch
fetchAll();

function showLoadingState() {
  studentsBody.innerHTML = `<tr><td colspan="6">Loading…</td></tr>`;
  noData.style.display = "none";
}

async function fetchAll() {
  showLoadingState();
  try {
    const res = await fetch(API);
    const list = await res.json();
    renderTable(list);
  } catch (err) {
    studentsBody.innerHTML = `<tr><td colspan="6">Error fetching data.</td></tr>`;
  }
}

function renderTable(list) {
  if (!Array.isArray(list) || list.length === 0) {
    studentsBody.innerHTML = "";
    noData.style.display = "block";
    return;
  }
  noData.style.display = "none";
  studentsBody.innerHTML = "";
  // render each student
  list.forEach((s, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.id ?? i+1}</td>
      <td>${escapeHtml(s.name)}</td>
      <td>${escapeHtml(s.registrationNumber)}</td>
      <td>${Array.isArray(s.courses) ? escapeHtml(s.courses.join(", ")) : ""}</td>
      <td>${escapeHtml(s.projectGroup)}</td>
      <td class="row-actions">
        <button class="btn" onclick="openEdit(${s.id})">Edit</button>
        <button class="btn warn" onclick="remove(${s.id})">Delete</button>
      </td>
    `;
    studentsBody.appendChild(tr);
  });
}

function openAddModal() {
  modalTitle.textContent = "Add Student";
  studentForm.reset();
  document.getElementById("studentId").value = "";
  openModal();
}

async function openEdit(id) {
  // fetch that student
  try {
    const res = await fetch(`${API}/${id}`);
    if (!res.ok) {
      alert("Student not found");
      return;
    }
    const s = await res.json();
    modalTitle.textContent = "Edit Student";
    document.getElementById("studentId").value = s.id;
    document.getElementById("name").value = s.name || "";
    document.getElementById("regNo").value = s.registrationNumber || "";
    document.getElementById("courses").value = Array.isArray(s.courses) ? s.courses.join(", ") : "";
    document.getElementById("group").value = s.projectGroup || "";
    openModal();
  } catch (err) {
    alert("Failed to fetch student");
  }
}

function openModal() {
  modal.classList.remove("hidden");
}
function closeModal() {
  modal.classList.add("hidden");
}

async function onSave(e) {
  e.preventDefault();
  const id = document.getElementById("studentId").value;
  const name = document.getElementById("name").value.trim();
  const regNo = document.getElementById("regNo").value.trim();
  const coursesRaw = document.getElementById("courses").value.trim();
  const group = document.getElementById("group").value.trim();

  if (!name || !regNo) {
    alert("Name and registration number are required.");
    return;
  }

  const payload = {
    name,
    registrationNumber: regNo,
    courses: coursesRaw ? coursesRaw.split(",").map(s => s.trim()).filter(Boolean) : [],
    projectGroup: group
  };

  try {
    let res;
    if (id) {
      res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(payload)
      });
    } else {
      res = await fetch(API, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(payload)
      });
    }

    if (!res.ok) {
      const txt = await res.text();
      alert("Error: " + txt);
      return;
    }

    closeModal();
    fetchAll();
  } catch (err) {
    alert("Save failed");
  }
}

async function remove(id) {
  if (!confirm("Delete this student?")) return;
  try {
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const txt = await res.text();
      alert("Error: " + txt);
      return;
    }
    fetchAll();
  } catch (err) {
    alert("Delete failed");
  }
}

async function clearAll() {
  if (!confirm("Delete ALL students? This cannot be undone.")) return;
  try {
    const res = await fetch(API, { method: "DELETE" });
    if (!res.ok) {
      alert("Failed to clear");
      return;
    }
    fetchAll();
  } catch (err) {
    alert("Clear failed");
  }
}

function escapeHtml(unsafe){
  if (!unsafe && unsafe !== 0) return "";
  return String(unsafe)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}
