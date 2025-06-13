
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Textarea from '../components/ui/Textarea';
import Toast from '../components/ui/Toast';
import {
    ClipboardDocumentIcon,
    CheckCircleIcon,
    BellIcon as AlertIcon,
    ArrowPathIcon,
    LightBulbIcon,
    ChatBubbleLeftEllipsisIcon,
    ArrowDownTrayIcon,
} from '../components/icons';
import { GENRE_OPTIONS, VISUAL_STYLE_OPTIONS } from '../constants';
import { StorylineIdeaResult, SavedProject, SavedStorylineIdea } from '../types';

// Utility function to extract the first valid JSON object from a string
const extractFirstJsonObjectFromString = (responseText: string | undefined): any => {
    if (!responseText) {
        console.error("Attempted to extract JSON from empty or undefined response text.");
        throw new Error("AI response was empty or undefined for JSON extraction.");
    }
    let S = responseText.trim();

    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const fenceMatch = S.match(fenceRegex);
    if (fenceMatch && fenceMatch[2]) {
        S = fenceMatch[2].trim();
    }

    let startIndex = -1;
    for (let i = 0; i < S.length; i++) {
        if (S[i] === '{' || S[i] === '[') {
            startIndex = i;
            break;
        }
    }

    if (startIndex === -1) {
        try {
            return JSON.parse(S); // For simple JSON primitives if no object/array found
        } catch(e) {
            console.error("AI response does not start with '{' or '[' and is not a valid simple JSON primitive during extraction. Text:", S, e);
            throw new Error("AI response does not appear to contain a valid JSON object or array for extraction.");
        }
    }

    const charStack: string[] = [];
    let inString = false;
    let endIndex = -1;

    for (let i = startIndex; i < S.length; i++) {
        const char = S[i];
        const prevChar = i > startIndex ? S[i-1] : null;

        if (inString) {
            if (char === '"' && prevChar !== '\\') {
                inString = false;
            }
        } else {
            if (char === '"') {
                inString = true;
            } else if (char === '{' || char === '[') {
                charStack.push(char);
            } else if (char === '}') {
                if (charStack.length === 0 || charStack[charStack.length - 1] !== '{') {
                    console.error("Malformed JSON (extraction): Mismatched '}' at index", i, "in text:", S.substring(startIndex));
                    throw new Error("Malformed JSON structure (extraction): Mismatched '}'.");
                }
                charStack.pop();
            } else if (char === ']') {
                if (charStack.length === 0 || charStack[charStack.length - 1] !== '[') {
                     console.error("Malformed JSON (extraction): Mismatched ']' at index", i, "in text:", S.substring(startIndex));
                    throw new Error("Malformed JSON structure (extraction): Mismatched ']'.");
                }
                charStack.pop();
            }
        }

        if (!inString && charStack.length === 0 && i >= startIndex) { 
            if ((S[startIndex] === '{' && char === '}') || (S[startIndex] === '[' && char === ']')) {
                endIndex = i;
                break; 
            }
        }
    }
    
    if (endIndex === -1 && charStack.length > 0) { 
        console.error("Unterminated JSON structure during extraction. Stack:", charStack, "Processed text:", S.substring(startIndex));
        throw new Error("Malformed JSON structure (extraction): Unterminated object or array in AI response.");
    }
    if (endIndex === -1 && charStack.length === 0 && startIndex !== -1) { 
        console.error("No valid JSON structure completed. Processed text:", S.substring(startIndex));
        throw new Error("Malformed JSON structure (extraction): No valid JSON object or array completed after initial '{' or '['.");
    }


    let jsonToParse = S.substring(startIndex, endIndex + 1);
    jsonToParse = jsonToParse.replace(/,\s*([}\]])/g, '$1');
    
    try {
        return JSON.parse(jsonToParse);
    } catch (e: any) {
        console.error("Final JSON parsing attempt failed in extractFirstJsonObjectFromString:", e, "Attempted to parse:", jsonToParse, "Original full text after initial processing:", S);
        throw new Error(`Failed to parse extracted JSON object: ${e.message}`);
    }
};


const StorylineIdeaPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [genre, setGenre] = useState<string>(GENRE_OPTIONS[0]);
  const [visualStyle, setVisualStyle] = useState<string>(VISUAL_STYLE_OPTIONS[0]);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedIdea, setGeneratedIdea] = useState<StorylineIdeaResult | null>(null);
  const [toastInfo, setToastInfo] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info', icon?: React.ReactNode }>({ show: false, message: '', type: 'success' });

  useEffect(() => {
    const locationState = location.state as { savedProject?: SavedProject };
    if (locationState?.savedProject?.projectType === 'storylineIdea' && locationState.savedProject.storylineIdeaData) {
        setGenre(locationState.savedProject.storylineIdeaData.genre);
        setVisualStyle(locationState.savedProject.storylineIdeaData.visualStyle);
        setGeneratedIdea(locationState.savedProject.storylineIdeaData.result);
        navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    let timer: number;
    if (toastInfo.show) {
      timer = window.setTimeout(() => {
        setToastInfo({ show: false, message: '', type: 'success', icon: undefined });
      }, 5000); 
    }
    return () => window.clearTimeout(timer);
  }, [toastInfo.show]);

  const handleGenerateIdea = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedIdea(null);

    const promptParts = ["Generate a storyline idea."];
    if (genre) promptParts.push(`Genre: ${genre}.`);
    if (visualStyle) promptParts.push(`Visual Style: ${visualStyle}.`);
    if (customPrompt) promptParts.push(`User's specific focus: ${customPrompt}.`);
    promptParts.push("Provide a compelling title, a short logline, a concise synopsis (around 100-150 words), and a brief storyline outline (3-5 key plot points).");
    promptParts.push("Format your response as a single, strictly valid JSON object with keys: 'title', 'logline', 'synopsis', 'storyline'. The storyline should be a single string with plot points separated by newlines or semicolons.");
    
    const fullPrompt = promptParts.join(' ');
    console.log("[SIMULATE AI Storyline Idea] Prompting with:", fullPrompt);

    try {
        await new Promise(resolve => setTimeout(resolve, 1500)); 

        const mockResponse: StorylineIdeaResult = {
            title: `The Chronos Cipher - ${genre}`, // Example using selected genre
            logline: "A reclusive historian stumbles upon an ancient artifact that predicts global catastrophes, forcing him to race against time and a shadowy organization to alter a bleak future.",
            synopsis: `Dr. Aris Thorne, a brilliant but disgraced historian, discovers the 'Chronos Cipher,' an ancient device foretelling imminent disasters. As he deciphers its cryptic warnings, he realizes each prediction comes true with terrifying accuracy. Soon, a clandestine group known as 'The Observers,' who have guarded the Cipher for centuries, emerge to reclaim it, believing humanity should not meddle with fate. Aris, aided by a skeptical journalist, must evade The Observers while trying to understand how to use the Cipher's knowledge to prevent the ultimate cataclysm, questioning whether the future can truly be changed or if his efforts are futile. (Visual Style: ${visualStyle})`, // Example using selected visual style
            storyline: "1. Discovery: Aris finds the Chronos Cipher.\n2. First Prediction: A minor disaster occurs, validating the Cipher.\n3. The Chase: The Observers begin hunting Aris.\n4. Alliance: Aris teams up with a journalist.\n5. The Ultimatum: The final, most devastating prediction is revealed, forcing a desperate choice."
        };
        const responseText = JSON.stringify(mockResponse);
        const parsedResult = extractFirstJsonObjectFromString(responseText) as StorylineIdeaResult;

        if (!parsedResult.title || !parsedResult.logline || !parsedResult.synopsis || !parsedResult.storyline) {
            throw new Error("AI returned incomplete storyline data.");
        }
        setGeneratedIdea(parsedResult);
        setToastInfo({ show: true, message: 'Storyline idea generated successfully!', type: 'success', icon: <CheckCircleIcon /> });

    } catch (err) {
        console.error("Error during storyline idea generation (raw error):", err);
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(`Failed to generate storyline idea: ${errorMessage}`);
        setToastInfo({ show: true, message: `Generation failed: ${errorMessage}`, type: 'error', icon: <AlertIcon /> });
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleRandomIdea = async () => {
    const randomGenre = GENRE_OPTIONS[Math.floor(Math.random() * GENRE_OPTIONS.filter(g=>g !== "Other").length)];
    const randomVisualStyle = VISUAL_STYLE_OPTIONS[Math.floor(Math.random() * VISUAL_STYLE_OPTIONS.filter(vs => vs !== "Other").length)];
    setGenre(randomGenre);
    setVisualStyle(randomVisualStyle);
    setCustomPrompt("Surprise me with something unique and unexpected!"); 
    setTimeout(handleGenerateIdea, 100);
  };

  const handleSaveIdea = useCallback(() => {
    if (!generatedIdea || !genre || !visualStyle) {
        setToastInfo({ show: true, message: 'No storyline idea data to save.', type: 'error', icon: <AlertIcon /> });
        return;
    }
    try {
        const savedProjectsString = localStorage.getItem('nufa-projects');
        let projects: SavedProject[] = savedProjectsString ? JSON.parse(savedProjectsString) : [];
        if (!Array.isArray(projects)) projects = [];

        const newIdeaToSave: SavedStorylineIdea = {
            genre,
            visualStyle,
            result: generatedIdea,
        };

        const newSavedProject: SavedProject = {
            id: `storyline-${Date.now().toString()}`,
            lastModified: new Date().toISOString(),
            projectType: 'storylineIdea',
            storylineIdeaData: newIdeaToSave,
        };
        
        projects.unshift(newSavedProject); 
        projects.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
        localStorage.setItem('nufa-projects', JSON.stringify(projects));
        
        setToastInfo({ show: true, message: 'Storyline idea saved successfully to My Projects!', type: 'success', icon: <CheckCircleIcon /> });

    } catch (error) {
        console.error("Error saving storyline idea:", error);
        setToastInfo({ show: true, message: 'Failed to save idea. Please try again.', type: 'error', icon: <AlertIcon /> });
    }
  }, [generatedIdea, genre, visualStyle]);

  const copyToClipboard = useCallback((text: string | undefined, type: string) => {
    if (!text) {
        setToastInfo({show: true, message: `${type} is empty.`, type: 'info', icon: <AlertIcon />});
        return;
    }
    navigator.clipboard.writeText(text).then(() => {
      setToastInfo({show: true, message: `${type} copied to clipboard!`, type: 'success', icon: <CheckCircleIcon />})
    }).catch(err => {
        console.error(`Could not copy ${type}: `, err);
        setToastInfo({show: true, message: `Could not copy ${type}.`, type: 'error', icon: <AlertIcon />})
    });
  }, []);


  return (
    <div className="p-6 md:p-8 text-neutral-900 dark:text-neutral-100 min-h-full bg-neutral-100 dark:bg-brand-bg-dark">
      {toastInfo.show && (
        <Toast 
          message={toastInfo.message} 
          type={toastInfo.type}
          onClose={() => setToastInfo({ show: false, message: '', type: 'success', icon: undefined })}
          icon={toastInfo.icon}
        />
      )}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-3 flex items-center">
            <ChatBubbleLeftEllipsisIcon className="w-10 h-10 mr-3 text-brand-teal" />
            Storyline Idea Generator
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Spark your creativity! Select a genre, visual style, or add custom keywords to generate unique storyline ideas.
        </p>
      </div>

      <Card className="bg-white dark:bg-brand-bg-card mb-8 p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Select
            label="Select Genre"
            id="storyline-genre"
            options={GENRE_OPTIONS.map(g => ({ label: g, value: g }))}
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            disabled={isLoading}
          />
          <Select
            label="Select Visual Style"
            id="storyline-visual-style"
            options={VISUAL_STYLE_OPTIONS.map(vs => ({ label: vs, value: vs }))}
            value={visualStyle}
            onChange={(e) => setVisualStyle(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <Textarea
          label="Custom Prompt / Keywords (Optional)"
          id="storyline-custom-prompt"
          placeholder="e.g., A story about a haunted lighthouse, focus on mystery and suspense, involve a skeptical detective..."
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          rows={3}
          disabled={isLoading}
          className="mb-6"
        />
        <div className="flex flex-col sm:flex-row gap-4">
            <Button
                variant="primary"
                onClick={handleGenerateIdea}
                disabled={isLoading}
                size="lg"
                className="flex-1"
                leftIcon={isLoading ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <LightBulbIcon className="w-5 h-5" />}
            >
                {isLoading ? 'Generating...' : 'Generate Idea'}
            </Button>
            <Button
                variant="secondary"
                onClick={handleRandomIdea}
                disabled={isLoading}
                size="lg"
                className="flex-1"
                 leftIcon={<LightBulbIcon className="w-5 h-5 opacity-70" />}
            >
                Spark Random Idea
            </Button>
        </div>
      </Card>

      {isLoading && !generatedIdea && (
        <Card className="text-center py-12 bg-white dark:bg-brand-bg-card mt-8">
          <ArrowPathIcon className="w-14 h-14 text-brand-teal animate-spin mx-auto mb-5" />
          <p className="text-xl text-neutral-600 dark:text-neutral-400">Crafting your storyline idea...</p>
        </Card>
      )}
      {error && !isLoading && (
        <Card className="mt-8 bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-500 p-6">
            <p className="text-red-700 dark:text-red-300 text-center text-lg">{error}</p>
        </Card>
      )}
      
      {!isLoading && !generatedIdea && !error && (
          <Card className="text-center py-20 bg-transparent border-2 border-dashed border-neutral-300 dark:border-neutral-700 mt-8">
              <ChatBubbleLeftEllipsisIcon className="w-24 h-24 text-brand-teal opacity-40 mb-6 mx-auto" />
              <h3 className="text-2xl font-semibold text-neutral-600 dark:text-neutral-400 mb-3">Your Next Story Awaits</h3>
              <p className="text-base text-neutral-500 dark:text-neutral-500 max-w-md mx-auto">
                  Select your preferences above and let our AI co-writer brainstorm some brilliant ideas for you.
              </p>
          </Card>
      )}

      {generatedIdea && !isLoading && (
        <Card className="mt-8 p-6 bg-white dark:bg-brand-bg-card shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-brand-teal">{generatedIdea.title}</h2>
            <div className="flex space-x-2">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(
                        `Title: ${generatedIdea.title}\nLogline: ${generatedIdea.logline}\nSynopsis: ${generatedIdea.synopsis}\nStoryline: ${generatedIdea.storyline}`, 
                        'Full Idea')}
                    className="!p-1.5"
                >
                    <ClipboardDocumentIcon className="w-5 h-5" />
                </Button>
                <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={handleSaveIdea}
                    leftIcon={<ArrowDownTrayIcon className="w-4 h-4"/>}
                >
                    Save Idea
                </Button>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-1">Logline:</h3>
              <p className="text-base text-neutral-700 dark:text-neutral-300 italic">{generatedIdea.logline}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-1">Synopsis:</h3>
              <p className="text-base text-neutral-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed">{generatedIdea.synopsis}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-1">Storyline Outline:</h3>
              <p className="text-base text-neutral-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed">{generatedIdea.storyline}</p>
            </div>
            <div className="pt-3 text-sm text-neutral-500 dark:text-neutral-400">
                <p><strong>Selected Genre:</strong> {genre}</p>
                <p><strong>Selected Visual Style:</strong> {visualStyle}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
StorylineIdeaPage.displayName = "StorylineIdeaPage";
export default StorylineIdeaPage;
