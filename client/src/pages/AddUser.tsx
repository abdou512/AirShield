import React, { useState } from "react";
import axios from "axios";
import "./RegisterForm.css"; // Vous pouvez créer ce fichier CSS séparément

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    sexe: "H",
    illness: "",
    allergy: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    // Validation côté client simple
    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: "Les mots de passe ne correspondent pas", type: "error" });
      setLoading(false);
      return;
    }

    try {
      // Préparer les données exactement comme le modèle MongoDB les attend
      const userData = {
        username: formData.username,
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
        age: parseInt(formData.age, 10),
        sexe: formData.sexe,
        illness: formData.illness ? formData.illness.split(",").map(item => item.trim()).filter(Boolean) : [],
        allergy: formData.allergy ? formData.allergy.split(",").map(item => item.trim()).filter(Boolean) : []
      };

      console.log("Données envoyées:", userData); // Pour déboguer

      const response = await axios.post("/users", userData);
      
      setMessage({ text: "Inscription réussie!", type: "success" });
      setFormData({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
        age: "",
        sexe: "H",
        illness: "",
        allergy: ""
      });
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      const errorMessage = error.response?.data?.error || "Une erreur est survenue lors de l'inscription";
      setMessage({ text: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-wrapper">
        <h2>Créer un compte</h2>
        
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur*</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstname">Prénom*</label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastname">Nom*</label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">Âge*</label>
              <input
                type="number"
                id="age"
                name="age"
                min="1"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="sexe">Sexe*</label>
              <select
                id="sexe"
                name="sexe"
                value={formData.sexe}
                onChange={handleChange}
                required
              >
                <option value="H">Homme</option>
                <option value="F">Femme</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mot de passe*</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe*</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="illness">Maladies (séparées par des virgules)</label>
            <input
              type="text"
              id="illness"
              name="illness"
              value={formData.illness}
              onChange={handleChange}
              placeholder="Ex: asthme, diabète"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="allergy">Allergies (séparées par des virgules)</label>
            <input
              type="text"
              id="allergy"
              name="allergy"
              value={formData.allergy}
              onChange={handleChange}
              placeholder="Ex: arachides, lactose"
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? "Inscription en cours..." : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;