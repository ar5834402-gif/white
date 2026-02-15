import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useVerifyGirlfriend } from "@/hooks/use-auth";
import { usePublicProfile, useRedeemCoupon } from "@/hooks/use-content";
import { useQueryClient } from "@tanstack/react-query";
import { HeartRain } from "@/components/HeartRain";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Lock, Heart, Gift, Calendar as CalendarIcon } from "lucide-react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

export default function PublicView() {
  const { username } = useParams();
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const verifyMutation = useVerifyGirlfriend();
  const { data: profile, error, refetch } = usePublicProfile(username || "");
  
  // Unlock if already verified (or after verification)
  useEffect(() => {
    if (profile) setIsUnlocked(true);
  }, [profile]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    try {
      await verifyMutation.mutateAsync({ username, password });
      // On success, refetch the profile which should now succeed
      refetch();
    } catch {
      // Error handled by mutation state in UI
    }
  };

  if (error && error.message === "User not found") {
    return <div className="min-h-screen flex items-center justify-center text-rose-800">User not found :(</div>;
  }

  // --- LOCKED STATE ---
  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50 p-4">
        <Card className="w-full max-w-md border-none shadow-2xl">
           <CardHeader className="text-center space-y-4">
             <div className="mx-auto bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center">
               <Lock className="w-8 h-8 text-rose-500" />
             </div>
             <CardTitle className="text-2xl font-serif text-rose-800">This Page is Protected</CardTitle>
             <CardDescription>Enter the secret password he gave you.</CardDescription>
           </CardHeader>
           <CardContent>
             <form onSubmit={handleUnlock} className="space-y-4">
               <Input 
                 type="password" 
                 placeholder="Secret Password" 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="text-center text-lg"
               />
               {verifyMutation.isError && <p className="text-red-500 text-sm text-center">Incorrect password, try again.</p>}
               <Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600 h-12 text-lg" disabled={verifyMutation.isPending}>
                 {verifyMutation.isPending ? "Checking..." : "Unlock My Gift"}
               </Button>
             </form>
           </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-rose-50 pb-24">
      <HeartRain />
      
      {/* HERO SECTION */}
      <section className="h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-white/50 to-rose-50">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
          <h1 className="text-6xl md:text-8xl font-handwriting text-rose-600 mb-4">Happy White Day, {profile.girlfriendName}</h1>
          <p className="text-xl text-rose-800/60 font-serif italic max-w-2xl mx-auto">
            "A collection of moments, songs, and reasons why I love you."
          </p>
        </motion.div>
      </section>

      <div className="max-w-4xl mx-auto px-6 space-y-24">
        
        {/* TIMELINE SECTION */}
        <section>
          <div className="flex items-center justify-center gap-4 mb-12">
            <CalendarIcon className="text-rose-400" />
            <h2 className="text-3xl font-serif text-rose-800">Our Memories</h2>
          </div>
          
          <div className="relative space-y-12 pl-8 md:pl-0">
            <div className="timeline-line md:left-1/2" />
            
            {profile.memories.map((memory, index) => (
              <TimelineItem key={memory.id} memory={memory} index={index} />
            ))}
          </div>
        </section>

        {/* REASONS SECTION - Interactive Button */}
        <section className="text-center">
           <ReasonsButton reasons={profile.reasons} />
        </section>

        {/* COUPONS SECTION */}
        <section>
          <div className="flex items-center justify-center gap-4 mb-12">
            <Gift className="text-rose-400" />
            <h2 className="text-3xl font-serif text-rose-800">For You</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.coupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} username={username!} />
            ))}
          </div>
        </section>
      
      </div>

      <MusicPlayer playlist={profile.music} />
    </div>
  );
}

// --- SUB-COMPONENTS FOR PUBLIC VIEW ---

