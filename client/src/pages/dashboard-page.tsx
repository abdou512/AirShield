import { useAuth } from "@/hooks/use-auth";
import { useProfile } from '@/hooks/useProfile';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MainContent from '@/components/MainContent';
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const { userProfile, setUserProfile } = useProfile();

  // Set the user profile from the user data if available
  if (user && !userProfile) {
    setUserProfile(user.profile === 'sensible' ? 'sensible' : 'public');
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {userProfile ? (
        <MainContent userProfile={userProfile} />
      ) : (
        <div className="flex items-center justify-center flex-grow">
          <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
        </div>
      )}
      
      {userProfile && <Footer userProfile={userProfile} setUserProfile={setUserProfile} />}
    </div>
  );
}