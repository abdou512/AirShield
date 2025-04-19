import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/login", credentials);
      
      // Stockage du token dans le localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      // Ajout du token à tous les futurs appels API
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
      
      // Redirection vers la page d'accueil ou le dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Erreur de connexion:", error);
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data?.error || "Impossible de se connecter. Veuillez vérifier vos identifiants.");
      } else {
        setError("Une erreur inconnue s'est produite.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <h2>Connexion</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            Vous n'avez pas de compte ?{" "}
            <a href="/register" className="link">
              S'inscrire
            </a>
          </p>
          <a href="/forgot-password" className="link">
            Mot de passe oublié ?
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;