
import React from 'react';
import { Page, NavItem, AdminNavItem, StoryboardFormData, Character } from './types'; // Added AdminNavItem
import {
  HomeIcon,
  PencilSquareIcon,
  FolderIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  LightBulbIcon, 
  ChatBubbleLeftEllipsisIcon,
  MagnifyingGlassIcon, 
  // Admin Icons
  Squares2X2Icon as AdminDashboardIcon, // Renamed for clarity
  UsersIcon,
  CurrencyDollarIcon as PackagePricingIcon, // Renamed for clarity
  CreditCardIcon as PaymentManagementIcon, // Renamed for clarity
  DocumentChartBarIcon as ApiUsageLogIcon, // Renamed for clarity
  WrenchScrewdriverIcon as ApiCreditSettingsIcon, // Renamed for clarity
  EyeDropperIcon as ProjectMonitorIcon, // Renamed for clarity
  MegaphoneIcon as NotificationBroadcastIcon, // Renamed for clarity
  ClipboardDocumentListIcon as ActivityLogIcon, // Renamed for clarity
  ShieldCheckIcon as AdminSettingsIcon, // Renamed for clarity
} from './components/icons';

export const ACCENT_COLOR = 'brand-teal'; 

export const SIDEBAR_NAV_ITEMS: NavItem[] = [
  { name: Page.Dashboard, path: '/dashboard', icon: (props) => <HomeIcon {...props} /> }, 
  { name: Page.GenerateStoryboard, path: '/generate', icon: (props) => <PencilSquareIcon {...props} /> },
  { name: Page.StorylineIdea, path: '/storyline-idea', icon: (props) => <ChatBubbleLeftEllipsisIcon {...props} /> }, 
  // { name: Page.VideoInsight, path: '/video-insight', icon: (props) => <MagnifyingGlassIcon {...props} /> }, // Removed
  { name: Page.MyProjects, path: '/projects', icon: (props) => <FolderIcon {...props} /> },
  { name: Page.Settings, path: '/settings', icon: (props) => <CogIcon {...props} /> },
  { name: Page.Help, path: '/help', icon: (props) => <QuestionMarkCircleIcon {...props} /> },
];

export const ADMIN_SIDEBAR_NAV_ITEMS: AdminNavItem[] = [
    { name: 'Dashboard', path: 'dashboard', icon: (props) => <AdminDashboardIcon {...props} /> },
    { name: 'User Management', path: 'user-management', icon: (props) => <UsersIcon {...props} /> },
    { name: 'Package & Pricing', path: 'package-pricing', icon: (props) => <PackagePricingIcon {...props} /> },
    { name: 'Payment Management', path: 'payment-management', icon: (props) => <PaymentManagementIcon {...props} /> },
    { name: 'API Usage Log', path: 'api-usage-log', icon: (props) => <ApiUsageLogIcon {...props} /> },
    { name: 'API & Credit Settings', path: 'api-credit-settings', icon: (props) => <ApiCreditSettingsIcon {...props} /> },
    { name: 'Project Monitor', path: 'project-monitor', icon: (props) => <ProjectMonitorIcon {...props} /> },
    { name: 'Notifications', path: 'notification-broadcast', icon: (props) => <NotificationBroadcastIcon {...props} /> },
    { name: 'Activity Log', path: 'activity-log', icon: (props) => <ActivityLogIcon {...props} /> },
    { name: 'Admin Settings', path: 'admin-settings', icon: (props) => <AdminSettingsIcon {...props} /> },
];


export const GENRE_OPTIONS: string[] = [
  "Action", "Adventure", "Animation", "Biography", "Comedy", "Documentary", "Drama", "Family",
  "Fantasy", "Film Noir", "History", "Horror", "Musical", "Mystery", "Noir", "Other", "Romance",
  "Sci-Fi", "Sports", "Superhero", "Thriller", "War", "Western"
].sort();


const newNarrativeTonesList: string[] = [
  "Absurdist", "Colloquial", "Comedic", "Contemplative", "Critical", "Cynical", "Dark", "Detached", "Dramatic",
  "Dreamlike", "Enigmatic", "Epic", "Fantastical", "Formal", "Grandiose", "Grave", "Gritty", "Hopeful",
  "Horror", "Humorous", "Informal", "Intimate", "Ironic", "Lighthearted", "Melancholic", "Mysterious",
  "Nostalgic", "Objective", "Optimistic", "Playful", "Realistic", "Reflective", "Romantic", "Sad",
  "Sarcastic", "Satirical", "Sentimental", "Serious", "Subjective", "Surreal", "Suspenseful", "Tense",
  "Terrifying", "Thrilling", "Tragic", "Uplifting", "Urgent", "Whimsical"
];

