
import { PACING_OPTIONS, NARRATIVE_PURPOSE_OPTIONS } from './constants'; // Import PACING_OPTIONS & NARRATIVE_PURPOSE_OPTIONS for type inference

export enum Page {
  Dashboard = 'Dashboard',
  GenerateStoryboard = 'Generate Storyboard',
  StorylineIdea = 'Storyline Idea', 
  MyProjects = 'My Projects',
  Settings = 'Settings',
  Help = 'Help & Tutorials',
  PreviewStoryboard = 'Preview Storyboard',
  // VideoInsight = 'Video Insight', // Removed
}

export interface NavItem {
  name: Page;
  path: string;
  icon: (props: { className?: string }) => React.ReactNode;
}

// Admin Navigation Types
export enum AdminPage {
  AdminDashboard = 'Dashboard',
  UserManagement = 'User Management',
  PackagePricing = 'Package & Pricing',
  PaymentManagement = 'Payment Management',
  ApiUsageLog = 'API Usage Log',
  ApiCreditSettings = 'API & Credit Settings',
  ProjectMonitor = 'Project Monitor',
  NotificationBroadcast = 'Notifications',
  ActivityLog = 'Activity Log',
  AdminSettings = 'Admin Settings',
}

export interface AdminNavItem {
  name: AdminPage | string; // Allow string for flexibility if some admin pages aren't in enum
  path: string; // Relative to /admin
  icon: (props: { className?: string }) => React.ReactNode;
}


export interface Character {
  id: string;
  name: string;
  label: string; // e.g. @protagonist, used as identifier in prompts
  description: string; // Visual appearance and role
}

export type PacingOptionValue = typeof PACING_OPTIONS[number]['value'];
export type NarrativePurposeOptionValue = typeof NARRATIVE_PURPOSE_OPTIONS[number];


export interface SceneConfigFormData {
  id: string;
  title: string;
  duration: number; // User-defined duration for this specific scene in seconds
  pacing: PacingOptionValue;
}

export interface StoryboardFormData {
  projectTitle: string;
  description: string;
  genre: string;
  customGenre: string;
  narrativeTone: string;
  visualStyle: string; // Project-level default visual style
  customVisualStyle: string;
  totalDuration: string; // Represents total video duration in seconds as a string
  eraSetting: string; // Project-level default era/setting
  mainConflict: string;
  themes: string[];
  characters: Character[]; // Project-level character definitions
  cameraMovement: string[]; // Project-level preferred camera movements
  cameraAngles?: string[]; // Project-level preference for camera angles
  lightingStyles?: string[]; // Project-level preference for lighting styles
  targetPlatform: string;
  audienceAge: string;
  promptLanguageStyle: string;
  keyMoments: string;
  desiredEnding: string;
  specificElements: string;
  sceneConfigurations?: SceneConfigFormData[];
}

// This Project type is simpler and used by the old MyProjectsPage for mock data
export interface Project {
  id: string;
  title: string;
  scenes: number; // Number of scenes
  duration: string; // e.g., "3:30" total duration string
  lastModified: string; // e.g., "2025-04-10"
  imageUrl?: string;
}

export type ProjectType = 'storyboard' | 'storylineIdea'; // Removed 'videoInsight'


export type GenerationStatus = 'idle' | 'generating' | 'generated' | 'error';


// Detailed Prompt Structures based on user specification

export interface SubjectDetail {
  identifier: string; // Name or label (e.g., "Detective Miller", "Contents of the Chest")
  use_character_reference_id?: string; // e.g., DETECTIVE_MILLER_V2 (from Nufa's character DB)
  type: string; // e.g., "Man", "Object Group", "Woman", "Child"
  age_appearance?: string; // e.g., "Elderly (60s)", "Young Adult (20s)"
  key_features_override?: string | null; // Temporary changes from reference
  clothing_override?: string | null; // Changes in clothing from last known state
  expression_mood?: string | null; // e.g., "Surprised, eyes wide", "Calm"
  key_features?: string; // For objects or non-referenced subjects

  // Fields from user's JSON example for subject_primary
  skin_tone?: string;
  hair?: {
    color?: string;
    style_condition?: string;
  };
  physical_condition_notes?: string[]; // e.g. ["Dirt/mud splattered on face"]
}

export interface AttireAndPropsDetail { // From user's JSON example for attire_and_props
    upper_body_garment?: {
      type?: string;
      color?: string;
      condition?: string;
    };
    under_garment?: {
      type?: string;
      color?: string;
      visibility_note?: string;
    };
    belt?: {
      material?: string;
      attachments?: string; // Changed from array to string for simplicity, can be comma-sep
    };
    weaponry?: string[]; // e.g. ["Handgun, holstered on right hip"]
    held_item?: string;
}


