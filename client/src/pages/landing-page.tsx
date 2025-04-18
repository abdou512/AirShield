import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { Loader2, Wind, Thermometer, CloudRain, Leaf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    );
  }

  if (user) {
    window.location.href = "/dashboard";
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar with subtle gradient background change on scroll */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md" : "bg-transparent"}`}>
        <div className="container mx-auto py-4 px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Wind className="h-6 w-6 text-sky-600" />
            <span className="text-xl font-semibold text-slate-900">AirShield</span>
          </div>
          <nav className="flex items-center space-x-4">
            <a href="#features" className="text-slate-700 hover:text-sky-600 transition-colors">
              Fonctionnalités
            </a>
            <a href="#how-it-works" className="text-slate-700 hover:text-sky-600 transition-colors">
              Comment ça marche
            </a>
            <Link href="/auth">
              <Button variant="outline" className="ml-2">
                Connexion
              </Button>
            </Link>
            <Link href="/auth?register=true">
              <Button className="bg-sky-600 hover:bg-sky-700">
                Inscription
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-sky-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                Surveillez <span className="text-sky-600">l'air que vous respirez</span> au quotidien
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                Accédez aux informations en temps réel sur la qualité de l'air, les niveaux de pollen et les conditions météorologiques dans votre région pour prendre soin de votre santé.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/auth?register=true">
                  <Button size="lg" className="bg-sky-600 hover:bg-sky-700">
                    Commencer maintenant
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline">
                    Découvrir les fonctionnalités
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-xl border border-slate-200 bg-white p-2">
              <div className="aspect-[4/3] relative rounded-lg overflow-hidden bg-slate-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 p-4 w-full">
                    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                      <div className="p-2 rounded-full bg-emerald-50 mb-2">
                        <Thermometer className="h-6 w-6 text-emerald-600" />
                      </div>
                      <span className="text-sm text-slate-600">Température</span>
                      <span className="text-xl font-bold text-slate-900">23°C</span>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                      <div className="p-2 rounded-full bg-sky-50 mb-2">
                        <Wind className="h-6 w-6 text-sky-600" />
                      </div>
                      <span className="text-sm text-slate-600">Qualité de l'air</span>
                      <span className="text-xl font-bold text-green-600">Bonne</span>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                      <div className="p-2 rounded-full bg-amber-50 mb-2">
                        <Leaf className="h-6 w-6 text-amber-600" />
                      </div>
                      <span className="text-sm text-slate-600">Pollen</span>
                      <span className="text-xl font-bold text-amber-600">Moyen</span>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                      <div className="p-2 rounded-full bg-blue-50 mb-2">
                        <CloudRain className="h-6 w-6 text-blue-600" />
                      </div>
                      <span className="text-sm text-slate-600">Précipitation</span>
                      <span className="text-xl font-bold text-slate-900">0%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Fonctionnalités principales</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Découvrez comment AirShield peut vous aider à mieux comprendre et surveiller votre environnement.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="p-3 rounded-full bg-blue-50 inline-block mb-4">
                  <Wind className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Qualité de l'air en temps réel</h3>
                <p className="text-slate-600">
                  Suivez les niveaux de polluants et recevez des alertes lorsque la qualité de l'air se dégrade.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="p-3 rounded-full bg-amber-50 inline-block mb-4">
                  <Leaf className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Surveillance du pollen</h3>
                <p className="text-slate-600">
                  Consultez les niveaux de pollen et plantez au moment opportun pour réduire les symptômes d'allergies.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="p-3 rounded-full bg-emerald-50 inline-block mb-4">
                  <Thermometer className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Prévisions météorologiques</h3>
                <p className="text-slate-600">
                  Obtenez des prévisions précises adaptées à vos besoins de santé et planifiez vos activités en conséquence.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Comment ça marche</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            AirShield est simple à utiliser et vous donne accès à des informations précises en quelques clics.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-lg mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Créez un compte</h3>
              <p className="text-slate-600">
                Inscrivez-vous gratuitement et choisissez votre profil utilisateur pour des recommandations personnalisées.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-lg mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Activez la localisation</h3>
              <p className="text-slate-600">
                Autorisez l'accès à votre position pour obtenir des données précises pour votre emplacement actuel.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-lg mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Consultez vos données</h3>
              <p className="text-slate-600">
                Accédez au tableau de bord pour voir toutes les informations environnementales pertinentes en un coup d'œil.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-sky-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à prendre soin de votre santé ?</h2>
          <p className="text-lg text-sky-100 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui font confiance à AirVision pour rester informés sur leur environnement.
          </p>
          <Link href="/auth?register=true">
            <Button size="lg" variant="secondary" className="bg-white text-sky-700 hover:bg-sky-50">
              Créer un compte gratuit
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-slate-300">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Wind className="h-6 w-6 text-sky-400" />
                <span className="text-xl font-semibold text-white">AirShield</span>
              </div>
              <p className="text-slate-400">
                Votre compagnon pour surveiller la qualité de l'air et les conditions environnementales.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Navigation</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-slate-400 hover:text-white transition-colors">
                    Accueil
                  </a>
                </li>
                <li>
                  <a href="#features" className="text-slate-400 hover:text-white transition-colors">
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-slate-400 hover:text-white transition-colors">
                    Comment ça marche
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Légal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">
                    Conditions d'utilisation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">
                    Politique de confidentialité
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">
                    Mentions légales
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <p className="text-slate-400 mb-2">
                contact@AirShield.example.com
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-800 text-center text-slate-400">
            <p>© {new Date().getFullYear()} AirShield. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}