export const NARRATIVE_TONE_OPTIONS: string[] = [...new Set(newNarrativeTonesList.map(tone => tone.trim()))].sort((a, b) => a.localeCompare(b));


export const VISUAL_STYLE_OPTIONS: string[] = [
  "Cinematic", "Photorealistic", "Hyperrealistic", "Film Noir", "Neo-Noir",
  "Naturalistic Lighting", "Golden Hour Aesthetic", "Gritty Realism",
  "Abstract", "Anime (General)", "Anime (Shonen)", "Anime (Shojo)", "Cartoon (General)",
  "Comic Book Art (Manga)", "Comic Book Art (Marvel/DC)", "Cyberpunk",
  "Disney Animation Style", "Impressionistic", "Low Poly 3D", "Minimalist",
  "Modern Flat Cartoon", "Oil Painting", "Pixar Animation Style", "Pop Art",
  "Retro (80s)", "Retro (90s)", "Sketch/Hand-drawn", "Solarpunk", "Steampunk",
  "Studio Ghibli Inspired", "Surreal", "Vintage Film Look", "Watercolor",
  "Kubrickian", "Tarantinoesque", "Tim Burton Gothic", "Wes Anderson Symmetry",
  "Aerial/Drone", "Black & White", "Blue Hour Lighting", "Macro", "Sepia",
  "Default", "Other"
].sort();

