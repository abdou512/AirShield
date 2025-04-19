import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, useRoute } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Link } from "wouter";
import { insertUserSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Wind, ChevronLeft } from "lucide-react";

// Extend the user schema for login (just username and password)
const loginSchema = insertUserSchema.pick({ username: true, password: true });

// Extend the user schema for registration and add password confirmation
const registerSchema = z.object({
  firstname: z.string().min(1, "Prénom requis"),
  lastname: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  age: z.coerce.number().min(1, "Âge requis"),
  sexe: z.enum(["Homme", "Femme", "Autre"]),
  illness: z.array(z.string()).optional(),
  allergy: z.array(z.string()).optional(),
  password: z.string().min(6, "Mot de passe requis"),
  confirmPassword: z.string().min(6, "Confirmation requise")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"]
});


type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, isLoading, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();
  const [, params] = useRoute("/auth");

  // Check URL parameters for active tab
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  useEffect(() => {
    // Check if the URL has a register parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("register") === "true") {
      setActiveTab("register");
    }
  }, []);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Registration form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      age: 0,
      sexe: "Homme",
      illness: [],
      allergy: [],
      password: "",
      confirmPassword: ""
    }

  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  async function onLoginSubmit(data: LoginFormValues) {
    await loginMutation.mutateAsync(data);
  }

  async function onRegisterSubmit(data: RegisterFormValues) {
    // Remove the confirmPassword field which isn't in the API schema
    const { confirmPassword, ...userData } = data;

    // Set a default display name if not provided
    if (!userData.display_name) {
      userData.display_name = userData.username;
    }

    await registerMutation.mutateAsync(userData);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left column - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto max-w-md w-full">
          <div className="flex items-center mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-2 p-0 h-9 w-9">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center ml-1">
              <Wind className="h-6 w-6 text-sky-600 mr-2" />
              <span className="text-xl font-semibold text-slate-900">AirShield</span>
            </div>
          </div>

          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="register">Inscription</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Connexion</CardTitle>
                  <CardDescription>
                    Entrez vos identifiants pour accéder à votre compte
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom d'utilisateur</FormLabel>
                            <FormControl>
                              <Input placeholder="Entrez votre nom d'utilisateur" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Connexion en cours...
                          </>
                        ) : (
                          "Se connecter"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="text-center text-sm text-slate-600 mt-2">
                    Vous n'avez pas de compte ?{" "}
                    <button
                      onClick={() => setActiveTab("register")}
                      className="text-sky-600 hover:underline font-medium"
                    >
                      Inscrivez-vous
                    </button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Inscription</CardTitle>
                  <CardDescription>
                    Créez un compte pour accéder à toutes les fonctionnalités
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">

                      {/* Prénom */}
                      <FormField
                        control={registerForm.control}
                        name="firstname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prénom</FormLabel>
                            <FormControl>
                              <Input placeholder="Jean" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Nom */}
                      <FormField
                        control={registerForm.control}
                        name="lastname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                              <Input placeholder="Dupont" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Email */}
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="exemple@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Mot de passe */}
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Confirmation mot de passe */}
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmer le mot de passe</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Sexe */}
                      <FormField
                        control={registerForm.control}
                        name="sexe"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sexe</FormLabel>
                            <FormControl>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                {...field}
                              >
                                <option value="">Sélectionnez...</option>
                                <option value="Homme">Homme</option>
                                <option value="Femme">Femme</option>
                                <option value="Autre">Autre</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Âge */}
                      <FormField
                        control={registerForm.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Âge</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" placeholder="30" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Maladies (illness) */}
                      <FormField
                        control={registerForm.control}
                        name="illness"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maladies (si applicable)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="ex: asthme, diabète"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value.split(',').map(str => str.trim()))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Allergies (allergy) */}
                      <FormField
                        control={registerForm.control}
                        name="allergy"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Allergies (si applicable)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="ex: pollen, arachides"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value.split(',').map(str => str.trim()))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full">
                        Créer un compte
                      </Button>
                    </form>
                  </Form>

                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="text-center text-sm text-slate-600 mt-2">
                    Vous avez déjà un compte ?{" "}
                    <button
                      onClick={() => setActiveTab("login")}
                      className="text-sky-600 hover:underline font-medium"
                    >
                      Connectez-vous
                    </button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right column - Hero */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-600">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold mb-6">Bienvenue sur AirShield</h2>
            <p className="text-lg mb-8 text-sky-100">
              Votre plateforme pour surveiller la qualité de l'air, les niveaux de pollen et les conditions météorologiques en temps réel.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 p-1.5 rounded-full bg-sky-400/10 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Données personnalisées</h3>
                  <p className="text-sky-100 text-sm">Recevez des informations adaptées à votre profil, qu'il soit sensible ou grand public.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 p-1.5 rounded-full bg-sky-400/10 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Alertes en temps réel</h3>
                  <p className="text-sky-100 text-sm">Soyez informé immédiatement en cas de changements importants dans votre environnement.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 p-1.5 rounded-full bg-sky-400/10 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Historique des données</h3>
                  <p className="text-sky-100 text-sm">Suivez l'évolution des conditions environnementales au fil du temps.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}