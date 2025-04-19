import requests

def query_mistral(prompt, api_key):
    # Endpoint de l'API Mistral
    api_url = "https://api.mistral.ai/v1/chat/completions"
    
    # Headers avec la clé API
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    # Payload contenant les paramètres de la requête
    payload = {
        "model": "mistral-small-latest",  # Modèle à utiliser
        "messages": [
            {"role": "system", "content": "Tu es un expert en santé respiratoire et qualité de l'air."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.9,  # Contrôle la créativité de la réponse
        "max_tokens": 400    # Limite le nombre de tokens générés
    }
    
    try:
        # Envoi de la requête POST à l'API
        response = requests.post(api_url, json=payload, headers=headers)
        
        # Vérification du statut de la réponse
        if response.status_code == 200:
            data = response.json()
            return data.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
        elif response.status_code == 429:
            print("[ERREUR] Limite de quota atteinte. Réessayez demain.")
        else:
            print(f"[ERREUR] Code HTTP : {response.status_code}")
            print(f"[ERREUR] Message : {response.text}")
    
    except requests.exceptions.RequestException as e:
        print(f"[ERREUR] Problème de connexion : {e}")
    
    return None


def generate_prompt(age, sexe, allergies, poids, taille, traitement, maladies,
                    pm10, pm25, co, no2, o3):
    """
    Génère un prompt personnalisé en fonction des données fournies.
    """
    prompt = f"""
    Tu es un assistant expert en santé respiratoire et qualité de l'air.

    Voici les données personnelles de l'utilisateur :
    - Âge : {age} ans
    - Sexe : {sexe}
    - Allergies : {allergies}
    - Poids : {poids} kg
    - Taille : {taille} cm
    - Traitement en cours : {traitement}
    - Maladies : {maladies}

    Données environnementales actuelles :
    - PM10 : {pm10} µg/m³
    - PM2.5 : {pm25} µg/m³
    - CO : {co} µg/m³
    - NO₂ : {no2} µg/m³
    - O₃ : {o3} µg/m³
    - Degré du pollen :  
        - Bouleau : 2
        - Graminées : 1
        - Armoise : 0
        - Ambroisie :0
        - Olivier : 3
        - Aulne : 2

    Analysez ces données et proposez des recommandations PERSONNALISÉES à cette personne selon ses données personnelles et les données de l'environnement présentes sous **format YAML**.  
    Respectez **strictement** cette structure :  

    ```yaml
    Effets possibles des données environnementales actuelles sur la santé de la personne visée:
        1. <conseil1>
        2. <conseil2>
        3. <conseil3>
    Conseils personnalisés selon la situation et l'état sanitaire de la personne : 
        1. <conseil1>
        2. <conseil2>
        3. <conseil3>
    ```

    ### IMPORTANT
    Sois clair, concis, bienveillant et accessible, même pour une personne non experte.
    """
    return prompt


if __name__ == "__main__":
    # Votre clé API
    api_key = "M8SH1ML7lbSA6Qm4B7EzzaDeJEGYb7m0"
    
    # Données personnelles et environnementales (variables dynamiques)
    age = 25
    sexe = "Femme"
    allergies = "pollen"
    poids = 53
    taille = 153
    traitement = ""
    maladies = "asthme"
    pm10 = 45
    pm25 = 35
    co = 0.6
    no2 = 72
    o3 = 95
    

    # Génération du prompt
    prompt = generate_prompt(age, sexe, allergies, poids, taille, traitement, maladies,
                             pm10, pm25, co, no2, o3)

    # Appel à l'API Mistral
    response = query_mistral(prompt, api_key)
    
    # Affichage de la réponse
    if response:
        print("\nRéponse finale :")
        print(response)
