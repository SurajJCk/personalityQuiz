import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { personalityResults } from "@/data/quiz";
import { Share2, Instagram, RotateCcw } from "lucide-react";
import { mp } from '../mixpanel';
import { useEffect } from 'react';

export default function Result() {
  const [location, setLocation] = useLocation();
  const personality = location.split("/").pop() || "";
  const result = personalityResults[personality];

  if (!result) {
    setLocation("/");
    return null;
  }

  useEffect(() => {
    // Track when user completes the quiz
    if (personality) {
      mp.trackGameCompleted(personality);
      console.log('✅ Quiz completed - Mixpanel event tracked', { personality });
      
      // Track thank you popup shown
      mp.trackThankYouPopupReceived();
      console.log('✅ Thank you popup shown - Mixpanel event tracked');
    }
  }, [personality]);

  const shareResult = async () => {
    try {
      const text = `I am ${result.name} - ${result.title} in Shiva's Squad! Take the quiz to discover your personality: ${window.location.origin}`;

      const canNativeShare = typeof navigator.share === 'function';

      // Track share attempt
      mp.track('personality_result_share_attempted', {
        personality: personality,
        share_method: canNativeShare ? 'native_share' : 'clipboard'
      });

      if (canNativeShare) {
        await navigator.share({
          title: "My Shiva Squad Personality",
          text: text,
          url: window.location.href
        });
        
        // Track successful native share
        mp.track('personality_result_shared', {
          personality: personality,
          share_method: 'native_share'
        });
      } else {
        await navigator.clipboard.writeText(text);
        alert("Result copied to clipboard!");
        
        // Track successful clipboard share
        mp.track('personality_result_shared', {
          personality: personality,
          share_method: 'clipboard'
        });
      }
    } catch (error) {
      console.error('❌ Error sharing result:', error);
      
      // Track share error
      mp.track('personality_result_share_error', {
        personality: personality,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  const handleThankYouClick = () => {
    try {
      mp.trackThankYouPopupClicked();
      console.log('✅ Thank you popup clicked - Mixpanel event tracked');
      // Your existing click handler logic
    } catch (error) {
      console.error('❌ Error tracking thank you click:', error);
    }
  };

  return (
    <div 
      className="min-h-screen bg-fixed bg-cover bg-center bg-no-repeat p-4 flex flex-col items-center justify-center" 
      style={{ 
        backgroundImage: 'url("/images/BGblue.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      
      
      <Card className="w-full max-w-2xl bg-black/90 backdrop-blur-sm border-none rounded-3xl">
        <CardContent className="p-6 space-y-6">
        <div className="text-center space-y-1">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">
              Your Shiva Squad
            </h1>
            <h2 className="text-2xl font-bold text-white drop-shadow-lg">
              Personality Type
            </h2>
            
          </div>
          <div className="relative overflow-hidden rounded-3xl w-81 h-81 mx-auto">
            <img 
              src={result.image} 
              alt={result.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-white">{result.name}</h1>
            <h2 className="text-xl text-yellow-400">{result.title}</h2>
          </div>
          <p className="text-gray-100 text-lg leading-relaxed">
            {result.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <div className="flex justify-center">
              <Button
                onClick={() => setLocation("/")}
                className="w-64 bg-[#303f9f] hover:bg-[#3949ab] text-white px-6 py-3 rounded-full"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Take Quiz Again
              </Button>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={shareResult}
                className="w-64 bg-[#303f9f] hover:bg-[#3949ab] text-white px-6 py-3 rounded-full"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share with Friends
              </Button>
            </div>
          </div>

          {/* Contest Section */}
          <div className="mt-8 p-6 bg-gradient-to-br from-[#6B4BF7] to-[#9B6BF8] rounded-3xl space-y-4 text-white">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-300 text-xl">✨</span>
              <h3 className="text-xl font-bold">Mahashivratri Contest</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📱</span>
                <p>Take a screenshot of your personality type</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">📝</span>
                <p>Post with <b>#MyShivaSquadType</b></p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🎁</span>
                <p>Stand a chance to win 1 MONTH of Sadhguru Exclusive for Free! 🎯</p>
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                className="w-64 bg-gradient-to-r from-[#FD1D1D] via-[#E1306C] to-[#833AB4] hover:opacity-90 text-white mt-4 px-6 py-3 rounded-full"
                onClick={() => window.open('https://www.instagram.com', '_blank')}
              >
                <Instagram className="mr-2 h-5 w-5" />
                <span>Share on Instagram</span>
              </Button>
            </div>
          </div>

          {/* Bonus Section */}
          <div className="bg-gradient-to-br from-[#6B4BF7] to-[#9B6BF8] p-6 rounded-3xl space-y-4 text-white">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-300 text-xl">✨</span>
              <h3 className="text-xl font-bold">Bonus ✨</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📺</span>
                <p>Watch <b>Shiva Series for FREE</b></p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">📅</span>
                <p>Until 28 February</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">📱</span>
                <p>Available on Sadhguru App</p>
              </div>
            </div>
            <div className="flex justify-center">
              <Button 
                className="w-64 bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] hover:opacity-90 text-white px-6 py-3 rounded-full"
                onClick={() => window.open('https://sgapp.sng.link/Acxyc/i669/f22i', '_blank')}
              >
                Watch Now
                
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}