export const STYLE_KEYWORD_MAPPINGS: Record<string, string> = {
  "Cinematic": "cinematic lighting, dramatic, film grain, high contrast, professional color grading, wide screen, depth of field",
  "Photorealistic": "photorealistic, 8K, UHD, sharp focus, high detail, realistic textures, natural lighting",
  "Hyperrealistic": "hyperrealistic, intricate detail, lifelike, physically-based rendering, ultra high resolution, meticulous textures",
  "Film Noir": "film noir, black and white, chiaroscuro, low-key lighting, dramatic shadows, mysterious, venetian blinds effect, 1940s aesthetic",
  "Neo-Noir": "neo-noir, dark, moody, neon lighting, urban decay, rain-slicked streets, modern noir aesthetic",
  "Naturalistic Lighting": "natural light, soft shadows, balanced exposure, realistic illumination, unstyled lighting",
  "Golden Hour Aesthetic": "golden hour, warm lighting, long shadows, soft light, beautiful, atmospheric",
  "Gritty Realism": "gritty, realism, urban decay, desaturated colors, textured, raw, documentary style",
  "Abstract": "abstract, non-representational, shapes, colors, textures, experimental, conceptual",
  "Anime (General)": "anime style, cel shaded, vibrant colors, expressive eyes, Japanese animation, dynamic lines",
  "Anime (Shonen)": "shonen anime style, action-packed, dynamic poses, speed lines, intense expressions, bright effects",
  "Anime (Shojo)": "shojo anime style, romantic, delicate lines, large expressive eyes, pastel colors, floral motifs, emotional",
  "Cartoon (General)": "cartoon style, exaggerated features, bright colors, simple shapes, 2D animation, playful",
  "Comic Book Art (Manga)": "manga style, black and white, screentones, dynamic paneling, expressive characters, Japanese comic art",
  "Comic Book Art (Marvel/DC)": "comic book art, American superhero style, dynamic action, bold colors, inked lines, heroic poses",
  "Cyberpunk": "cyberpunk, futuristic, neon lights, dystopian city, cybernetics, high-tech, gritty urban, blade runner aesthetic",
  "Disney Animation Style": "classic Disney animation style, expressive characters, fluid animation, rounded shapes, vibrant colors, charming",
  "Impressionistic": "impressionistic, soft focus, visible brush strokes, light and color, painterly, dreamy",
  "Low Poly 3D": "low poly, 3D render, geometric shapes, stylized, minimalist, retro 3D aesthetic",
  "Minimalist": "minimalist, clean lines, simple shapes, negative space, uncluttered, modern",
  "Modern Flat Cartoon": "modern flat design, 2D cartoon, simple characters, bold outlines, limited color palette, vector art",
  "Oil Painting": "oil painting style, rich colors, visible brushstrokes, textured, classical art",
  "Pixar Animation Style": "Pixar style, 3D animation, appealing characters, detailed environments, expressive, storytelling focus",
  "Pop Art": "pop art, bold colors, graphic style, Ben-Day dots, iconic imagery, Andy Warhol style",
  "Retro (80s)": "80s retro aesthetic, neon, synthwave, vintage electronics, grainy, vibrant, nostalgic",
  "Retro (90s)": "90s retro aesthetic, grunge, early internet, colorful patterns, nostalgic,Saved by the Bell style",
  "Sketch/Hand-drawn": "sketch style, hand-drawn, pencil lines, cross-hatching, unfinished look, artistic",
  "Solarpunk": "solarpunk, optimistic future, sustainable technology, lush greenery, art nouveau influences, bright and clean",
  "Steampunk": "steampunk, Victorian era, steam-powered technology, gears, brass, goggles, retrofuturistic",
  "Studio Ghibli Inspired": "Studio Ghibli style, hand-drawn animation, lush nature, fantastical elements, whimsical, detailed backgrounds, emotional storytelling",
  "Surreal": "surreal, dreamlike, illogical, bizarre imagery, Salvador Dali style, subconscious exploration",
  "Vintage Film Look": "vintage film, desaturated colors, film grain, light leaks, old movie aesthetic, scratches",
  "Watercolor": "watercolor style, soft washes, translucent colors, blended edges, artistic, delicate",
  "Kubrickian": "Kubrickian, symmetrical composition, one-point perspective, meticulous detail, wide-angle shots, psychological tension",
  "Tarantinoesque": "Tarantinoesque, stylized violence, non-linear narrative, pop culture references, witty dialogue, vibrant cinematography",
  "Tim Burton Gothic": "Tim Burton style, gothic, dark fantasy, quirky characters, whimsical, expressionistic, pale skin, large eyes",
  "Wes Anderson Symmetry": "Wes Anderson style, symmetrical composition, flat space, distinct color palettes, quirky, deadpan humor, detailed props",
  "Aerial/Drone": "aerial view, drone shot, top-down perspective, birds-eye view, expansive landscape",
  "Black & White": "black and white, monochrome, grayscale, contrast, shadows, classic photography",
  "Blue Hour Lighting": "blue hour, twilight, cool tones, soft light, atmospheric, moody",
  "Macro": "macro photography, extreme close-up, tiny details, shallow depth of field, intricate textures",
  "Sepia": "sepia tone, brownish tint, vintage photo effect, nostalgic, old-fashioned",
  "Default": "well-lit, clear, detailed, standard composition, good quality",
  "Other": "user-defined custom style, unique aesthetic"
};


export const TOTAL_DURATION_OPTIONS: { label: string; value: string }[] = [
  { label: "15 seconds", value: "15" }, { label: "30 seconds", value: "30" }, 
  { label: "45 seconds", value: "45" }, { label: "60 seconds (1 min)", value: "60" },
  { label: "90 seconds (1.5 min)", value: "90" }, { label: "120 seconds (2 min)", value: "120" },
  { label: "150 seconds (2.5 min)", value: "150" }, { label: "180 seconds (3 min)", value: "180" },
  { label: "210 seconds (3.5 min)", value: "210" }, { label: "240 seconds (4 min)", value: "240" },
  { label: "270 seconds (4.5 min)", value: "270" }, { label: "300 seconds (5 min)", value: "300" },
];


const cameraAngleList: string[] = [
  "Eye-Level Shot", "High-Angle Shot", "Low-Angle Shot", "Bird's-Eye View Shot", "Top Shot",
  "Worm's-Eye View Shot", "Ground-Level Shot", "Extreme Long Shot", "Extreme Wide Shot", "Long Shot",
  "Wide Shot", "Full Shot", "Medium Long Shot", "American Shot", "Cowboy Shot", "Medium Shot",
  "Medium Close-Up", "Close-Up", "Extreme Close-Up", "Point-of-View Shot", "Over-the-Shoulder Shot",
  "Two-Shot", "Three-Shot", "Group Shot", "Dutch Angle", "Dutch Tilt", "Canted Angle",
  "Oblique Angle", "Profile Shot", "Rear Shot", "Reverse Shot", "Cutaway Shot", "Insert Shot"
];
export const CAMERA_ANGLE_OPTIONS: string[] = [...new Set(cameraAngleList)].sort((a, b) => a.localeCompare(b));


