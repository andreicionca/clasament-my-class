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
    const tableBody = document
      .getElementById("mediaTable")
      .querySelector("tbody");

    // Curăță tabelul
    tableBody.innerHTML = "";

    console.log(`Fetching data for student ID: ${studentId}`); // Adăugare log pentru debugging

    // Fetch all grades from Supabase
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("grade", { ascending: false });

    if (error) {
      console.error("Error fetching student data:", error);
      alert("Eroare la preluarea datelor. Te rugăm să încerci din nou.");
      resultDiv.classList.add("hidden");
      return;
    }

    console.log("Data fetched:", data); // Adăugare log pentru debugging

    if (data && data.length > 0) {
      resultDiv.classList.remove("hidden");
      data.forEach((student) => {
        const isCurrentStudent = student.id === studentId;
        tableBody.innerHTML += `
                <tr>
                    <td>${isCurrentStudent ? student.name : ""}</td>
                    <td>${student.grade}</td>
                </tr>
            `;
      });
    } else {
      console.log("No data found"); // Adăugare log pentru debugging
      alert("Nu s-au găsit date.");
      resultDiv.classList.add("hidden");
    }
  });