export interface EnvironmentSetting {
  location_type: string; // e.g., "Inside a dim old warehouse", "Forest clearing"
  time_of_day?: string; // e.g., "Night (continuous from previous shot)", "Midday"
  weather_condition?: string; // e.g., "Not relevant (indoors)", "Rainy"
  key_elements?: string[]; // Array of key visual elements in the scene
  atmosphere_keywords?: string[]; // e.g., ["Dust", "Dark", "Tense"]

  // Fields from user's JSON example for environment & atmosphere
  depth_of_field_effect?: string; // e.g. "Blurry background (bokeh)"
  visual_weather_effects?: string[]; // e.g. ["Visible raindrops in the air"]
  lighting_description?: string; // e.g. "Somewhat dim and diffused"
}

export interface CameraShotDetails {
  framing: string; // e.g., "Medium Close-Up (MCU)", "Wide Shot"
  angle?: string; // e.g., "Slightly Low Angle", "Eye Level"
  depth_of_field?: string; // e.g., "Shallow (focus on Detective Miller's face)"
}

export interface ArtisticStyleDetails {
  selected_style_preset: string; // e.g., "Film Noir - Cinematic" (can be inherited)
  user_specific_style_modifiers?: string[]; // e.g., ["More film grain", "Deeper shadows"]
  negative_style_elements?: string[]; // e.g., ["Colorful", "Flat lighting"]
}

export interface ImagePromptInput {
  project_id?: string; // For context, Nufa Studio managed
  scene_id?: string;   // For context, Nufa Studio managed
  shot_id?: string;    // For context, Nufa Studio managed

  // Option for manual prompt override
  raw_user_prompt_input?: string;
  use_raw_user_prompt?: boolean;

  description_narrative: string; // Main description for the shot's visual content
  subject_details?: SubjectDetail[];
  attire_and_props?: AttireAndPropsDetail; // Added from user spec
  environment_setting?: EnvironmentSetting;
  camera_shot_details?: CameraShotDetails;
  artistic_style?: ArtisticStyleDetails;
  seedGambar?: number; // For regeneration consistency
  promptNegatifFallback?: string; // Fallback negative prompt if not in artistic_style
  aspectRatio?: string; // Added here from ShotData for direct use in image prompt construction
  character_consistency_id?: string; // From user spec (CHARACTER_JANE_DOE_V1) - for `subject_details[i].use_character_reference_id`
}

export interface VideoContinuityContext {
  previous_shot_camera_state?: string; // e.g., "Static wide shot showing Miller approaching the crate."
  previous_shot_subject_action_end?: string; // e.g., "Miller reaches out to open the crate lid."
  previous_shot_emotional_state?: string; // e.g., "Maya was hopeful."
  previous_shot_narrative_summary?: string; // e.g., "Maya had just found the map."
}

export interface SubjectAction {
  subject_identifier_from_image_prompt: string; // References 'identifier' from ImagePromptInput.subject_details
  action_description: string; // e.g., "Her eyes widen further."
  emotion_shift_keywords?: string; // e.g., "From anticipation to pure shock"
}

export interface VideoMotionDescription {
  camera_movement?: string; // e.g., "No camera movement", "Quick push-in"
  camera_movement_target?: string; // e.g., "John's face", "Door at the end of the hallway"
  subject_action?: SubjectAction[];
  environmental_effects_animation?: string; // e.g., "Floating dust becomes slightly more visible."
}

export interface VideoPromptInput {
  project_id?: string; // For context
  scene_id?: string;   // For context
  shot_id?: string;    // For context
  source_image_panel_path?: string; // Conceptual path/reference to the generated image panel
  user_video_motion_prompt?: string; // Primary user input for overall video dynamics for the shot
  shot_duration_seconds: number; // This is the "Shot Duration"
  continuity_context?: VideoContinuityContext; // For shot-to-shot flow
  motion_description?: VideoMotionDescription; // Contains "Camera Movement & Video Dynamics Settings"
  pacing_intensity?: PacingOptionValue | string; // Allow string for flexibility or direct user input
  audio_context_keywords?: string[]; // e.g., ["Momentary silence", "Sound of breathing"]
  video_style_maintenance_tags?: string[]; // e.g., ["Maintain Film Noir style from source image."]
  parameterVeoTambahan?: Record<string, any>;
}

