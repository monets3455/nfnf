
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { StoryboardFormData, Character, StoryboardPreviewData, AiGeneratedDetails, SceneConfigFormData, PacingOptionValue, ShotData } from '../types';
import { 
    GENRE_OPTIONS, NARRATIVE_TONE_OPTIONS, VISUAL_STYLE_OPTIONS, 
    CAMERA_MOVEMENT_OPTIONS, TARGET_PLATFORM_OPTIONS, AUDIENCE_AGE_OPTIONS, PROMPT_LANGUAGE_STYLE_OPTIONS, 
    CAMERA_ANGLE_OPTIONS, LIGHTING_STYLE_OPTIONS, initialStoryboardFormDataDef,
    PACING_OPTIONS, DURATION_SCENE_RECOMMENDATIONS
} from '../constants';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import TagInput from '../components/ui/TagInput';
import Toast from '../components/ui/Toast';
import Card from '../components/ui/Card'; 
import { PlusCircleIcon, XMarkIcon, ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, KeyIcon, BellIcon as AlertIcon, ArrowPathIcon, LightBulbIcon, TrashIcon } from '../components/icons';
import { generateMockStoryboard } from './PreviewStoryboardPage';
import { GoogleGenAI } from "@google/genai";


const STEPS = [
  { id: 1, name: 'Basic Info' },
  { id: 2, name: 'Scene Setup & Visuals' }, 
  { id: 3, name: 'Characters & Camera' }, 
  { id: 4, name: 'Output Details' }, 
];

function getNewInitialFormData(): StoryboardFormData {
  const freshData = JSON.parse(JSON.stringify(initialStoryboardFormDataDef));
  freshData.characters = [{ id: `char-init-${Date.now()}`, name: '', label: '', description: '' }];
  freshData.cameraAngles = [];
  freshData.lightingStyles = [];
  freshData.sceneConfigurations = []; 
  return freshData;
}

interface ProjectInformationStepProps {
  projectTitle: string;
  localDescription: string; // This will now hold the "Storyline"
  genre: string;
  customGenre: string;
  visualStyle: string; 
  customVisualStyle: string;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onLocalDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; // Renamed to reflect its new purpose
  onGenerateBasicInfo: () => void; 
  isGeneratingBasicInfo: boolean; 
  disabled?: boolean;
}
const ProjectInformationStep: React.FC<ProjectInformationStepProps> = React.memo(({
  projectTitle, localDescription, genre, customGenre, 
  visualStyle, customVisualStyle, 
  onFormChange, onLocalDescriptionChange,
  onGenerateBasicInfo, isGeneratingBasicInfo, 
  disabled
}) => (
  <>
    <Input label="Project Title*" name="projectTitle" id="projectTitle" value={projectTitle} onChange={onFormChange} placeholder="Enter your project title" required disabled={disabled || isGeneratingBasicInfo} />
    <Textarea 
        label="Storyline*" 
        name="description" 
        id="projectStoryline" 
        value={localDescription} 
        onChange={onLocalDescriptionChange} 
        placeholder="Outline your storyline, plot points, or key narrative beats..." 
        required 
        rows={4} 
        disabled={disabled || isGeneratingBasicInfo}
    />
    <div>
      <Select label="Choose Genre*" name="genre" id="projectGenre" options={GENRE_OPTIONS.map(opt => ({label: opt, value: opt}))} value={genre} onChange={onFormChange} required = {!genre && !customGenre} placeholder="Select a genre" disabled={disabled || isGeneratingBasicInfo}/>
      {genre === "Other" && (
        <Input label="Custom Genre*" name="customGenre" id="projectCustomGenre" value={customGenre} onChange={onFormChange} placeholder="Specify other genre" className="mt-2" required={genre === "Other"} disabled={disabled || isGeneratingBasicInfo}/>
      )}
    </div>
    <div>
      <Select label="Visual Style*" name="visualStyle" id="projectVisualStyle" options={VISUAL_STYLE_OPTIONS.map(opt => ({label: opt, value: opt}))} value={visualStyle} onChange={onFormChange} required placeholder="Select a visual style" disabled={disabled || isGeneratingBasicInfo}/>
      {visualStyle === "Other" && (
        <Input label="Custom Visual Style*" name="customVisualStyle" id="projectCustomVisualStyle" value={customVisualStyle} onChange={onFormChange} placeholder="Specify other visual style" required={visualStyle === "Other"} className="mt-2" disabled={disabled || isGeneratingBasicInfo}/>
      )}
    </div>
  </>
));
ProjectInformationStep.displayName = 'ProjectInformationStep';

interface SceneSetupAndVisualsStepProps {
  narrativeTone: string; 
  totalDuration: string;
  eraSetting: string;
  mainConflict: string;
  themes: string[];
  cameraAngles: string[]; 
  lightingStyles: string[]; 
  sceneConfigurations: SceneConfigFormData[];
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onTagChange: (name: 'themes' | 'cameraAngles' | 'lightingStyles', newTags: string[]) => void; 
  onTotalDurationChange: (duration: string) => void;
  onSceneConfigChange: (index: number, field: keyof SceneConfigFormData, value: string | number) => void;
  onNumberOfScenesChange: (numScenes: number) => void;
  onAddSceneConfig: () => void;
  onRemoveSceneConfig: (index: number) => void;
  disabled?: boolean;
}

const DURATION_BUTTON_OPTIONS = [
    { label: "15s", value: "15" }, { label: "30s", value: "30" },
    { label: "1 min", value: "60" }, { label: "2 min", value: "120" },
    { label: "3 min", value: "180" }, { label: "4 min", value: "240" },
    { label: "5 min", value: "300" },
];