export const TIPE_SHOT_KAMERA_OPTIONS: string[] = [ // "TIPE_SHOT_KAMERA_OPTIONS" is a variable name, so it's not translated to "CAMERA_SHOT_TYPE_OPTIONS" to minimize changes if not user-facing. If it IS used for labels, it should be changed. Assuming it's for internal mapping.
  "Extreme Long Shot (ELS)", "Long Shot (LS)", "Full Shot (FS)",
  "Medium Long Shot (MLS) / American Shot", "Medium Shot (MS)",
  "Medium Close-Up (MCU)", "Close-Up (CU)", "Extreme Close-Up (ECU)"
].sort();


const lightingStyleList: string[] = [
  "Hard Light", "Soft Light", "Diffused Light", "Specular Light", "Front Lighting", "Side Lighting",
  "Backlighting", "Rim Lighting", "Top Lighting", "Under Lighting", "Kicker Light", "Edge Light",
  "High Key Lighting", "Low Key Lighting", "High Contrast Lighting", "Chiaroscuro", "Low Contrast Lighting",
  "Warm Light", "Cool Light", "Neutral Light", "Colored Gels", "Natural Light", "Artificial Light",
  "Practical Light", "Motivated Light", "Available Light", "Three-Point Lighting", "Silhouette Lighting",
  "Rembrandt Lighting", "Butterfly Lighting", "Paramount Lighting", "Loop Lighting", "Split Lighting",
  "Ambient Lighting", "Volumetric Lighting", "God Rays", "Haze", "Neon Lighting", "Flickering Light",
  "Spotlighting"
];
export const LIGHTING_STYLE_OPTIONS: string[] = [...new Set(lightingStyleList)].sort((a, b) => a.localeCompare(b));


const existingCameraMovements: string[] = [];
const newCameraMovementsList: string[] = [
  "Pan", "Whip Pan", "Tilt", "Dolly In", "Dolly Out", "Tracking Shot", "Trucking Shot", "Pedestal Up",
  "Pedestal Down", "Zoom In", "Zoom Out", "Crash Zoom", "Dolly Zoom", "Vertigo Effect", "Crane Shot",
  "Jib Shot", "Steadicam Shot", "Handheld Shot", "Shaky Cam", "Follow Shot", "Circle Shot", "Arc Shot",
  "Boom Shot", "Static Shot", "Fixed Shot", "Aerial Shot", "Drone Shot", "SnorriCam Shot", "Zolly", "Roll"
];

export const CAMERA_MOVEMENT_OPTIONS: string[] = [...new Set([...existingCameraMovements, ...newCameraMovementsList])].sort((a, b) => a.localeCompare(b));


export const TARGET_PLATFORM_OPTIONS: string[] = [
    "YouTube (16:9)",
    "YouTube Shorts (9:16)",
    "Instagram Feed - Square (1:1)",
    "Instagram Feed - Portrait (4:5)",
    "Instagram Story/Reels (9:16)",
    "TikTok (9:16)",
    "Facebook Feed - Landscape (16:9)",
    "Facebook Feed - Portrait (4:5)",
    "Facebook Story (9:16)",
    "Film Festival (16:9)",
    "Other",
].sort();

export const AUDIENCE_AGE_OPTIONS: string[] = ["Children (0-7)", "Kids (8-12)", "Teens (13-17)", "Young Adults (18-24)", "Adults (25-54)", "Seniors (55+)", "All Ages"];
export const PROMPT_LANGUAGE_STYLE_OPTIONS: string[] = ["Cinematic Descriptive", "Technical AI", "Narrative Poetic", "Simple & Direct"];

export const PRO_TIPS_DATA = [
    "Use specific visual styles to create consistent themes throughout your storyboard.",
    "Detailed character descriptions lead to more accurate and consistent storyboard outputs.",
    "Experiment with different camera movements to add dynamism to your story."
];

