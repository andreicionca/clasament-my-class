import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

document
  .getElementById("mediaForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const studentId = document
      .getElementById("studentId")
      .value.toLowerCase()
      .trim();
    const resultDiv = document.getElementById("result");
    const messageContainer = document.getElementById("message-container");
    const messageDiv = document.getElementById("message");
    const tableBody = document
      .getElementById("mediaTable")
      .querySelector("tbody");

    // Reset
    tableBody.innerHTML = "";
    messageContainer.classList.add("hidden");
    messageDiv.classList.remove("error", "success");

    // Verificare parolă
    const { data: studentData, error: studentError } = await supabase
      .from("students")
      .select("*")
      .eq("id", studentId)
      .single();

    if (studentError || !studentData) {
      messageDiv.textContent = "Parola incorectă. Te rugăm să încerci din nou.";
      messageDiv.classList.add("error");
      messageContainer.classList.remove("hidden");
      resultDiv.classList.add("hidden");
      return;
    }

    // Obține toți elevii
    const { data, error } = await supabase.from("students").select("*");

    if (error || !data) {
      messageDiv.textContent = "Eroare la preluarea datelor.";
      messageDiv.classList.add("error");
      messageContainer.classList.remove("hidden");
      resultDiv.classList.add("hidden");
      return;
    }

    // Sortează: întâi cei cu medie numerică ≥ 5, apoi restul
    const sortedData = [...data].sort((a, b) => {
      const aNum = parseFloat(a.grade);
      const bNum = parseFloat(b.grade);

      const isANum = !isNaN(aNum);
      const isBNum = !isNaN(bNum);

      if (isANum && isBNum) return bNum - aNum;
      if (isANum && !isBNum) return -1;
      if (!isANum && isBNum) return 1;
      return 0;
    });

    resultDiv.classList.remove("hidden");
    messageDiv.textContent = "Datele au fost incărcate cu succes.";
    messageDiv.classList.add("success");
    messageContainer.classList.remove("hidden");

    sortedData.forEach((student) => {
      const isCurrent = student.id === studentId;
      const isCorigent = typeof student.grade !== "number" || student.grade < 5;

      tableBody.innerHTML += `
        <tr class="${isCurrent ? "highlight" : ""} ${
        isCorigent ? "corigent" : ""
      }">
          <td>${isCurrent ? student.name : ""}</td>
          <td>${student.grade}</td>
          <td>${student.rank ?? ""}</td>
        </tr>
      `;
    });
  });
