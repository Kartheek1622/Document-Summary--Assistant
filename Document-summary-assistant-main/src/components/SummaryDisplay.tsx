import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lightbulb, FileText } from "lucide-react";

interface SummaryDisplayProps {
  summary: {
    short: string;
    medium: string;
    long: string;
    keyPoints: string[];
    improvements: string[];
  };
}

const SummaryDisplay = ({ summary }: SummaryDisplayProps) => {
  return (
    <div className="space-y-6">
      {/* Summary Tabs */}
      <Card className="p-6 shadow-xl border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold">Document Summary</h2>
        </div>
        
        <Tabs defaultValue="medium" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="short">Short</TabsTrigger>
            <TabsTrigger value="medium">Medium</TabsTrigger>
            <TabsTrigger value="long">Long</TabsTrigger>
          </TabsList>
          
          <TabsContent value="short" className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">{summary.short}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="medium" className="space-y-4">
            <div className="prose max-w-none">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">{summary.medium}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="long" className="space-y-4">
            <div className="prose max-w-none">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">{summary.long}</p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Key Points */}
      <Card className="p-6 shadow-lg border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-secondary" />
          <h2 className="text-xl font-bold">Key Points</h2>
        </div>
        <ul className="space-y-3">
          {summary.keyPoints.map((point, index) => (
            <li key={index} className="flex items-start gap-3 group">
              <Badge 
                variant="secondary" 
                className="mt-1 flex-shrink-0 bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 transition-colors"
              >
                {index + 1}
              </Badge>
              <span className="text-foreground leading-relaxed group-hover:text-primary transition-colors">
                {point}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Improvement Suggestions */}
      <Card className="p-6 shadow-lg border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-bold">Improvement Suggestions</h2>
        </div>
        <ul className="space-y-3">
          {summary.improvements.map((improvement, index) => (
            <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors border border-accent/10">
              <Lightbulb className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <span className="text-foreground leading-relaxed">{improvement}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default SummaryDisplay;