export const TARGET_PLATFORM_DEFAULT_RATIOS: Record<string, string> = {
  "YouTube (16:9)": "16:9",
  "YouTube Shorts (9:16)": "9:16",
  "Instagram Feed - Square (1:1)": "1:1",
  "Instagram Feed - Portrait (4:5)": "4:5",
  "Instagram Story/Reels (9:16)": "9:16",
  "TikTok (9:16)": "9:16",
  "Facebook Feed - Landscape (16:9)": "16:9",
  "Facebook Feed - Portrait (4:5)": "4:5",
  "Facebook Story (9:16)": "9:16",
  "Film Festival (16:9)": "16:9",
};

export const ASPECT_RATIO_OPTIONS: Array<{ label: string, value: string }> = [
  { label: "16:9 (Landscape)", value: "16:9" },
  { label: "9:16 (Portrait)", value: "9:16" },
  { label: "1:1 (Square)", value: "1:1" },
  { label: "4:3 (Standard TV)", value: "4:3" },
  { label: "4:5 (Portrait Feed)", value: "4:5"},
  { label: "3:2 (Photography)", value: "3:2" },
  { label: "2.39:1 (Cinemascope)", value: "2.39:1" },
];

export const PACING_OPTIONS = [
  { label: "Very Fast (VF) - ~1.5s/shot", value: "VF", averageShotDuration: 1.5, range: [1, 2] },
  { label: "Fast (F) - ~3s/shot", value: "F", averageShotDuration: 3, range: [2, 4] },
  { label: "Medium (M) - ~4.5s/shot", value: "M", averageShotDuration: 4.5, range: [3, 6] }, 
  { label: "Slow (SL) - ~6.5s/shot", value: "SL", averageShotDuration: 6.5, range: [5, 8] },
  { label: "Very Slow (VS) - 8s+/shot", value: "VS", averageShotDuration: 8.5, range: [8, 12] } 
] as const;

export const DURATION_SCENE_RECOMMENDATIONS: Record<string, { minScenes: number, maxScenes: number, typical: string }> = {
    "15": { minScenes: 1, maxScenes: 2, typical: "1-2 scenes" },
    "30": { minScenes: 1, maxScenes: 3, typical: "1-3 scenes" },
    "45": { minScenes: 2, maxScenes: 4, typical: "2-4 scenes" }, 
    "60": { minScenes: 2, maxScenes: 5, typical: "2-5 scenes" },
    "90": { minScenes: 3, maxScenes: 6, typical: "3-6 scenes" }, 
    "120": { minScenes: 3, maxScenes: 7, typical: "3-7 scenes" },
    "150": { minScenes: 4, maxScenes: 8, typical: "4-8 scenes" }, 
    "180": { minScenes: 4, maxScenes: 10, typical: "4-10 scenes" },
    "210": { minScenes: 5, maxScenes: 11, typical: "5-11 scenes" }, 
    "240": { minScenes: 5, maxScenes: 12, typical: "5-12 scenes" },
    "270": { minScenes: 6, maxScenes: 14, typical: "6-14 scenes" }, 
    "300": { minScenes: 6, maxScenes: 15, typical: "6-15 scenes" },
};


export const NARRATIVE_PURPOSE_OPTIONS = [
  "Establish Scene",
  "Introduce Character",
  "Deliver Key Information",
  "Show Reaction",
  "Build Suspense",
  "Climax Action",
  "Resolution",
  "Montage Sequence",
  "Transition",
  "Foreshadowing",
  "Character Development Moment",
  "World Building Detail"
] as const;


export const initialStoryboardFormDataDef: Readonly<StoryboardFormData> = {
  projectTitle: '',
  description: '', // This will store the storyline
  genre: '',
  customGenre: '',
  narrativeTone: '',
  visualStyle: 'Cinematic', 
  customVisualStyle: '',
  totalDuration: '60', 
  eraSetting: 'Near-future, decaying urban environment with outdated tech infrastructure.', // Example is already English
  mainConflict: '',
  themes: [],
  characters: [{ id: `char-constants-${Date.now()}`, name: '', label: '', description: '' }],
  cameraMovement: [],
  cameraAngles: [],
  lightingStyles: [],
  targetPlatform: '',
  audienceAge: 'All Ages',
  promptLanguageStyle: 'Cinematic Descriptive',
  keyMoments: '',
  desiredEnding: '',
  specificElements: '',
  sceneConfigurations: [], 
};
