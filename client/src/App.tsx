import { useProfile } from './hooks/useProfile';
import Header from './components/Header';
import Footer from './components/Footer';
import ProfileSelection from './components/ProfileSelection';
import MainContent from './components/MainContent';
import { TooltipProvider } from "@/components/ui/tooltip";

function App() {
  const { userProfile, setUserProfile } = useProfile();

  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        {userProfile ? (
          <MainContent userProfile={userProfile} />
        ) : (
          <ProfileSelection setUserProfile={setUserProfile} />
        )}
        
        {userProfile && <Footer userProfile={userProfile} setUserProfile={setUserProfile} />}
      </div>
    </TooltipProvider>
  );
}

export default App;
