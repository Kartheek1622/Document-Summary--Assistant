import { useState } from "react";
import { FileText, Upload, Sparkles, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import UploadZone from "@/components/UploadZone";
import SummaryDisplay from "@/components/SummaryDisplay";
import LoadingState from "@/components/LoadingState";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState<{
    short: string;
    medium: string;
    long: string;
    keyPoints: string[];
    improvements: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (selectedFile: File) => {
    // Validate file size (20MB limit)
    const maxSize = 20 * 1024 * 1024; // 20MB in bytes
    if (selectedFile.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 20MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(selectedFile.type)) {
      toast({
        title: "Unsupported File Type",
        description: "Please upload a PDF or image file (JPG, PNG, WEBP)",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    setSummary(null);
    setError(null);
  };

  const handleSummarize = async () => {
    if (!file) return;

    setIsProcessing(true);
    setSummary(null);
    setError(null);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64 = reader.result as string;
        
        try {
          const { data, error } = await supabase.functions.invoke("summarize-document", {
            body: {
              file: base64,
              fileName: file.name,
              mimeType: file.type,
            },
          });

          if (error) {
            // Extract error message from the error object
            let errorMessage = "Failed to process document. Please try again.";
            let errorTitle = "Error";
            
            if (error.message) {
              errorMessage = error.message;
            }
            
            // Check for specific error types
            const errorString = error?.message || error?.toString() || "";
            
            if (errorString.includes("429") || errorString.toLowerCase().includes("rate limit")) {
              errorMessage = "⏱️ Rate limit reached.\n\nPlease wait 2-3 minutes before trying again. The free tier has limited requests per minute.";
              errorTitle = "Too Many Requests";
            } else if (errorString.includes("402") || errorString.toLowerCase().includes("credit")) {
              errorMessage = "💳 AI credits exhausted.\n\nTo continue: Go to Settings → Workspace → Usage to add credits.";
              errorTitle = "Credits Exhausted";
            } else if (errorString.includes("400")) {
              errorMessage = "📄 This file format couldn't be processed. Try converting your PDF to images (JPG/PNG) first.";
              errorTitle = "Unsupported Format";
            }
            
            setError(errorMessage);
            toast({
              title: errorTitle,
              description: errorMessage.split('\n')[0],
              variant: "destructive",
              duration: 10000,
            });
            setIsProcessing(false);
            return;
          }

          setSummary(data);
          setIsProcessing(false);
          toast({
            title: "Summary generated!",
            description: "Your document has been analyzed successfully.",
          });
        } catch (err: any) {
          console.error("Error in invoke:", err);
          const errorString = err?.message || err?.toString() || "";
          
          let errorMessage = "Failed to process document. Please try again.";
          let errorTitle = "Error";
          
          if (errorString.includes("429") || errorString.toLowerCase().includes("rate limit")) {
            errorMessage = "⏱️ Rate limit reached.\n\nPlease wait 2-3 minutes before trying again. The free tier has limited requests per minute.";
            errorTitle = "Too Many Requests";
          } else if (errorString.includes("402") || errorString.toLowerCase().includes("credit")) {
            errorMessage = "💳 AI credits exhausted.\n\nTo continue: Go to Settings → Workspace → Usage to add credits.";
            errorTitle = "Credits Exhausted";
          } else if (errorString.includes("400")) {
            errorMessage = "📄 This file format couldn't be processed. Try converting your PDF to images (JPG/PNG) first.";
            errorTitle = "Unsupported Format";
          } else if (errorString) {
            errorMessage = errorString;
          }
          
          setError(errorMessage);
          toast({
            title: errorTitle,
            description: errorMessage.split('\n')[0],
            variant: "destructive",
            duration: 10000,
          });
          setIsProcessing(false);
        }
      };

      reader.onerror = () => {
        setError("Failed to read file. Please try again.");
        setIsProcessing(false);
        toast({
          title: "File Error",
          description: "Failed to read file",
          variant: "destructive",
        });
      };
    } catch (error: any) {
      // Safety net for any unexpected errors
      console.error("Unexpected error:", error);
      setError("An unexpected error occurred. Please try again.");
      setIsProcessing(false);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <header className="container mx-auto px-4 pt-12 pb-8">
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Document Analysis</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Document Summary Assistant
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload any PDF or image document and get intelligent, accurate summaries with key points and improvement suggestions
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Error Display */}
          {error && !isProcessing && (
            <Card className="p-6 shadow-lg border-destructive/50 bg-destructive/5 backdrop-blur-sm animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-destructive mb-1">
                    {error.includes("Rate limit") || error.includes("⏱️") ? "⏱️ Rate Limit Reached" : "Processing Error"}
                  </h3>
                  <p className="text-sm text-foreground/80 whitespace-pre-line">{error}</p>
                  {(error.includes("Rate limit") || error.includes("⏱️")) && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-md">
                      <p className="text-xs text-muted-foreground">
                        💡 <strong>What to do:</strong> Wait 2-3 minutes before trying again. The rate limit resets after a short period. For unlimited access, upgrade your plan.
                      </p>
                    </div>
                  )}
                  <Button 
                    onClick={() => setError(null)}
                    variant="outline"
                    size="sm"
                    className="mt-3"
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Upload Section - Always visible so users can try again */}
          {!summary && (
            <Card className="p-8 shadow-lg border-border/50 bg-card/50 backdrop-blur-sm animate-scale-in">
              <UploadZone onFileSelect={handleFileSelect} />
              
              {file && (
                <div className="mt-6 space-y-4 animate-fade-in">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <FileIcon className="w-10 h-10 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  <Button 
                    onClick={handleSummarize} 
                    disabled={isProcessing}
                    className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-lg"
                  >
                    {isProcessing ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Smart Summary
                      </>
                    )}
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* Processing State */}
          {isProcessing && <LoadingState />}

          {/* Summary Display */}
          {summary && !isProcessing && (
            <div className="space-y-6 animate-fade-in">
              <SummaryDisplay summary={summary} />
              
              <Button 
                onClick={() => {
                  setFile(null);
                  setSummary(null);
                  setError(null);
                }}
                variant="outline"
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Process Another Document
              </Button>
            </div>
          )}

          {/* Features Section */}
          {!file && !summary && (
            <div className="grid md:grid-cols-3 gap-6 mt-12 animate-fade-in">
              <Card className="p-6 hover:shadow-xl transition-shadow bg-card/50 backdrop-blur-sm border-border/50">
                <FileText className="w-12 h-12 mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">Smart Extraction</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced AI extracts text from PDFs and images with OCR support
                </p>
              </Card>
              
              <Card className="p-6 hover:shadow-xl transition-shadow bg-card/50 backdrop-blur-sm border-border/50">
                <Sparkles className="w-12 h-12 mb-4 text-secondary" />
                <h3 className="text-lg font-semibold mb-2">Intelligent Summaries</h3>
                <p className="text-sm text-muted-foreground">
                  Get summaries in three lengths with extracted key points
                </p>
              </Card>
              
              <Card className="p-6 hover:shadow-xl transition-shadow bg-card/50 backdrop-blur-sm border-border/50">
                <Upload className="w-12 h-12 mb-4 text-accent" />
                <h3 className="text-lg font-semibold mb-2">Easy Upload</h3>
                <p className="text-sm text-muted-foreground">
                  Drag and drop or click to upload PDFs and images instantly
                </p>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              Powered by AI · Max file size: 20MB · Supports PDF, JPG, PNG, WEBP
            </p>
            <p className="text-xs text-muted-foreground/70 mt-2">
              Your documents are processed securely and not stored permanently
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
