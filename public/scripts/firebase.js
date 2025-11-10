import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";
import {
  getDatabase,
  ref,
  push,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyA3-Fb37xemk2Pth-LW2l6ff7wx7G6tL7c",
  authDomain: "warriorsunitedfc-7223d.firebaseapp.com",
  projectId: "warriorsunitedfc-7223d",
  storageBucket: "warriorsunitedfc-7223d.firebasestorage.app",
  messagingSenderId: "845322147531",
  appId: "1:845322147531:web:445e06cd43e577579eed4e",
  measurementId: "G-DPWR5ZNBY5",
  databaseURL: "https://warriorsunitedfc-7223d-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);

const db = getDatabase(app);
const form = document.getElementById("registrationForm");
const modalEl = document.getElementById("registrationModal");
const statusEl = document.getElementById("formStatus");
const submitBtn = form?.querySelector(".submit-btn");

// Helpers
function setStatus(message, type) {
  if (!statusEl) return;
  statusEl.textContent = message || "";
  statusEl.className = "form-status" + (type ? ` ${type}` : "");
}

function setLoading(isLoading) {
  if (!submitBtn) return;
  submitBtn.disabled = isLoading;
  submitBtn.textContent = isLoading ? "Submitting..." : "SUBMIT REGISTRATION";
}

// Form submit handler
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setStatus("", "");
    setLoading(true);

    const formData = new FormData(form);

    const data = {
      firstName: (formData.get("firstName") || "").toString().trim(),
      lastName: (formData.get("lastName") || "").toString().trim(),
      email: (formData.get("email") || "").toString().trim(),
      phone: (formData.get("phone") || "").toString().trim(),
      age: formData.get("age") ? Number(formData.get("age")) : null,
      position: (formData.get("position") || "").toString(),
      experience: (formData.get("experience") || "").toString(),
      message: (formData.get("message") || "").toString(),
      createdAt: serverTimestamp(),
      source: "inlandempire.soccer"
    };

    const emailValid =
      data.email.includes("@") &&
      data.email.includes(".") &&
      !data.email.endsWith("@");

    if (
      !data.firstName ||
      !data.lastName ||
      !emailValid ||
      !data.age ||
      !data.position ||
      !data.experience
    ) {
      setStatus("Please complete all required fields with valid information.", "error");
      setLoading(false);
      return;
    }

    try {
      // Save registration to Firebase
      await push(ref(db, "registrations"), data);

      // Send confirmation email via Cloudflare Worker (Brevo)
      try {
        await fetch("https://warriors-email-worker.ixshelescamilla.workers.dev/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            firstName: data.firstName
          })
        });
      } catch (err) {
        console.warn("Email worker call failed:", err);
        // Do not block user if email fails
      }

      // UI success feedback
      setStatus("Registration received! Check your email for confirmation.", "success");
      form.reset();

      setTimeout(() => {
        if (modalEl) {
          modalEl.classList.remove("active");
          document.body.style.overflow = "auto";
        }
        setStatus("", "");
      }, 1500);

    } catch (error) {
      console.error("Error saving registration:", error);
      setStatus(
        "There was a problem submitting your registration. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  });
}