function TimelineItem({ memory, index }: { memory: any, index: number }) {
  const isEven = index % 2 === 0;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={`relative flex flex-col md:flex-row gap-8 ${isEven ? 'md:flex-row-reverse' : ''}`}
    >
      {/* Date Dot */}
      <div className="absolute left-[-2.2rem] md:left-1/2 md:ml-[-0.6rem] w-5 h-5 bg-rose-400 rounded-full border-4 border-white z-10" />
      
      <div className="flex-1 md:w-1/2" /> {/* Spacer */}
      
      <div className="flex-1 md:w-1/2 bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-rose-100">
        {memory.imageUrl && (
          <div className="mb-4 rounded-xl overflow-hidden shadow-inner">
             <img src={memory.imageUrl} alt={memory.title} className="w-full h-auto object-cover" />
             {/* Unsplash comment for fallback logic if needed: image of romantic memory */}
          </div>
        )}
        <span className="text-sm font-bold text-rose-400 uppercase tracking-widest">{format(new Date(memory.date), "MMMM do, yyyy")}</span>
        <h3 className="text-xl font-bold text-gray-800 mt-1 mb-2 font-serif">{memory.title}</h3>
        <p className="text-gray-600 leading-relaxed">{memory.description}</p>
      </div>
    </motion.div>
  );
}

function ReasonsButton({ reasons }: { reasons: any[] }) {
  const [currentReason, setCurrentReason] = useState<string | null>(null);

  const showRandomReason = () => {
    if (!reasons.length) return;
    const random = reasons[Math.floor(Math.random() * reasons.length)];
    setCurrentReason(random.text);
    confetti({
      particleCount: 50,
      spread: 60,
      colors: ['#f43f5e', '#fb7185', '#fda4af']
    });
  };

  return (
    <div className="bg-rose-100/50 p-12 rounded-3xl">
      <h2 className="text-3xl font-serif text-rose-800 mb-8">Why I Love You</h2>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={showRandomReason}
        className="bg-rose-500 text-white rounded-full p-8 shadow-2xl shadow-rose-300"
      >
        <Heart className="w-16 h-16 fill-current animate-pulse" />
      </motion.button>
      <p className="mt-4 text-rose-600/80">Click the heart</p>

      <Dialog open={!!currentReason} onOpenChange={(open) => !open && setCurrentReason(null)}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-center text-rose-500 font-handwriting text-3xl">One reason is...</DialogTitle>
          </DialogHeader>
          <div className="py-8">
             <p className="text-2xl text-gray-800 font-serif leading-relaxed">"{currentReason}"</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CouponCard({ coupon, username }: { coupon: any, username: string }) {
  const redeemCoupon = useRedeemCoupon();
  const queryClient = useQueryClient();

  const handleRedeem = async () => {
    if (coupon.isRedeemed) return;
    await redeemCoupon.mutateAsync(coupon.id);
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f59e0b', '#d97706'] // Gold colors for coupon
    });
    // Invalidate the public profile query
    queryClient.invalidateQueries({ queryKey: [api.public.getProfile.path, username] });
  };

  return (
    <Card className={`border-2 border-dashed transition-all duration-300 ${coupon.isRedeemed ? 'border-gray-200 bg-gray-50 opacity-70' : 'border-rose-300 hover:border-rose-500 hover:shadow-lg bg-white'}`}>
      <CardHeader>
        <CardTitle className={`text-xl font-serif ${coupon.isRedeemed ? 'text-gray-500 line-through' : 'text-rose-700'}`}>
          {coupon.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm">{coupon.description}</p>
        <Button 
          onClick={handleRedeem} 
          disabled={coupon.isRedeemed || redeemCoupon.isPending}
          className={`w-full ${coupon.isRedeemed ? 'bg-gray-200 text-gray-500' : 'bg-rose-500 hover:bg-rose-600 text-white'}`}
        >
          {coupon.isRedeemed ? "Redeemed" : "Redeem Coupon"}
        </Button>
      </CardContent>
    </Card>
  );
}
