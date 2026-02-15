import { useState } from "react";
import { useUser, useLogout } from "@/hooks/use-auth";
import { useMemories, useCreateMemory, useDeleteMemory, useCoupons, useCreateCoupon, useDeleteCoupon, useReasons, useCreateReason, useDeleteReason, useMusic, useCreateMusic, useDeleteMusic } from "@/hooks/use-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Plus, Trash2, Heart, Music as MusicIcon, Ticket, LogOut } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMemorySchema, insertCouponSchema, insertReasonSchema, insertMusicSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { data: user, isLoading } = useUser();
  const logout = useLogout();
  
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-rose-500 w-10 h-10" /></div>;
  if (!user) return null; // Redirect handled by router protection usually

  return (
    <div className="min-h-screen bg-rose-50/50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm">
          <div>
            <h1 className="text-3xl font-serif text-rose-800">Hello, {user.username}</h1>
            <p className="text-rose-500">Managing gift for <span className="font-semibold">{user.girlfriendName}</span></p>
          </div>
          <div className="flex items-center gap-4">
             <Button variant="outline" onClick={() => window.open(`/view/${user.username}`, '_blank')} className="border-rose-200 text-rose-600 hover:bg-rose-50">
               View Public Page
             </Button>
             <Button variant="ghost" size="icon" onClick={() => logout.mutate()}>
               <LogOut className="w-5 h-5 text-rose-400" />
             </Button>
          </div>
        </header>

        <Tabs defaultValue="memories" className="space-y-6">
          <TabsList className="bg-white/50 backdrop-blur-sm p-1 border border-rose-100 rounded-xl h-auto flex flex-wrap justify-start gap-2 w-full">
            <TabsTrigger value="memories" className="data-[state=active]:bg-rose-500 data-[state=active]:text-white rounded-lg px-6 py-3">Memories</TabsTrigger>
            <TabsTrigger value="coupons" className="data-[state=active]:bg-rose-500 data-[state=active]:text-white rounded-lg px-6 py-3">Coupons</TabsTrigger>
            <TabsTrigger value="reasons" className="data-[state=active]:bg-rose-500 data-[state=active]:text-white rounded-lg px-6 py-3">Reasons</TabsTrigger>
            <TabsTrigger value="music" className="data-[state=active]:bg-rose-500 data-[state=active]:text-white rounded-lg px-6 py-3">Music</TabsTrigger>
          </TabsList>

          <TabsContent value="memories" className="space-y-6">
            <MemoriesManager />
          </TabsContent>

          <TabsContent value="coupons" className="space-y-6">
            <CouponsManager />
          </TabsContent>

          <TabsContent value="reasons" className="space-y-6">
            <ReasonsManager />
          </TabsContent>

          <TabsContent value="music" className="space-y-6">
            <MusicManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS FOR DASHBOARD ---

function MemoriesManager() {
  const { data: memories } = useMemories();
  const createMemory = useCreateMemory();
  const deleteMemory = useDeleteMemory();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();

  const form = useForm({ resolver: zodResolver(insertMemorySchema) });

  const onSubmit = async (data: any) => {
    try {
      await createMemory.mutateAsync({ ...data, date: date?.toISOString() });
      setOpen(false);
      form.reset();
      toast({ title: "Success", description: "Memory added!" });
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to add memory" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-rose-800">Timeline Memories</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-rose-500 hover:bg-rose-600 text-white"><Plus className="w-4 h-4 mr-2" /> Add Memory</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Memory</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input {...form.register("title")} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea {...form.register("description")} />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input {...form.register("imageUrl")} placeholder="https://..." />
                <p className="text-xs text-muted-foreground">Tip: Use an Unsplash URL for testing</p>
              </div>
              <Button type="submit" className="w-full bg-rose-500" disabled={createMemory.isPending}>Save Memory</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories?.map((memory) => (
          <Card key={memory.id} className="overflow-hidden hover:shadow-lg transition-shadow border-rose-100">
            {memory.imageUrl && <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${memory.imageUrl})` }} />}
            <CardHeader>
              <CardTitle className="flex justify-between items-start text-lg">
                <span>{memory.title}</span>
                <Button variant="ghost" size="icon" onClick={() => deleteMemory.mutate(memory.id)} className="text-red-400 hover:text-red-600 h-8 w-8">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardTitle>
              <CardDescription>{format(new Date(memory.date), "MMMM do, yyyy")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-3">{memory.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CouponsManager() {
  const { data: coupons } = useCoupons();
  const createCoupon = useCreateCoupon();
  const deleteCoupon = useDeleteCoupon();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const form = useForm({ resolver: zodResolver(insertCouponSchema) });

  const onSubmit = async (data: any) => {
    try {
      await createCoupon.mutateAsync(data);
      setOpen(false);
      form.reset();
      toast({ title: "Success", description: "Coupon added!" });
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to add coupon" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-rose-800">Love Coupons</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-rose-500 hover:bg-rose-600 text-white"><Plus className="w-4 h-4 mr-2" /> Create Coupon</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Coupon</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input {...form.register("title")} placeholder="e.g. Free Massage" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea {...form.register("description")} placeholder="Redeemable for..." />
              </div>
              <Button type="submit" className="w-full bg-rose-500" disabled={createCoupon.isPending}>Create Coupon</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons?.map((coupon) => (
          <div key={coupon.id} className="relative bg-white border-2 border-dashed border-rose-300 p-6 rounded-lg hover:border-rose-500 transition-colors">
            <div className="absolute top-2 right-2">
               <Button variant="ghost" size="icon" onClick={() => deleteCoupon.mutate(coupon.id)} className="text-gray-400 hover:text-red-500 h-6 w-6">
                  <Trash2 className="w-3 h-3" />
               </Button>
            </div>
            <Ticket className="w-8 h-8 text-rose-400 mb-4" />
            <h3 className="font-bold text-lg text-gray-800">{coupon.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{coupon.description}</p>
            <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-rose-500">
              {coupon.isRedeemed ? "REDEEMED" : "ACTIVE"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReasonsManager() {
  const { data: reasons } = useReasons();
  const createReason = useCreateReason();
  const deleteReason = useDeleteReason();
  const { toast } = useToast();
  const form = useForm({ resolver: zodResolver(insertReasonSchema) });

  const onSubmit = async (data: any) => {
    try {
      await createReason.mutateAsync(data);
      form.reset();
      toast({ title: "Success", description: "Reason added!" });
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to add reason" });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-serif text-rose-800">Why I Love You</h2>
        <Card className="border-rose-100">
          <CardHeader>
            <CardTitle>Add a Reason</CardTitle>
          </CardHeader>
          <CardContent>
             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               <div className="space-y-2">
                 <Label>Reason</Label>
                 <Input {...form.register("text")} placeholder="Because your smile lights up my world..." />
               </div>
               <Button type="submit" className="w-full bg-rose-500" disabled={createReason.isPending}>Add Reason</Button>
             </form>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-rose-700">Your List ({reasons?.length || 0})</h3>
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {reasons?.map((reason) => (
            <div key={reason.id} className="flex items-center justify-between bg-white p-4 rounded-lg border border-rose-100 shadow-sm">
              <span className="text-gray-700 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" /> 
                {reason.text}
              </span>
              <Button variant="ghost" size="icon" onClick={() => deleteReason.mutate(reason.id)} className="text-gray-400 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MusicManager() {
  const { data: music } = useMusic();
  const createMusic = useCreateMusic();
  const deleteMusic = useDeleteMusic();
  const { toast } = useToast();
  const form = useForm({ resolver: zodResolver(insertMusicSchema) });

  const onSubmit = async (data: any) => {
    try {
      await createMusic.mutateAsync(data);
      form.reset();
      toast({ title: "Success", description: "Song added!" });
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to add song" });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-rose-800">Background Playlist</h2>
      
      <Card className="border-rose-100">
        <CardContent className="pt-6">
           <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4 items-end">
             <div className="space-y-2 flex-1">
               <Label>Song Title</Label>
               <Input {...form.register("title")} placeholder="Our Song" />
             </div>
             <div className="space-y-2 flex-1">
               <Label>Audio URL (MP3)</Label>
               <Input {...form.register("url")} placeholder="https://..." />
             </div>
             <Button type="submit" className="bg-rose-500" disabled={createMusic.isPending}>Add Song</Button>
           </form>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {music?.map((song) => (
          <div key={song.id} className="flex items-center justify-between bg-white p-4 rounded-lg border border-rose-100">
            <div className="flex items-center gap-3">
              <div className="bg-rose-100 p-2 rounded-full">
                <MusicIcon className="w-4 h-4 text-rose-500" />
              </div>
              <span className="font-medium text-gray-800">{song.title}</span>
              <span className="text-xs text-gray-400 truncate max-w-[200px]">{song.url}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => deleteMusic.mutate(song.id)} className="text-gray-400 hover:text-red-500">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
