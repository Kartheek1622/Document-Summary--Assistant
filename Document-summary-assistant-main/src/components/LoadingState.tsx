import { Card } from "@/components/ui/card";
import { Loader2, FileSearch, Sparkles, CheckCircle2 } from "lucide-react";

const LoadingState = () => {
  return (
    <Card className="p-8 shadow-lg border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-2xl opacity-20 animate-glow" />
          <Loader2 className="w-16 h-16 text-primary animate-spin relative" />
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold">Processing Your Document</h3>
          <p className="text-muted-foreground">This may take a moment...</p>
        </div>

        <div className="w-full max-w-md space-y-4 mt-8">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10 animate-fade-in">
            <FileSearch className="w-5 h-5 text-primary" />
            <span className="text-sm">Reading document with enhanced AI...</span>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/5 border border-secondary/10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Sparkles className="w-5 h-5 text-secondary" />
            <span className="text-sm">Extracting key information & details...</span>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/5 border border-accent/10 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <CheckCircle2 className="w-5 h-5 text-accent" />
            <span className="text-sm">Generating accurate summaries...</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LoadingState;
