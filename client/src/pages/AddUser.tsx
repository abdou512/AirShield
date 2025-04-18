// src/components/UserForm.tsx
import React, { useState } from "react";

export const UserForm = () => {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    age: "",
    sexe: "H",
    illness: "",
    allergy: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = {
      firstname: form.firstname,
      lastname: form.lastname,
      email: form.email,
      password: form.password,
      age: parseInt(form.age, 10),
      sexe: form.sexe,
      illness: form.illness.split(",").map((s) => s.trim()).filter(Boolean),
      allergy: form.allergy.split(",").map((s) => s.trim()).filter(Boolean)
    };

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Utilisateur créé avec succès !");
        setForm({
          firstname: "",
          lastname: "",
          email: "",
          password: "",
          age: "",
          sexe: "H",
          illness: "",
          allergy: ""
        });
      } else {
        setMessage("❌ Erreur : " + JSON.stringify(data.error));
      }
    } catch (err) {
      setMessage("❌ Une erreur est survenue.");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>Créer un utilisateur</h2>

      <input name="firstname" placeholder="Prénom" value={form.firstname} onChange={handleChange} required />
      <input name="lastname" placeholder="Nom" value={form.lastname} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} required />
      <input type="number" name="age" placeholder="Âge" value={form.age} onChange={handleChange} required />
      
      <select name="sexe" value={form.sexe} onChange={handleChange} required>
        <option value="H">Homme</option>
        <option value="F">Femme</option>
        <option value="Autre">Autre</option>
      </select>

      <input name="illness" placeholder="Maladies (virgule entre chaque)" value={form.illness} onChange={handleChange} />
      <input name="allergy" placeholder="Allergies (virgule entre chaque)" value={form.allergy} onChange={handleChange} />

      <button type="submit">Créer l'utilisateur</button>

      {message && <p>{message}</p>}
    </form>
  );
};
export default UserForm;