export interface AudioShotSettings {
  voiceover?: string;
  sfx?: string[];
  music_score_description?: string; // Added for Rule #5
}

export interface ShotData {
  id: string; // Shot ID
  shotNumberInScene: number; // Shot Number in Scene
  fullShotIdentifier: string;

  narrativePurpose?: NarrativePurposeOptionValue; // NEW: For Rule #1

  // Core input fields - new structure
  imagePromptInput?: ImagePromptInput;   // Contains: Visual Shot Description (description_narrative), Visual Style Settings (artistic_style), Camera Angle & Shot Type Settings (camera_shot_details)
  videoPromptInput?: VideoPromptInput;   // Contains: Shot Duration (shot_duration_seconds), Camera Movement & Video Dynamics Settings (motion_description, user_video_motion_prompt)

  // Direct metadata fields from new rules
  dialog?: string; // Dialog (as per new rules) - will be primarily sourced from audioShotSettings.voiceover
  catatanSutradaraKamera?: string; // Director/Camera Notes
  pengaturanAudioShot?: AudioShotSettings; // Audio Shot Settings (voiceover, SFX)

  // --- Transitory fields (to be phased out or used as defaults for new structures) ---
  durationSuggestion?: number; 
  charactersInShot?: string[]; 
  cameraMovement?: string; 
  deskripsiVisualShot?: string; // Visual Shot Description
  gayaVisual?: string; // Visual Style
  angleKamera?: string; // Camera Angle
  tipeShotKamera?: string; // Camera Shot Type
  referensiKarakter?: string; // Character Reference
  promptNegatifGambar?: string; // Negative Image Prompt
  seedGambar?: number; // Image Seed
  deskripsiGerakanVideo?: string; // Video Motion Description
  konteksCeritaTambahan?: string; // Additional Story Context
  // --- End transitory fields ---

  imagePrompt?: string; // Final constructed image prompt string (Flux Kontext Pro)
  imageToVideoPrompt?: string; // Final constructed image-to-video prompt string (Veo 2)
  videoPrompt?: string; // Final constructed video prompt string (Veo 3)
  
  narrativeDescription?: string; // General narrative description for display (usually from imagePromptInput.description_narrative)

  imageStatus?: GenerationStatus;
  videoStatus?: GenerationStatus;
  aspectRatio?: string; 
  generatedImageUrl?: string | null; 
  generatedVideoUrl?: string | null; 
}

export interface SceneData {
  id: string; 
  sceneNumber: number;
  title?: string; 
  estimatedDuration: number;
  shots: ShotData[]; 
  pacing?: PacingOptionValue;
  settingLokasi?: string; // Location Setting
  settingWaktu?: string; // Time Setting
  deskripsiUmumScene?: string; // General Scene Description
  sceneDirectorNotes?: string; 
}

export interface TrailerData {
  id: string;
  title: string;
  shots: ShotData[];
  estimatedDuration: number;
  pacing?: PacingOptionValue;
}

export interface StoryboardPreviewData {
  formData: StoryboardFormData;
  trailer?: TrailerData;
  scenes: SceneData[];
  totalScenes: number;
  totalShots: number;
  projectAspectRatio?: string | null;
}

export interface StorylineIdeaResult {
  title: string;
  logline: string;
  synopsis: string;
  storyline: string;
}

export interface SavedStorylineIdea {
  genre: string;
  visualStyle: string;
  result: StorylineIdeaResult;
}

// Removed VideoInsightPage Types: DeconstructedVideoInfo, DetailedAnalysisAndConcept, VideoInsightAnalysis


export interface SavedProject {
  id: string;
  lastModified: string;
  projectType: ProjectType;

  // Storyboard specific
  formData?: StoryboardFormData;
  trailer?: TrailerData;
  scenes?: SceneData[]; 
  totalScenes?: number;
  totalShots?: number;
  projectAspectRatio?: string | null;

  // Storyline Idea specific
  storylineIdeaData?: SavedStorylineIdea;

  // Video Insight specific fields removed
  // videoInsightData?: VideoInsightAnalysis; // Removed
  // videoUrl?: string; // Removed
}


export interface AiGeneratedDetails {
  visualStyle?: string;
  customVisualStyle?: string;
  narrativeTone?: string;
  eraSetting?: string;
  mainConflict?: string;
  themes?: string[];
  characters?: Character[]; 
  cameraMovement?: string[];
  cameraAngles?: string[];
  lightingStyles?: string[];
  keyMoments?: string;
  desiredEnding?: string;
  specificElements?: string;
}
