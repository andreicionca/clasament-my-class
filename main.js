import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

document
  .getElementById("mediaForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const studentId = document.getElementById("studentId").value;
    const resultDiv = document.getElementById("result");
    const messageContainer = document.getElementById("message-container");
    const messageDiv = document.getElementById("message");
    const tableBody = document
      .getElementById("mediaTable")
      .querySelector("tbody");

    // Curăță mesajele și tabelul
    tableBody.innerHTML = "";
    messageContainer.classList.add("hidden");
    messageDiv.classList.remove("error", "success");

    console.log(`Fetching data for student ID: ${studentId}`); // Adăugare log pentru debugging

    // Verifică dacă ID-ul introdus există în baza de date
    const { data: studentData, error: studentError } = await supabase
      .from("students")
      .select("*")
      .eq("id", studentId)
      .single();

    if (studentError || !studentData) {
      console.error("Student not found:", studentError);
      messageDiv.textContent =
        "Id-ul introdus nu a fost găsit. Te rugăm să încerci din nou.";
      messageDiv.classList.add("error");
      messageContainer.classList.remove("hidden");
      resultDiv.classList.add("hidden");
      return;
    }

    console.log("Student found:", studentData); // Adăugare log pentru debugging

    // Fetch all grades from Supabase
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("grade", { ascending: false });

    if (error) {
      console.error("Error fetching student data:", error);
      messageDiv.textContent =
        "Eroare la preluarea datelor. Te rugăm să încerci din nou.";
      messageDiv.classList.add("error");
      messageContainer.classList.remove("hidden");
      resultDiv.classList.add("hidden");
      return;
    }

    console.log("Data fetched:", data); // Adăugare log pentru debugging

    if (data && data.length > 0) {
      resultDiv.classList.remove("hidden");
      messageDiv.textContent = "Datele au fost preluate cu succes.";
      messageDiv.classList.add("success");
      messageContainer.classList.remove("hidden");
      data.forEach((student) => {
        const isCurrentStudent = student.id === studentId;
        tableBody.innerHTML += `
    <tr>
      <td>${isCurrentStudent ? student.name : ""}</td>
      <td>${student.grade}</td>
      <td>${student.rank ?? ""}</td>
    </tr>
  `;
      });
    } else {
      console.log("No data found"); // Adăugare log pentru debugging
      messageDiv.textContent = "Nu s-au găsit date.";
      messageDiv.classList.add("error");
      messageContainer.classList.remove("hidden");
      resultDiv.classList.add("hidden");
    }
  });
