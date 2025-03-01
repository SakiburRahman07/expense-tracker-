import { Button } from "@/components/ui/button";

export default function Hero() {
  const scrollToRegistration = () => {
    document.getElementById('registration-form').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative h-[500px] bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div 
          className="absolute inset-0 z-0" 
          style={{
            backgroundImage: "url('/images/coxs-bazar.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      </div>
      
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          আপনার স্বপ্নের ট্যুর প্ল্যান করুন
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl">
          কক্সবাজার থেকে বান্দরবান - একটি অবিস্মরণীয় অভিজ্ঞতার জন্য আজই যোগাযোগ করুন
        </p>
        <Button 
          onClick={scrollToRegistration}
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 text-lg"
        >
          রেজিস্ট্রেশন করুন
        </Button>
      </div>
    </div>
  );
} 