const SceneSetupAndVisualsStep: React.FC<SceneSetupAndVisualsStepProps> = React.memo(({
  narrativeTone, totalDuration, eraSetting, mainConflict, themes,
  cameraAngles, lightingStyles, sceneConfigurations,
  onFormChange, onTagChange, onTotalDurationChange,
  onSceneConfigChange, onNumberOfScenesChange, onAddSceneConfig, onRemoveSceneConfig,
  disabled
}) => {
  const recommendedScenesInfo = DURATION_SCENE_RECOMMENDATIONS[totalDuration] || { typical: "1-3 scenes" };
  const currentTotalSceneDuration = sceneConfigurations.reduce((sum, sc) => sum + Number(sc.duration || 0), 0);
  const totalVideoDurationNum = Number(totalDuration || 0);

  return (
    <>
      <Select label="Narrative Tone*" name="narrativeTone" id="projectNarrativeTone" options={NARRATIVE_TONE_OPTIONS.map(opt => ({label: opt, value: opt}))} value={narrativeTone} onChange={onFormChange} required placeholder="Select a tone (or let AI suggest)" disabled={disabled}/>
      
      <div>
          <label className="block text-base font-medium text-neutral-700 dark:text-neutral-100 mb-2.5">Total Video Duration*</label> 
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5"> 
              {DURATION_BUTTON_OPTIONS.map(opt => (
                  <Button type="button" key={opt.value} variant={totalDuration === opt.value ? 'primary' : 'secondary'} onClick={() => onTotalDurationChange(opt.value)} className="w-full" size="md" disabled={disabled}> 
                      {opt.label}
                  </Button>
              ))}
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-2.5">Tip: Duration affects the number of scenes & shots. Each shot typically lasts 1-8 seconds.</p> 
      </div>

      <Card className="p-5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
        <h3 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">Scene Breakdown</h3>
        <div className="mb-4">
          <Input
            type="number"
            label={`Number of Scenes (Recommended: ${recommendedScenesInfo.typical})`}
            id="numberOfScenesManual"
            value={sceneConfigurations.length.toString()}
            onChange={(e) => onNumberOfScenesChange(parseInt(e.target.value, 10) || 0)}
            min={1}
            max={20} // Arbitrary max
            disabled={disabled}
            className="w-full md:w-1/2"
          />
           <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
            Current total duration of scenes: {currentTotalSceneDuration}s / {totalVideoDurationNum}s
          </p>
          {currentTotalSceneDuration !== totalVideoDurationNum && (
             <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                Warning: Sum of scene durations ({currentTotalSceneDuration}s) does not match total video duration ({totalVideoDurationNum}s).
            </p>
          )}
        </div>

        {sceneConfigurations.map((sceneConfig, index) => {
          const pacingOption = PACING_OPTIONS.find(p => p.value === sceneConfig.pacing);
          const avgShotDur = pacingOption ? pacingOption.averageShotDuration : 4.5;
          const recommendedShots = sceneConfig.duration > 0 && avgShotDur > 0 ? Math.max(1, Math.round(sceneConfig.duration / avgShotDur)) : 0;

          return (
            <Card key={sceneConfig.id} className="mb-4 p-4 relative bg-white dark:bg-brand-bg-card">
              <div className="flex justify-between items-start mb-3">
                 <h4 className="text-lg font-medium text-neutral-700 dark:text-neutral-200">Scene {index + 1}</h4>
                  {sceneConfigurations.length > 1 && (
                    <Button variant="ghost" size="sm" onClick={() => onRemoveSceneConfig(index)} className="!p-1 text-red-500 hover:!bg-red-100 dark:hover:!bg-red-700/50" disabled={disabled} aria-label={`Remove Scene ${index + 1}`}>
                      <TrashIcon className="w-5 h-5" />
                    </Button>
                  )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Scene Title (Optional)"
                  id={`sceneTitle-${sceneConfig.id}`}
                  value={sceneConfig.title}
                  onChange={(e) => onSceneConfigChange(index, 'title', e.target.value)}
                  placeholder={`e.g., The Discovery`}
                  disabled={disabled}
                />
                <Input
                  type="number"
                  label="Duration (seconds)*"
                  id={`sceneDuration-${sceneConfig.id}`}
                  value={sceneConfig.duration.toString()}
                  onChange={(e) => onSceneConfigChange(index, 'duration', parseInt(e.target.value, 10) || 0)}
                  min={1}
                  disabled={disabled}
                  required
                />
                <Select
                  label="Pacing*"
                  id={`scenePacing-${sceneConfig.id}`}
                  options={PACING_OPTIONS.map(opt => ({label: opt.label, value: opt.value}))}
                  value={sceneConfig.pacing}
                  onChange={(e) => onSceneConfigChange(index, 'pacing', e.target.value as PacingOptionValue)}
                  disabled={disabled}
                  required
                />
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">Recommended shots for this scene: ~{recommendedShots}</p>
            </Card>
          );
        })}
         <Button type="button" variant="secondary" onClick={onAddSceneConfig} leftIcon={<PlusCircleIcon className="w-5 h-5"/>} disabled={disabled || sceneConfigurations.length >= 20} size="sm" className="mt-3">Add Scene</Button>
      </Card>

      <Input label="Era / Setting" name="eraSetting" id="projectEraSetting" value={eraSetting} onChange={onFormChange} placeholder="Example: Dystopian Future, Year 2077..." disabled={disabled} />
      <Textarea label="Main Conflict (Optional)" name="mainConflict" id="projectMainConflict" value={mainConflict} onChange={onFormChange} placeholder="Main character challenge..." disabled={disabled} />
      <TagInput label="Themes (Optional)" id="projectThemes" tags={themes} setTags={(newTags) => onTagChange('themes', newTags)} placeholder="Example: Sacrifice, Friendship..." suggestions={["Love", "Betrayal", "Redemption", "Survival"]} disabled={disabled} />
      <TagInput 
          label="Project-Level Camera Angles (Optional)" 
          id="projectCameraAngles" 
          tags={cameraAngles} 
          setTags={(newTags) => onTagChange('cameraAngles', newTags)} 
          placeholder="e.g., Low-Angle Shot, POV..." 
          suggestions={CAMERA_ANGLE_OPTIONS} 
          disabled={disabled}
      />
      <TagInput 
          label="Project-Level Lighting Styles (Optional)" 
          id="projectLightingStyles" 
          tags={lightingStyles} 
          setTags={(newTags) => onTagChange('lightingStyles', newTags)} 
          placeholder="e.g., Chiaroscuro, Neon..." 
          suggestions={LIGHTING_STYLE_OPTIONS} 
          disabled={disabled}
      />
    </>
  );
});
SceneSetupAndVisualsStep.displayName = 'SceneSetupAndVisualsStep';


interface CharactersStepProps {
  characters: Character[];
  cameraMovement: string[];
  onCharacterChange: (index: number, field: keyof Character, value: string) => void;
  onAddCharacter: () => void;
  onRemoveCharacter: (index: number) => void;
  onSetIsCameraModalOpen: (isOpen: boolean) => void;
  onGenerateCharacters: () => void; 
  isGeneratingCharacters: boolean; 
  disabled?: boolean;
}
const CharactersStep: React.FC<CharactersStepProps> = React.memo(({
  characters, cameraMovement,
  onCharacterChange, onAddCharacter, onRemoveCharacter, onSetIsCameraModalOpen,
  onGenerateCharacters, isGeneratingCharacters, 
  disabled
}) => (
  <>
    <div>
      <div className="flex justify-between items-center mb-2.5">
        <label className="block text-base font-medium text-neutral-700 dark:text-neutral-100">Characters</label>
        <Button
            type="button"
            variant="outline"
            onClick={onGenerateCharacters}
            leftIcon={isGeneratingCharacters ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <LightBulbIcon className="w-5 h-5" />}
            disabled={disabled || isGeneratingCharacters}
            size="md"
        >
            {isGeneratingCharacters ? 'Generating...' : 'Generate Characters with AI'}
        </Button>
      </div>
      {characters.map((char, index) => (
        <div key={char.id} className="p-5 border border-neutral-300 dark:border-neutral-700 rounded-lg mb-5 space-y-4 bg-neutral-50 dark:bg-neutral-800 relative"> 
          {characters.length > 1 && (
              <button type="button" onClick={() => onRemoveCharacter(index)} className={`absolute top-3.5 right-3.5 text-neutral-500 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-500 p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors`} disabled={disabled || isGeneratingCharacters}> 
                  <XMarkIcon className="w-6 h-6" /> 
              </button>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5"> 
            <Input label={`Name`} id={`charName-${char.id}`} value={char.name} onChange={(e) => onCharacterChange(index, 'name', e.target.value)} placeholder={`Character ${index + 1} Name`} disabled={disabled || isGeneratingCharacters}/>
            <Input label={`Label (@tag)`} id={`charLabel-${char.id}`} value={char.label} onChange={(e) => onCharacterChange(index, 'label', e.target.value)} placeholder="e.g. @protagonist" disabled={disabled || isGeneratingCharacters}/>
          </div>
          <Textarea 
            label={`Description`} 
            id={`charDesc-${char.id}`} 
            value={char.description} 
            onChange={(e) => onCharacterChange(index, 'description', e.target.value)} 
            placeholder="Visual appearance & brief role... (e.g., Tall, red hair, detective coat)" 
            rows={2} 
            disabled={disabled || isGeneratingCharacters}
          />
        </div>
      ))}
      <Button type="button" variant="secondary" onClick={onAddCharacter} leftIcon={<PlusCircleIcon className="w-6 h-6"/>} disabled={disabled || characters.length >=5 || isGeneratingCharacters} size="md">Add Character</Button> 
    </div>
    <div>
        <label className="block text-base font-medium text-neutral-700 dark:text-neutral-100 mb-1.5">Choose Camera Movement Preferences</label> 
        <div className={`p-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg min-h-[48px] flex flex-wrap gap-2 items-center`}> 
            {cameraMovement.length === 0 && <span className="text-neutral-500 dark:text-neutral-500 text-base px-1">No movements selected</span>} 
            {cameraMovement.map(move => (
                <span key={move} className={`bg-brand-teal bg-opacity-20 text-brand-teal text-sm px-2.5 py-1 rounded-full font-medium`}>{move}</span> 
            ))}
        </div>
        <Button type="button" variant="outline" onClick={() => onSetIsCameraModalOpen(true)} className="mt-2.5" disabled={disabled || isGeneratingCharacters} size="md"> 
            Select Camera Movements
        </Button>
        <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1.5">Click the button above to select multiple camera movements from a list.</p> 
    </div>
  </>
));
CharactersStep.displayName = 'CharactersStep';

interface OutputStepProps {
  targetPlatform: string;
  audienceAge: string;
  promptLanguageStyle: string;
  keyMoments: string;
  desiredEnding: string;
  specificElements: string;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  disabled?: boolean;
}
const OutputStep: React.FC<OutputStepProps> = React.memo(({ 
  targetPlatform, audienceAge, promptLanguageStyle, keyMoments, desiredEnding, specificElements,
  onFormChange, disabled
}) => (
  <>
    <Select 
        label="Target Platform*" 
        name="targetPlatform" 
        id="projectTargetPlatform" 
        options={TARGET_PLATFORM_OPTIONS.map(opt => ({label: opt, value: opt}))} 
        value={targetPlatform} 
        onChange={onFormChange} 
        placeholder="Select platform" 
        required
        disabled={disabled}
    />
    <Select 
        label="Audience Age (Optional)" 
        name="audienceAge" 
        id="projectAudienceAge" 
        options={AUDIENCE_AGE_OPTIONS.map(opt => ({label: opt, value: opt}))} 
        value={audienceAge === 'All Ages' ? '' : audienceAge} 
        onChange={onFormChange} 
        placeholder="Select audience age" 
        disabled={disabled}
    />
    <Select label="Prompt Language Style*" name="promptLanguageStyle" id="projectPromptLanguageStyle" options={PROMPT_LANGUAGE_STYLE_OPTIONS.map(opt => ({label: opt, value: opt}))} value={promptLanguageStyle} onChange={onFormChange} required placeholder="Select Language Style*" disabled={disabled}/>
    <Textarea label="Key Moments / Climax (Optional)" name="keyMoments" id="projectKeyMoments" value={keyMoments} onChange={onFormChange} placeholder="Describe 1-2 most important scenes..." disabled={disabled}/>
    <Textarea label="Ending Detail / Key Message*" name="desiredEnding" id="projectDesiredEnding" value={desiredEnding} onChange={onFormChange} placeholder="Describe the story ending or final emotion/message..." required disabled={disabled}/>
    <Textarea label="Specific Elements to Include/Avoid (Optional)" name="specificElements" id="projectSpecificElements" value={specificElements} onChange={onFormChange} placeholder="Example: Include many nature scenes. Avoid violence..." disabled={disabled}/>
  </>
));
OutputStep.displayName = 'OutputStep';

interface FormSectionContainerProps {
    title: string;
    children: React.ReactNode;
    titleButton?: React.ReactNode; 
}
const FormSectionContainer: React.FC<FormSectionContainerProps> = React.memo(({ title, children, titleButton }) => (
    <div className="bg-white dark:bg-brand-bg-card p-6 md:p-8 rounded-lg shadow-md dark:shadow-neutral-900/50 border border-neutral-200 dark:border-transparent">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">{title}</h2>
        {titleButton}
      </div>
      <div className="space-y-8">{children}</div> 
    </div>
));
FormSectionContainer.displayName = 'FormSectionContainer';

const GeneratingOverlay: React.FC<{message: string}> = ({message}) => (
  <div className="fixed inset-0 bg-brand-dark bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center z-[100] text-white p-4">
    <svg className={`animate-spin h-14 w-14 text-brand-teal mb-5`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> 
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p className="text-2xl font-semibold mb-2.5">{message}</p> 
    <p className="text-lg text-neutral-300">Please wait while we process your request.</p> 
  </div>
);
GeneratingOverlay.displayName = 'GeneratingOverlay';


const parseStrictJsonResponse = (responseText: string | undefined): any => {
    if (!responseText) {
        console.error("Attempted to parse empty or undefined response text for strict JSON parsing.");
        throw new Error("AI response was empty or undefined.");
    }
    let jsonStr = responseText.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    jsonStr = jsonStr.replace(/,\s*([}\]])/g, '$1'); 
    try {
      return JSON.parse(jsonStr);
    } catch (e: any) {
      console.error("Failed to parse JSON response (strict parsing):", e.message, "Processed string was:", jsonStr, "Original response text:", responseText);
      throw new Error(`AI returned invalid JSON: ${e.message}.`);
    }
};

// SIMULATED AI API CALL for Storyboard Details
const generateStoryboardDetailsFromAI = async (currentData: StoryboardFormData): Promise<AiGeneratedDetails> => {
    console.log("Simulating AI call for storyboard details with data:", currentData);
    
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    // Remove "(AI)" or "(GPT)" from mock responses
    const mockResponse: AiGeneratedDetails = {
        visualStyle: currentData.visualStyle || VISUAL_STYLE_OPTIONS[0],
        customVisualStyle: currentData.visualStyle === "Other" ? (currentData.customVisualStyle || "Mock Custom Style") : "",
        narrativeTone: currentData.narrativeTone || NARRATIVE_TONE_OPTIONS[0],
        eraSetting: currentData.eraSetting || "Near Future, Post-Apocalyptic City",
        mainConflict: currentData.mainConflict || "Protagonist vs. The Corrupt System",
        themes: currentData.themes.length > 0 ? currentData.themes : ["Survival", "Hope"],
        cameraAngles: currentData.cameraAngles && currentData.cameraAngles.length > 0 ? currentData.cameraAngles : [CAMERA_ANGLE_OPTIONS[0], CAMERA_ANGLE_OPTIONS[1]],
        lightingStyles: currentData.lightingStyles && currentData.lightingStyles.length > 0 ? currentData.lightingStyles : [LIGHTING_STYLE_OPTIONS[0], LIGHTING_STYLE_OPTIONS[1]],
        characters: currentData.characters.length > 0 && (currentData.characters[0].name || currentData.characters[0].description)
            ? currentData.characters.map(c => ({ ...c, description: c.description || "Enriched mock description." }))
            : [{ id: 'char-ai-1', name: 'Character One', label: '@hero_sim', description: 'A character generated by simulation, focusing on visual details.' }],
        cameraMovement: currentData.cameraMovement.length > 0 ? currentData.cameraMovement : [CAMERA_MOVEMENT_OPTIONS[0], CAMERA_MOVEMENT_OPTIONS[1]],
        keyMoments: currentData.keyMoments || "Key Moment 1, Key Moment 2",
        desiredEnding: currentData.desiredEnding || "A bittersweet resolution.",
        specificElements: currentData.specificElements || "Include: Element A. Avoid: Element B."
    };
    
    return mockResponse;
};


const GenerateStoryboardPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<StoryboardFormData>(() => {
    const locationState = location.state as { formData?: StoryboardFormData; source?: string };
    if (locationState?.formData) {
      return {
        ...getNewInitialFormData(), 
        ...locationState.formData, 
        characters: locationState.formData.characters && locationState.formData.characters.length > 0 ? locationState.formData.characters : [{ id: `char-init-${Date.now()}`, name: '', label: '', description: '' }],
        sceneConfigurations: locationState.formData.sceneConfigurations || []
      };
    }
    return getNewInitialFormData();
  });

  const [localDescription, setLocalDescription] = useState<string>(formData.description); // Will hold storyline
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [tempCameraMovements, setTempCameraMovements] = useState<string[]>([]);
  
  const [isGeneratingBasicInfo, setIsGeneratingBasicInfo] = useState(false);
  const [isGeneratingStoryDetailsAI, setIsGeneratingStoryDetailsAI] = useState(false);
  const [isGeneratingCharacters, setIsGeneratingCharacters] = useState(false); 
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [generatingMessage, setGeneratingMessage] = useState<string>("Generating Story Details...");
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [characterGenerationError, setCharacterGenerationError] = useState<string | null>(null); 
  const [basicInfoValidationError, setBasicInfoValidationError] = useState<string | null>(null);
  const [toastInfo, setToastInfo] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info', icon?: React.ReactNode }>({ show: false, message: '', type: 'success' });


  useEffect(() => {
    const locationState = location.state as { formData?: StoryboardFormData; source?: string };
    if (locationState?.formData) {
        const mergedFormData = {
            ...initialStoryboardFormDataDef,
            ...locationState.formData,
            characters: locationState.formData.characters && locationState.formData.characters.length > 0 
                        ? locationState.formData.characters 
                        : [{ id: `char-init-${Date.now()}`, name: '', label: '', description: '' }],
            sceneConfigurations: locationState.formData.sceneConfigurations || initialStoryboardFormDataDef.sceneConfigurations || []
        };
        setFormData(mergedFormData);
        if ((!mergedFormData.sceneConfigurations || mergedFormData.sceneConfigurations.length === 0) && mergedFormData.totalDuration) {
            initializeSceneConfigurations(mergedFormData.totalDuration, mergedFormData.sceneConfigurations || []);
        }
        navigate(location.pathname, { replace: true, state: {} });
    } else {
        if ((!formData.sceneConfigurations || formData.sceneConfigurations.length === 0) && formData.totalDuration) {
             initializeSceneConfigurations(formData.totalDuration, formData.sceneConfigurations || []);
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, navigate]); 

  useEffect(() => {
    setLocalDescription(formData.description || '');
  }, [formData.description]);


  useEffect(() => {
    if (isCameraModalOpen) {
      setTempCameraMovements([...formData.cameraMovement]);
    }
  }, [isCameraModalOpen, formData.cameraMovement]);
  
  useEffect(() => {
    let timer: number;
    if (toastInfo.show) {
      timer = window.setTimeout(() => {
        setToastInfo({ show: false, message: '', type: 'success', icon: undefined });
      }, 4000); 
    }
    return () => window.clearTimeout(timer);
  }, [toastInfo.show]);


  const initializeSceneConfigurations = useCallback((totalDurationStr: string, existingConfigs: SceneConfigFormData[]) => {
    if (existingConfigs.length > 0) { 
        setFormData(prev => ({ ...prev, sceneConfigurations: existingConfigs }));
        return;
    }
    const totalDurationNum = parseInt(totalDurationStr, 10) || 60;
    const recommendation = DURATION_SCENE_RECOMMENDATIONS[totalDurationStr] || DURATION_SCENE_RECOMMENDATIONS["60"];
    let numScenes = recommendation.minScenes; 
    
    const recommendedEntry = Object.entries(DURATION_SCENE_RECOMMENDATIONS).find(([key]) => key === totalDurationStr);
    if (recommendedEntry) {
        numScenes = recommendedEntry[1].minScenes; 
    }


    if (numScenes > 0) {
        const baseDurationPerScene = Math.max(1, Math.floor(totalDurationNum / numScenes));
        let remainderDuration = totalDurationNum % numScenes;
        const newConfigs: SceneConfigFormData[] = Array.from({ length: numScenes }, (_, i) => {
            let sceneDuration = baseDurationPerScene + (remainderDuration > 0 ? 1 : 0);
            if (remainderDuration > 0) remainderDuration--;
            return {
                id: `scene-cfg-${Date.now()}-${i}`,
                title: `Scene ${i + 1}`,
                duration: sceneDuration,
                pacing: 'M' as PacingOptionValue, // Default to Medium Pacing
            };
        });
        const currentSum = newConfigs.reduce((sum, cfg) => sum + cfg.duration, 0);
        if (currentSum !== totalDurationNum && newConfigs.length > 0) {
            const diff = totalDurationNum - currentSum;
            newConfigs[newConfigs.length - 1].duration += diff;
            if (newConfigs[newConfigs.length - 1].duration < 1) newConfigs[newConfigs.length - 1].duration = 1; 
        }
        setFormData(prev => ({ ...prev, sceneConfigurations: newConfigs }));
    } else {
        setFormData(prev => ({ ...prev, sceneConfigurations: [] }));
    }
  }, []);


  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newState = { ...prev, [name]: value };
      if (name === 'genre' && value !== 'Other') newState.customGenre = '';
      if (name === 'visualStyle' && value !== 'Other') newState.customVisualStyle = '';
      if (name === 'audienceAge' && value === '') {
        newState.audienceAge = 'All Ages';
      }
      return newState;
    });
    if (['projectTitle', 'genre', 'customGenre', 'visualStyle', 'customVisualStyle'].includes(name)) { 
        setBasicInfoValidationError(null);
    }
  }, []);

  const handleTotalDurationChange = useCallback((duration: string) => {
    setFormData(prev => ({ ...prev, totalDuration: duration }));
    initializeSceneConfigurations(duration, []); 
  }, [initializeSceneConfigurations]);
  
  const handleTagChange = useCallback((name: 'themes' | 'cameraAngles' | 'lightingStyles', newTags: string[]) => {
    setFormData(prev => ({ ...prev, [name]: newTags }));
  }, []);

  const handleCharacterChange = useCallback((index: number, field: keyof Character, value: string) => {
    setFormData(prev => {
      const updatedCharacters = [...prev.characters];
      updatedCharacters[index] = { ...updatedCharacters[index], [field]: value };
      return { ...prev, characters: updatedCharacters };
    });
  }, []);

  const addCharacter = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      characters: [...prev.characters, { id: `char-${Date.now()}`, name: '', label: '', description: '' }]
    }));
  }, []);

  const removeCharacter = useCallback((index: number) => {
    setFormData(prev => ({ ...prev, characters: prev.characters.filter((_, i) => i !== index) }));
  }, []);

  const handleLocalDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalDescription(e.target.value);
    setBasicInfoValidationError(null);
  }, []);

  const handleSceneConfigChange = useCallback((index: number, field: keyof SceneConfigFormData, value: string | number) => {
    setFormData(prev => {
      const newConfigs = [...(prev.sceneConfigurations || [])];
      if (newConfigs[index]) {
        (newConfigs[index] as any)[field] = value; 
      }
      return { ...prev, sceneConfigurations: newConfigs };
    });
  }, []);

  const handleNumberOfScenesChange = useCallback((numScenesInput: number) => {
      const numScenes = Math.max(0, Math.min(20, numScenesInput)); 
      const totalDurationNum = parseInt(formData.totalDuration, 10) || 60;
      
      setFormData(prev => {
          const currentConfigs = prev.sceneConfigurations || [];
          const newConfigs: SceneConfigFormData[] = [];
          
          const baseDurationPerScene = numScenes > 0 ? Math.max(1, Math.floor(totalDurationNum / numScenes)) : 0;
          let remainderDuration = numScenes > 0 ? totalDurationNum % numScenes : 0;

          for (let i = 0; i < numScenes; i++) {
              if (i < currentConfigs.length) {
                  newConfigs.push({ ...currentConfigs[i] }); 
              } else {
                  let sceneDuration = baseDurationPerScene + (remainderDuration > 0 ? 1 : 0);
                  if (remainderDuration > 0) remainderDuration--;
                  newConfigs.push({
                      id: `scene-cfg-${Date.now()}-${i}`,
                      title: `Scene ${i + 1}`,
                      duration: sceneDuration,
                      pacing: 'M' as PacingOptionValue, // Default to Medium Pacing
                  });
              }
          }
          return { ...prev, sceneConfigurations: newConfigs };
      });
  }, [formData.totalDuration]);

  const handleAddSceneConfig = useCallback(() => {
    setFormData(prev => {
        const newId = `scene-cfg-${Date.now()}-${(prev.sceneConfigurations || []).length}`;
        const newSceneConfig: SceneConfigFormData = {
            id: newId,
            title: `Scene ${(prev.sceneConfigurations || []).length + 1}`,
            duration: 10, // Default duration for a new scene
            pacing: 'M' // Default to Medium Pacing
        };
        return {
            ...prev,
            sceneConfigurations: [...(prev.sceneConfigurations || []), newSceneConfig]
        };
    });
  }, []);

  const handleRemoveSceneConfig = useCallback((indexToRemove: number) => {
    setFormData(prev => ({
        ...prev,
        sceneConfigurations: (prev.sceneConfigurations || []).filter((_, index) => index !== indexToRemove)
    }));
  }, []);
  
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const currentFullFormData = { ...formData, description: localDescription };

     if (!currentFullFormData.sceneConfigurations || currentFullFormData.sceneConfigurations.length === 0) {
        setToastInfo({ show: true, message: 'Please define at least one scene in Step 2.', type: 'error', icon: <AlertIcon />});
        setCurrentStep(2);
        return;
    }
    const sceneDurationSum = currentFullFormData.sceneConfigurations.reduce((sum, sc) => sum + Number(sc.duration || 0), 0);
    const totalVideoDurationNumSubmit = Number(currentFullFormData.totalDuration || 0);
    if (Math.abs(sceneDurationSum - totalVideoDurationNumSubmit) > 1 && currentFullFormData.sceneConfigurations.length > 0) { 
        setToastInfo({ show: true, message: `Sum of scene durations (${sceneDurationSum}s) should closely match total video duration (${totalVideoDurationNumSubmit}s). Please adjust in Step 2.`, type: 'error', icon: <AlertIcon /> });
        setCurrentStep(2);
        return;
    }

    if (!currentFullFormData.targetPlatform) {
      setToastInfo({ show: true, message: 'Please select a Target Platform.', type: 'error', icon: <AlertIcon />});
      setCurrentStep(4); 
      return;
    }
    if (!currentFullFormData.desiredEnding) {
       setToastInfo({ show: true, message: 'Please fill in the Ending Detail / Key Message.', type: 'error', icon: <AlertIcon />});
       setCurrentStep(4);
       return;
    }
    
    setGeneratingMessage("Refining story details...");
    setIsGeneratingStoryDetailsAI(true);
    let finalFormDataForPreview = currentFullFormData;

    try {
        const aiSuggestions = await generateStoryboardDetailsFromAI(currentFullFormData);
        finalFormDataForPreview = {
            ...currentFullFormData,
            visualStyle: (currentFullFormData.visualStyle && currentFullFormData.visualStyle !== initialStoryboardFormDataDef.visualStyle) ? currentFullFormData.visualStyle : (aiSuggestions.visualStyle || currentFullFormData.visualStyle || initialStoryboardFormDataDef.visualStyle),
            customVisualStyle: (currentFullFormData.visualStyle === 'Other' || aiSuggestions.visualStyle === 'Other') ? (currentFullFormData.customVisualStyle || aiSuggestions.customVisualStyle || '') : '',
            narrativeTone: NARRATIVE_TONE_OPTIONS.includes(aiSuggestions.narrativeTone || '') ? aiSuggestions.narrativeTone! : (currentFullFormData.narrativeTone || ''),
            eraSetting: (currentFullFormData.eraSetting && currentFullFormData.eraSetting !== initialStoryboardFormDataDef.eraSetting) ? currentFullFormData.eraSetting : (aiSuggestions.eraSetting || currentFullFormData.eraSetting || initialStoryboardFormDataDef.eraSetting),
            mainConflict: currentFullFormData.mainConflict ? currentFullFormData.mainConflict : (aiSuggestions.mainConflict || ''),
            themes: currentFullFormData.themes.length > 0 ? currentFullFormData.themes : (aiSuggestions.themes || []),
            cameraAngles: (currentFullFormData.cameraAngles && currentFullFormData.cameraAngles.length > 0) ? currentFullFormData.cameraAngles : (aiSuggestions.cameraAngles || []),
            lightingStyles: (currentFullFormData.lightingStyles && currentFullFormData.lightingStyles.length > 0) ? currentFullFormData.lightingStyles : (aiSuggestions.lightingStyles || []),
            characters: (currentFullFormData.characters.length === 1 && !currentFullFormData.characters[0].name && !currentFullFormData.characters[0].description && aiSuggestions.characters && aiSuggestions.characters.length > 0) ? aiSuggestions.characters : currentFullFormData.characters,
            cameraMovement: currentFullFormData.cameraMovement.length > 0 ? currentFullFormData.cameraMovement : (aiSuggestions.cameraMovement || []),
            keyMoments: currentFullFormData.keyMoments ? currentFullFormData.keyMoments : (aiSuggestions.keyMoments || ''),
            desiredEnding: currentFullFormData.desiredEnding ? currentFullFormData.desiredEnding : (aiSuggestions.desiredEnding || ''),
            specificElements: currentFullFormData.specificElements ? currentFullFormData.specificElements : (aiSuggestions.specificElements || ''),
        };
        setToastInfo({ show: true, message: 'Story details refined by AI!', type: 'success', icon: <CheckCircleIcon /> });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to refine story details with AI. Proceeding with current data.";
        setToastInfo({ show: true, message: errorMessage, type: 'error', icon: <AlertIcon /> });
    } finally {
        setIsGeneratingStoryDetailsAI(false);
    }

    setGeneratingMessage("Generating storyboard structure...");
    let storyboardDataForImageGen = generateMockStoryboard(finalFormDataForPreview); 

    setGeneratingMessage(`Generating images (0/${storyboardDataForImageGen.totalShots})...`);
    setIsGeneratingImages(true); 

    if (!process.env.API_KEY) {
      setToastInfo({ show: true, message: "API Key is not configured. Cannot generate images.", type: 'error', icon: <AlertIcon /> });
      setIsGeneratingImages(false);
      navigate('/preview-storyboard', { state: { generatedData: storyboardDataForImageGen } });
      return;
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    let imagesGeneratedCount = 0;

    const allShotsFlat: { shot: ShotData, segmentId: string, isTrailer: boolean }[] = [];
    if (storyboardDataForImageGen.trailer) {
        storyboardDataForImageGen.trailer.shots.forEach(shot => allShotsFlat.push({ shot, segmentId: storyboardDataForImageGen.trailer!.id, isTrailer: true }));
    }
    storyboardDataForImageGen.scenes.forEach(scene => {
        scene.shots.forEach(shot => allShotsFlat.push({ shot, segmentId: scene.id, isTrailer: false }));
    });
    
    // Create a mutable copy of the storyboard data to update
    let mutableStoryboardData = JSON.parse(JSON.stringify(storyboardDataForImageGen)) as StoryboardPreviewData;

    for (const { shot, segmentId, isTrailer } of allShotsFlat) {
        try {
            // Add a delay before each API call
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay

            // Find the shot in the mutable copy and update its status
            const updateShotInPlace = (currentShot: ShotData, status: 'generating' | 'generated' | 'error', imageUrl?: string) => {
                currentShot.imageStatus = status;
                if (imageUrl) currentShot.generatedImageUrl = imageUrl;
            };

            let targetShotRef: ShotData | undefined;
            if (isTrailer && mutableStoryboardData.trailer) {
                targetShotRef = mutableStoryboardData.trailer.shots.find(s => s.id === shot.id);
            } else {
                const scene = mutableStoryboardData.scenes.find(s => s.id === segmentId);
                if (scene) targetShotRef = scene.shots.find(s => s.id === shot.id);
            }

            if (targetShotRef) updateShotInPlace(targetShotRef, 'generating');
            
            setGeneratingMessage(`Generating images (${imagesGeneratedCount}/${mutableStoryboardData.totalShots})...`);

            const imageGenResponse = await ai.models.generateImages({
                model: 'imagen-3.0-generate-002',
                prompt: shot.imagePrompt || `A concept for ${shot.narrativeDescription || 'a shot'}`,
                config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
            });

            if (imageGenResponse.generatedImages && imageGenResponse.generatedImages.length > 0 && imageGenResponse.generatedImages[0].image?.imageBytes) {
                const base64ImageBytes = imageGenResponse.generatedImages[0].image.imageBytes;
                if (targetShotRef) updateShotInPlace(targetShotRef, 'generated', `data:image/jpeg;base64,${base64ImageBytes}`);
            } else {
                if (targetShotRef) updateShotInPlace(targetShotRef, 'error');
                throw new Error("No image data received from API.");
            }
            imagesGeneratedCount++;
        } catch (apiError: any) {
            if (isTrailer && mutableStoryboardData.trailer) {
                const s = mutableStoryboardData.trailer.shots.find(s_ => s_.id === shot.id);
                if(s) s.imageStatus = 'error';
            } else {
                const scene = mutableStoryboardData.scenes.find(s_ => s_.id === segmentId);
                const s = scene?.shots.find(s_ => s_.id === shot.id);
                if(s) s.imageStatus = 'error';
            }
            console.error(`Error generating image for shot ${shot.fullShotIdentifier}:`, apiError);
            // Extract message from potential nested error structure
            const errorMessageFromServer = apiError.error?.message || apiError.message || 'Unknown API error';
            setToastInfo({ show: true, message: `Image generation failed for shot ${shot.fullShotIdentifier}: ${errorMessageFromServer}. Proceeding with placeholder.`, type: 'error', icon: <AlertIcon /> });
        }
    }
    setIsGeneratingImages(false); 
    setGeneratingMessage("Finalizing storyboard...");

    navigate('/preview-storyboard', { state: { generatedData: mutableStoryboardData } });

  }, [formData, localDescription, navigate]);


  const handleGenerateBasicInfoAI = useCallback(async () => {
    setGenerationError(null);
    setBasicInfoValidationError(null);
    setCharacterGenerationError(null);

    setGeneratingMessage("Generating basic info..."); 
    setIsGeneratingBasicInfo(true);

    console.log("Simulating AI call for basic info with storyline:", localDescription);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      const userStorylineIsSubstantial = localDescription.trim().length > 50;
      
      const parsedData = {
        projectTitle: userStorylineIsSubstantial ? `Title for: ${localDescription.substring(0,30)}...` : "AI Project Title", 
        description: userStorylineIsSubstantial ? localDescription : "A hero embarks on a perilous journey to retrieve a lost artifact, facing treacherous challenges and a cunning villain. Along the way, they discover their true strength and the importance of friendship. The climax sees a confrontation where good triumphs over evil.", // More storyline-like
        genre: GENRE_OPTIONS.filter(g => g !== "Other")[Math.floor(Math.random() * (GENRE_OPTIONS.length -1))],
        visualStyle: VISUAL_STYLE_OPTIONS.filter(vs => vs !== "Other")[Math.floor(Math.random() * (VISUAL_STYLE_OPTIONS.length-1))]
      };
      
      setFormData(prev => ({
        ...prev,
        projectTitle: parsedData.projectTitle,
        description: parsedData.description, // This field now stores the storyline
        genre: parsedData.genre,
        visualStyle: parsedData.visualStyle,
        customGenre: '', 
        customVisualStyle: '' 
      }));
      setLocalDescription(parsedData.description); 
      setToastInfo({ show: true, message: 'Basic project info generated by AI!', type: 'success', icon: <CheckCircleIcon /> });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during AI generation for basic info.";
      setGenerationError(errorMessage);
      setToastInfo({ show: true, message: errorMessage, type: 'error', icon: <AlertIcon /> });
    } finally {
      setIsGeneratingBasicInfo(false);
    }
  }, [localDescription]); 


  const handleNextStep = useCallback(async () => {
    const currentFullFormData = { ...formData, description: localDescription };
    setGenerationError(null);
    setBasicInfoValidationError(null); 
    setCharacterGenerationError(null);
        
    if (currentStep === 1) {
      const { projectTitle, genre, customGenre, visualStyle, customVisualStyle } = currentFullFormData; 
      const storylineToValidate = localDescription; // Changed from descriptionToValidate
      let missingFieldsMessage = "";
      if (!projectTitle.trim()) missingFieldsMessage += "Project Title, ";
      if (!storylineToValidate.trim()) missingFieldsMessage += "Storyline, ";
      if (!genre.trim() && !customGenre.trim()) missingFieldsMessage += "Genre, ";
      if (genre === "Other" && !customGenre.trim()) missingFieldsMessage += "Custom Genre, ";
      if (!visualStyle.trim() && !customVisualStyle.trim()) missingFieldsMessage += "Visual Style, "; 
      if (visualStyle === "Other" && !customVisualStyle.trim()) missingFieldsMessage += "Custom Visual Style, ";


      if (missingFieldsMessage) {
        const message = `Please fill in the required Basic Info fields: ${missingFieldsMessage.slice(0, -2)}.`;
        setBasicInfoValidationError(message);
        setToastInfo({ show: true, message: message, type: 'error', icon: <AlertIcon /> });
        return;
      }
      
      setGeneratingMessage("Refining story details...");
      setIsGeneratingStoryDetailsAI(true);
      try {
        const aiSuggestions = await generateStoryboardDetailsFromAI(currentFullFormData);
        
        setFormData(prev => {
            const updatedData = { ...prev, description: localDescription }; // Ensure storyline is set from localDescription
            updatedData.visualStyle = (prev.visualStyle && prev.visualStyle !== initialStoryboardFormDataDef.visualStyle) ? prev.visualStyle : (aiSuggestions.visualStyle || prev.visualStyle || initialStoryboardFormDataDef.visualStyle);
            updatedData.customVisualStyle = updatedData.visualStyle === 'Other' ? (prev.customVisualStyle || aiSuggestions.customVisualStyle || '') : '';
            updatedData.narrativeTone = NARRATIVE_TONE_OPTIONS.includes(aiSuggestions.narrativeTone || '') ? aiSuggestions.narrativeTone! : (prev.narrativeTone || '');
            updatedData.eraSetting = (prev.eraSetting && prev.eraSetting !== initialStoryboardFormDataDef.eraSetting) ? prev.eraSetting : (aiSuggestions.eraSetting || prev.eraSetting || initialStoryboardFormDataDef.eraSetting);
            updatedData.mainConflict = prev.mainConflict ? prev.mainConflict : (aiSuggestions.mainConflict || '');
            updatedData.themes = prev.themes.length > 0 ? prev.themes : (aiSuggestions.themes || []);
            updatedData.cameraAngles = (prev.cameraAngles && prev.cameraAngles.length > 0) ? prev.cameraAngles : (aiSuggestions.cameraAngles || []);
            updatedData.lightingStyles = (prev.lightingStyles && prev.lightingStyles.length > 0) ? prev.lightingStyles : (aiSuggestions.lightingStyles || []);
            const userHasDefinedChars = prev.characters.length > 0 && (prev.characters[0].name || prev.characters[0].description);
            updatedData.characters = userHasDefinedChars ? prev.characters : (aiSuggestions.characters && aiSuggestions.characters.length > 0 ? aiSuggestions.characters : [{ id: `char-fallback-${Date.now()}`, name: 'Character 1', label: '@char1', description: 'Default character' }]);
            updatedData.cameraMovement = prev.cameraMovement.length > 0 ? prev.cameraMovement : (aiSuggestions.cameraMovement || []);
            updatedData.keyMoments = prev.keyMoments ? prev.keyMoments : (aiSuggestions.keyMoments || '');
            updatedData.desiredEnding = prev.desiredEnding ? prev.desiredEnding : (aiSuggestions.desiredEnding || '');
            updatedData.specificElements = prev.specificElements ? prev.specificElements : (aiSuggestions.specificElements || '');
            return updatedData;
        });
        setCurrentStep(prev => prev + 1);

      } catch (error) {
         const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during AI generation.";
         setGenerationError(errorMessage); 
         setToastInfo({ show: true, message: errorMessage, type: 'error', icon: <AlertIcon /> });
      } finally {
         setIsGeneratingStoryDetailsAI(false);
      }
    } else if (currentStep === 2) { 
        if (!currentFullFormData.sceneConfigurations || currentFullFormData.sceneConfigurations.length === 0) {
            setToastInfo({ show: true, message: 'Please define at least one scene.', type: 'error', icon: <AlertIcon />});
            return;
        }
        const sceneDurationSumStep2 = currentFullFormData.sceneConfigurations.reduce((sum, sc) => sum + Number(sc.duration || 0), 0);
        const totalVideoDurationNumStep2 = Number(currentFullFormData.totalDuration || 0);
        if (Math.abs(sceneDurationSumStep2 - totalVideoDurationNumStep2) > 1 && currentFullFormData.sceneConfigurations.length > 0) {
             setToastInfo({ show: true, message: `Sum of scene durations (${sceneDurationSumStep2}s) should closely match total video duration (${totalVideoDurationNumStep2}s).`, type: 'error', icon: <AlertIcon /> });
            return;
        }
        setFormData(currentFullFormData); 
        if (currentStep < STEPS.length) setCurrentStep(prev => prev + 1);

    } else {
      setFormData(currentFullFormData); 
      if (currentStep < STEPS.length) setCurrentStep(prev => prev + 1);
    }
  }, [formData, localDescription, currentStep]); 

  const handlePrevStep = useCallback(() => {
    setFormData(prev => ({...prev, description: localDescription})); // Storyline is in localDescription
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  }, [localDescription, currentStep]); 
  
  const handleToggleCameraMovement = useCallback((movement: string) => {
    setTempCameraMovements(prev => prev.includes(movement) ? prev.filter(m => m !== movement) : [...prev, movement]);
  }, []);

  const handleSelectAllCameraMovements = useCallback((selectAll: boolean) => {
    setTempCameraMovements(selectAll ? [...CAMERA_MOVEMENT_OPTIONS] : []);
  }, []);

  const handleConfirmCameraMovements = useCallback(() => {
    setFormData(prev => ({ ...prev, cameraMovement: tempCameraMovements }));
    setIsCameraModalOpen(false);
  }, [tempCameraMovements]);

  const handleGenerateCharactersAI = useCallback(async () => {
    setCharacterGenerationError(null);
    setGeneratingMessage("Generating characters..."); 
    setIsGeneratingCharacters(true);
    
    console.log("Simulating AI call for character generation with data:", formData, localDescription);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const generatedChars: Character[] = [
        { id: 'char-ai-gen-1', name: 'Captain Eva', label: '@protagonist_ai', description: 'A seasoned space explorer with a mysterious past, determined to uncover the secrets of a new planet. Visually: Wears a practical, slightly worn spacesuit, sharp eyes.' },
        { id: 'char-ai-gen-2', name: 'XR-7', label: '@sidekick_ai', description: 'A quirky, outdated service robot with surprising depth and loyalty. Visually: Metallic, somewhat dented, with expressive optical sensors.' }
      ];
      
      setFormData(prev => ({ ...prev, characters: generatedChars }));
      setToastInfo({ show: true, message: `${generatedChars.length} character(s) generated by AI!`, type: 'success', icon: <CheckCircleIcon /> });

    } catch (error) {
      const errorMsg = "Failed to generate characters. Unexpected AI response.";
      setCharacterGenerationError(errorMsg);
      setToastInfo({ show: true, message: `Character generation failed: ${errorMsg}`, type: 'error', icon: <AlertIcon /> });
    } finally {
      setIsGeneratingCharacters(false);
    }
  }, [formData, localDescription]);


  const formStepDisabled = isGeneratingBasicInfo || isGeneratingStoryDetailsAI || isGeneratingCharacters || isGeneratingImages;
  const showOverlay = formStepDisabled && (isGeneratingBasicInfo || isGeneratingStoryDetailsAI || isGeneratingCharacters || isGeneratingImages);


  return (
    <div className="p-6 md:p-8 bg-neutral-100 dark:bg-brand-dark text-neutral-700 dark:text-neutral-100 min-h-full relative">
      {showOverlay && <GeneratingOverlay message={generatingMessage} />}
      {toastInfo.show && (
        <Toast 
          message={toastInfo.message} 
          type={toastInfo.type}
          onClose={() => setToastInfo({ show: false, message: '', type: 'success', icon: undefined })}
          icon={toastInfo.icon}
        />
      )}
      <div className="max-w-6xl mx-auto"> 
        <div className="mb-10"> 
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-3">Create New Storyboard</h1> 
          <p className="text-lg text-neutral-600 dark:text-neutral-400">Fill in the details below to generate your storyboard. The more information you provide, the better your results will be.</p> 
        </div>

        {(generationError && !toastInfo.show) && ( 
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md">
            <p className="font-semibold">AI Generation Error:</p>
            <p>{generationError}</p>
          </div>
        )}
        {(characterGenerationError && !toastInfo.show) && ( 
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md">
            <p className="font-semibold">Character Generation Error:</p>
            <p>{characterGenerationError}</p>
          </div>
        )}
         {(basicInfoValidationError && !toastInfo.show) && ( 
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md">
            <p className="font-semibold">Validation Error:</p>
            <p>{basicInfoValidationError}</p>
          </div>
        )}

        <div className="mb-12"> 
          <div className="flex items-start justify-between">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center text-center flex-shrink-0 px-1.5"> 
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${ currentStep === step.id ? `bg-brand-teal border-brand-teal text-black` : currentStep > step.id ? `bg-green-500 border-green-500 text-white` : `border-neutral-400 dark:border-neutral-600 text-neutral-500 dark:text-neutral-400 bg-neutral-200 dark:bg-neutral-800`} font-semibold transition-colors duration-300 text-lg`}> 
                    {currentStep > step.id ? <CheckCircleIcon className="w-6 h-6"/> : step.id} 
                  </div>
                  <p className={`mt-2.5 text-sm ${currentStep === step.id ? `text-brand-teal font-semibold` : 'text-neutral-500 dark:text-neutral-400'}`}>{step.name}</p> 
                </div>
                {index < STEPS.length - 1 && (
                  <React.Fragment> 
                    <div className={`flex-1 h-1 mt-5 mx-2 md:mx-3 ${currentStep > step.id ? 'bg-green-500' : 'bg-neutral-300 dark:bg-neutral-700'} transition-colors duration-300`}></div>
                  </React.Fragment>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10"> 
          {currentStep === 1 && (
            <FormSectionContainer 
              title={STEPS[0].name}
              titleButton={
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleGenerateBasicInfoAI}
                  disabled={formStepDisabled}
                  className="!p-2"
                  aria-label="Generate Basic Project Information with AI"
                >
                  {isGeneratingBasicInfo ? <ArrowPathIcon className="w-6 h-6 animate-spin text-brand-teal" /> : <LightBulbIcon className="w-6 h-6 text-brand-teal" />}
                </Button>
              }
            >
              <ProjectInformationStep 
                projectTitle={formData.projectTitle}
                localDescription={localDescription}
                genre={formData.genre}
                customGenre={formData.customGenre}
                visualStyle={formData.visualStyle} 
                customVisualStyle={formData.customVisualStyle} 
                onFormChange={handleChange} 
                onLocalDescriptionChange={handleLocalDescriptionChange}
                onGenerateBasicInfo={handleGenerateBasicInfoAI}
                isGeneratingBasicInfo={isGeneratingBasicInfo}
                disabled={formStepDisabled}
              />
            </FormSectionContainer>
          )}
          {currentStep === 2 && (
             <FormSectionContainer title={STEPS[1].name}> 
                <SceneSetupAndVisualsStep
                  narrativeTone={formData.narrativeTone} 
                  totalDuration={formData.totalDuration}
                  eraSetting={formData.eraSetting}
                  mainConflict={formData.mainConflict}
                  themes={formData.themes}
                  cameraAngles={formData.cameraAngles || []} 
                  lightingStyles={formData.lightingStyles || []} 
                  sceneConfigurations={formData.sceneConfigurations || []}
                  onFormChange={handleChange} 
                  onTagChange={handleTagChange} 
                  onTotalDurationChange={handleTotalDurationChange}
                  onSceneConfigChange={handleSceneConfigChange}
                  onNumberOfScenesChange={handleNumberOfScenesChange}
                  onAddSceneConfig={handleAddSceneConfig}
                  onRemoveSceneConfig={handleRemoveSceneConfig}
                  disabled={formStepDisabled}
                />
            </FormSectionContainer>
          )}
          {currentStep === 3 && (
            <FormSectionContainer title={STEPS[2].name}>
              <CharactersStep 
                characters={formData.characters}
                cameraMovement={formData.cameraMovement}
                onCharacterChange={handleCharacterChange}
                onAddCharacter={addCharacter}
                onRemoveCharacter={removeCharacter}
                onSetIsCameraModalOpen={setIsCameraModalOpen}
                onGenerateCharacters={handleGenerateCharactersAI}
                isGeneratingCharacters={isGeneratingCharacters}
                disabled={formStepDisabled}
              />
            </FormSectionContainer>
          )}
          {currentStep === 4 && (
            <FormSectionContainer title={STEPS[3].name}>
              <OutputStep 
                targetPlatform={formData.targetPlatform}
                audienceAge={formData.audienceAge}
                promptLanguageStyle={formData.promptLanguageStyle}
                keyMoments={formData.keyMoments}
                desiredEnding={formData.desiredEnding}
                specificElements={formData.specificElements}
                onFormChange={handleChange}
                disabled={formStepDisabled}
              />
            </FormSectionContainer>
          )}

            <div className="flex justify-between items-center pt-8 pb-4 border-t border-neutral-300 dark:border-neutral-700">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={handlePrevStep}
                    disabled={currentStep === 1 || formStepDisabled}
                    leftIcon={<ArrowLeftIcon className="w-5 h-5" />}
                    size="lg"
                >
                    Previous
                </Button>
                {currentStep < STEPS.length ? (
                    <Button
                        type="button"
                        variant="primary"
                        onClick={handleNextStep}
                        rightIcon={<ArrowRightIcon className="w-5 h-5" />}
                        size="lg"
                        disabled={formStepDisabled}
                        leftIcon={isGeneratingStoryDetailsAI ? <ArrowPathIcon className="w-5 h-5 animate-spin"/> : undefined}
                    >
                       {isGeneratingStoryDetailsAI ? "Generating Details..." : "Next"}
                    </Button>
                ) : (
                    <Button 
                        type="submit" 
                        variant="primary" 
                        size="lg" 
                        disabled={formStepDisabled}
                        leftIcon={(isGeneratingStoryDetailsAI || isGeneratingImages) ? <ArrowPathIcon className="w-5 h-5 animate-spin"/> : <CheckCircleIcon className="w-5 h-5" />}
                    >
                        {isGeneratingStoryDetailsAI ? "Refining Details..." : isGeneratingImages ? generatingMessage : "Generate Storyboard Prompts"}
                    </Button>
                )}
            </div>
        </form>

        {isCameraModalOpen && (
            <div className="fixed inset-0 bg-brand-dark bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <Card className="w-full max-w-2xl bg-white dark:bg-brand-bg-card max-h-[90vh] flex flex-col">
                    <div className="flex justify-between items-center p-5 border-b border-neutral-200 dark:border-neutral-700">
                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">Select Camera Movements</h3>
                        <button onClick={() => setIsCameraModalOpen(false)} className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white">
                            <XMarkIcon className="w-7 h-7" />
                        </button>
                    </div>
                    <div className="p-5 space-y-4 overflow-y-auto flex-grow">
                        <div className="mb-4 flex justify-end space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleSelectAllCameraMovements(true)}>Select All</Button>
                            <Button variant="outline" size="sm" onClick={() => handleSelectAllCameraMovements(false)}>Deselect All</Button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {CAMERA_MOVEMENT_OPTIONS.map(movement => (
                                <label key={movement} className={`flex items-center p-3 border rounded-md cursor-pointer transition-all duration-150
                                    ${tempCameraMovements.includes(movement) 
                                        ? `border-brand-teal bg-brand-teal bg-opacity-10 dark:bg-opacity-20 ring-2 ring-brand-teal` 
                                        : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500 bg-neutral-50 dark:bg-neutral-800/50'
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={tempCameraMovements.includes(movement)}
                                        onChange={() => handleToggleCameraMovement(movement)}
                                        className={`form-checkbox h-5 w-5 rounded text-brand-teal focus:ring-brand-teal focus:ring-offset-1 dark:bg-neutral-700 dark:border-neutral-600 dark:checked:bg-brand-teal`}
                                    />
                                    <span className={`ml-3 text-sm ${tempCameraMovements.includes(movement) ? `text-brand-teal font-medium` : 'text-neutral-700 dark:text-neutral-300'}`}>
                                        {movement}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="p-5 border-t border-neutral-200 dark:border-neutral-700 flex justify-end space-x-3">
                        <Button variant="secondary" onClick={() => setIsCameraModalOpen(false)} size="lg">Cancel</Button>
                        <Button variant="primary" onClick={handleConfirmCameraMovements} size="lg">Confirm</Button>
                    </div>
                </Card>
            </div>
        )}
      </div>
    </div>
  );
};
GenerateStoryboardPage.displayName = 'GenerateStoryboardPage';
export default GenerateStoryboardPage;
