
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    StoryboardFormData, SceneData, ShotData, StoryboardPreviewData, GenerationStatus, SavedProject,
    ProjectType, TrailerData, Character, PacingOptionValue, NarrativePurposeOptionValue,
    ImagePromptInput, VideoPromptInput, SubjectDetail, EnvironmentSetting, CameraShotDetails, ArtisticStyleDetails, AttireAndPropsDetail,
    VideoMotionDescription, SubjectAction, AudioShotSettings, VideoContinuityContext
} from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import Toast from '../components/ui/Toast';
import {
    ArrowUturnLeftIcon, ArrowDownTrayIcon, ClipboardDocumentIcon,
    ChevronDownIcon, ChevronUpIcon, PhotoIcon, PlayCircleIcon, XMarkIcon,
    PencilSquareIcon, CheckCircleIcon, KeyIcon, ArrowPathIcon, BellIcon as AlertIcon,
    VideoCameraIcon as TrailerIcon, EyeIcon, Squares2X2Icon, ClapperBoardIcon,
    ArrowLeftIcon, ArrowRightIcon
} from '../components/icons';
import {
    TOTAL_DURATION_OPTIONS, TARGET_PLATFORM_DEFAULT_RATIOS, ASPECT_RATIO_OPTIONS,
    CAMERA_ANGLE_OPTIONS, LIGHTING_STYLE_OPTIONS, CAMERA_MOVEMENT_OPTIONS, VISUAL_STYLE_OPTIONS, NARRATIVE_TONE_OPTIONS,
    TIPE_SHOT_KAMERA_OPTIONS, GENRE_OPTIONS, PACING_OPTIONS, DURATION_SCENE_RECOMMENDATIONS,
    STYLE_KEYWORD_MAPPINGS, NARRATIVE_PURPOSE_OPTIONS
} from '../constants';
import { initialStoryboardFormDataDef } from '../constants';


const TRAILER_STATIC_ID = 'trailer-segment-main';
const MOCK_VIDEO_URL = 'https://www.w3schools.com/html/mov_bbb.mp4'; // Placeholder for mock video

const getRandomElement = <T,>(arr: T[] | readonly T[] | undefined): T | undefined => {
  if (!arr || arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
};

const parseSpecificElementsFromString = (elementsString: string | undefined): { include: string[], avoid: string[] } => {
    const includeElements: string[] = [];
    const avoidElements: string[] = [];
    if (!elementsString) return { include: includeElements, avoid: avoidElements };

    const lowerStr = elementsString.toLowerCase();
    let includePart = "";
    let avoidPart = "";

    const avoidKeyword = "avoid:";
    const avoidIndex = lowerStr.indexOf(avoidKeyword);

    if (avoidIndex !== -1) {
        includePart = elementsString.substring(0, avoidIndex);
        avoidPart = elementsString.substring(avoidIndex + avoidKeyword.length);
    } else {
        includePart = elementsString;
    }

    const includeKeyword = "include:";
    const includeIndex = includePart.toLowerCase().indexOf(includeKeyword);
    if (includeIndex !== -1) {
        includePart = includePart.substring(includeIndex + includeKeyword.length);
    }

    if (includePart.trim()) {
        includeElements.push(...includePart.split(',').map(s => s.trim()).filter(s => s));
    }
    if (avoidPart.trim()) {
        avoidElements.push(...avoidPart.split(',').map(s => s.trim()).filter(s => s));
    }

    return { include: includeElements, avoid: avoidElements };
};

const getCharacterFullDescription = (subject: SubjectDetail, projectCharacters: Character[]): string => {
    const refId = subject.use_character_reference_id;
    let characterFromLibrary = projectCharacters.find(pc => pc.label === refId);
    if (!characterFromLibrary) {
        characterFromLibrary = projectCharacters.find(pc => pc.name === refId || pc.name === subject.identifier);
    }
    
    if (characterFromLibrary) {
        let description = characterFromLibrary.description;
        if (subject.key_features_override) description += ` Override: ${subject.key_features_override}.`;
        if (subject.clothing_override) description += ` Clothing: ${subject.clothing_override}.`;
        return description;
    }
    let fallbackDesc = subject.key_features || `${subject.type || 'Subject'}`;
    if (subject.age_appearance) fallbackDesc += `, appearing ${subject.age_appearance}`;
    if (subject.skin_tone) fallbackDesc += `, skin tone: ${subject.skin_tone}`;
    if (subject.hair?.color || subject.hair?.style_condition) {
        fallbackDesc += `, hair: ${subject.hair.color || ''} ${subject.hair.style_condition || ''}`.trim();
    }
    if (subject.physical_condition_notes && subject.physical_condition_notes.length > 0) {
        fallbackDesc += `. Notes: ${subject.physical_condition_notes.join(', ')}`;
    }
    if (subject.clothing_override) fallbackDesc += `. Wearing: ${subject.clothing_override}`;
    fallbackDesc = fallbackDesc.trim();
    return fallbackDesc.endsWith('.') ? fallbackDesc : fallbackDesc + '.';
};

const getMicroExpressionCues = (baseExpression?: string | null): string => {
    if (!baseExpression) return "subtle facial movements indicating thought or emotion.";
    const lowerExpr = baseExpression.toLowerCase();
    if (lowerExpr.includes("sad") || lowerExpr.includes("melancholic")) return "their lower lip trembles slightly, eyes glisten with unshed tears, and they subtly clench their jaw.";
    if (lowerExpr.includes("happy") || lowerExpr.includes("joy")) return "their eyes crinkle at the corners, a genuine smile lights up their face, perhaps a soft chuckle escapes.";
    if (lowerExpr.includes("angry") || lowerExpr.includes("furious")) return "their brows furrow deeply, nostrils flare, lips thin into a hard line, and jaw tenses.";
    if (lowerExpr.includes("surprised") || lowerExpr.includes("shocked")) return "their eyes widen, eyebrows raise high, and mouth may fall slightly open.";
    if (lowerExpr.includes("fear") || lowerExpr.includes("scared")) return "their eyes dart around, pupils may dilate, they might swallow hard or their breath hitches.";
    if (lowerExpr.includes("thoughtful") || lowerExpr.includes("contemplative")) return "their gaze is distant, perhaps a slight frown of concentration, or a finger lightly touching their lips or chin.";
    if (lowerExpr.includes("determined") || lowerExpr.includes("focused")) return "their jaw is set, eyes narrowed with intent, and their expression is firm and unwavering.";
    if (lowerExpr.includes("awe") || lowerExpr.includes("wonder")) return "eyes widen marginally, perhaps a slight parting of the lips, breath held for a moment.";
    return `subtle facial movements reflecting ${baseExpression}.`;
};


// Updated constructShotPromptsAndData function
const constructShotPromptsAndData = (
    formData: StoryboardFormData,
    baseShotData: Partial<ShotData>,
    sceneContext: {
        sceneNumber: number; sceneId: string; sceneTitle: string; shotIndexInScene: number;
        totalShotsInScene: number; totalScenes: number; isTrailerShot: boolean;
        scenePacing: PacingOptionValue;
    },
    globalShotCounter: number,
    currentProjectAspectRatio: string,
    previousShotData?: ShotData
  ): ShotData => {
    const {
        projectTitle,
        description: projectStoryline,
        narrativeTone: projectNarrativeTone, 
        visualStyle: rawProjectVisualStyle, 
        customVisualStyle: projectCustomVisualStyle, 
        eraSetting: projectEraSetting,
        themes: projectThemes,
        characters: formCharactersInput,
        specificElements: rawSpecificElements,
        genre: projectGenre, 
      } = formData;

    const projectCharacters = formCharactersInput.filter(c => c.name || c.label || c.description).map((c, idx) => ({
        ...c,
        id: c.id || `char-form-${idx}`,
        name: c.name || `Character ${idx + 1}`,
        label: c.label || `@char${idx + 1}`,
        description: c.description || "A character in the story."
    }));

    const parsedSpecificElements = parseSpecificElementsFromString(rawSpecificElements);
    const { sceneNumber, sceneId, sceneTitle, shotIndexInScene, isTrailerShot, scenePacing } = sceneContext;
    const shotId = baseShotData.id || `shot-${Date.now()}-${globalShotCounter}`;
    const narrativePurpose = baseShotData.narrativePurpose || NARRATIVE_PURPOSE_OPTIONS[0]; 

    let imagePromptInputData: ImagePromptInput = baseShotData.imagePromptInput ? 
        JSON.parse(JSON.stringify(baseShotData.imagePromptInput)) : 
        { // Default English examples
            project_id: projectTitle.replace(/\s+/g, '_').toUpperCase() || 'PROJECT_DEFAULT',
            scene_id: sceneId,
            shot_id: shotId,
            description_narrative: baseShotData.deskripsiVisualShot || `Visuals for Scene ${sceneNumber > 0 ? sceneNumber : 'T'} (${sceneTitle}), Shot ${shotIndexInScene + 1}. Features Aris Thorne reaching for a glowing jade jaguar head artifact, the "Heart of Ixchel," on a stone altar. Her face, smudged with dirt, shows profound awe and wonder.`,
            subject_details: [{
                identifier: "Aris Thorne", // Example name
                type: "Female Archaeologist",
                age_appearance: "Early 30s",
                expression_mood: "Profound awe and wonder", // Example English mood
                key_features_override: "Face smudged with dirt",
                use_character_reference_id: projectCharacters.find(c => c.name === "Aris Thorne")?.label || "@hero"
            }],
            environment_setting: {
                location_type: "Small, hidden Mayan chamber", // Example English location
                key_elements: ["phosphorescent fungi covering ancient stone walls", "simple stone altar", "glowing jade jaguar head artifact"],
                lighting_description: "Ethereal, magical blue-green glow from phosphorescent fungi", // Example English lighting
                atmosphere_keywords: ["ancient magic", "discovery", "sacred tension"], // Example English keywords
                depth_of_field_effect: "Shallow depth of field",
            },
            camera_shot_details: {
                framing: baseShotData.tipeShotKamera || "Cinematic Still",
                angle: baseShotData.angleKamera || "Close-up",
                depth_of_field: "Shallow"
            },
            artistic_style: { 
                selected_style_preset: baseShotData.gayaVisual || (rawProjectVisualStyle === 'Other' ? projectCustomVisualStyle : rawProjectVisualStyle) || "Photorealistic",
                user_specific_style_modifiers: ["8K", "hyper-detailed", "sharp focus on her eyes and the artifact"], // English modifiers
                negative_style_elements: parsedSpecificElements.avoid || [],
            },
            seedGambar: baseShotData.seedGambar || Math.floor(Math.random() * 1000000),
            promptNegatifFallback: baseShotData.promptNegatifGambar || "blurry, low quality, text, watermark, deformed, ugly, worst quality, lowres, bad art, bad anatomy, bad hands, error, missing fngers, extra digit, fewer digits, cropped, jpeg artifacts, signature, username, artist name",
            aspectRatio: currentProjectAspectRatio,
        };
    
    imagePromptInputData.artistic_style = imagePromptInputData.artistic_style || { selected_style_preset: (rawProjectVisualStyle === 'Other' ? projectCustomVisualStyle : rawProjectVisualStyle) || "Cinematic", user_specific_style_modifiers: [], negative_style_elements: [] };
    imagePromptInputData.camera_shot_details = imagePromptInputData.camera_shot_details || { framing: "Medium Shot (MS)" };
    imagePromptInputData.environment_setting = imagePromptInputData.environment_setting || { location_type: "A suitable location", lighting_description: "Appropriate" };
    imagePromptInputData.subject_details = imagePromptInputData.subject_details || [];
    imagePromptInputData.aspectRatio = currentProjectAspectRatio;


    if ((!imagePromptInputData.subject_details || imagePromptInputData.subject_details.length === 0) && projectCharacters.length > 0) {
        const charForShot = projectCharacters[globalShotCounter % projectCharacters.length];
        imagePromptInputData.subject_details.push({
            identifier: charForShot.name, type: "Person", use_character_reference_id: charForShot.label,
            expression_mood: projectNarrativeTone || "Neutral"
        });
        if (!imagePromptInputData.description_narrative.toLowerCase().includes(charForShot.name.toLowerCase())) {
             imagePromptInputData.description_narrative += ` Features ${charForShot.name}.`;
        }
    }
    
    const {
        raw_user_prompt_input, use_raw_user_prompt,
        description_narrative, subject_details: currentSubjectDetails, attire_and_props, environment_setting, camera_shot_details,
        artistic_style, seedGambar, promptNegatifFallback, aspectRatio, character_consistency_id
    } = imagePromptInputData;
    
    const videoPromptInputBase: VideoPromptInput = baseShotData.videoPromptInput ? JSON.parse(JSON.stringify(baseShotData.videoPromptInput)) : {
        shot_duration_seconds: baseShotData.durationSuggestion || 5,
        user_video_motion_prompt: baseShotData.deskripsiGerakanVideo || `Aris Thorne discovers the artifact.`, // Example English
        pacing_intensity: scenePacing || "M", // Default to Medium Pacing
        motion_description: {
            camera_movement: "Slow push-in", // Example English
            camera_movement_target: "Aris's face and the artifact", // Example English
            subject_action: [{
                subject_identifier_from_image_prompt: currentSubjectDetails?.[0]?.identifier || "Aris Thorne",
                action_description: "Fingers tremble slightly as they hover over the artifact. Expression of awe deepens; eyes widen marginally.", // Example English
                emotion_shift_keywords: "Awe, anticipation" // Example English
            }],
            environmental_effects_animation: "Ethereal blue-green light from fungi pulses gently. Dust motes float slowly." // Example English
        }
    };
    videoPromptInputBase.motion_description = videoPromptInputBase.motion_description || {};
    videoPromptInputBase.motion_description.camera_movement = videoPromptInputBase.motion_description.camera_movement || baseShotData.cameraMovement || getRandomElement(formData.cameraMovement) || "Static Shot";
    videoPromptInputBase.motion_description.subject_action = videoPromptInputBase.motion_description.subject_action || [];
    if (videoPromptInputBase.motion_description.subject_action.length === 0 && currentSubjectDetails?.[0]) {
        videoPromptInputBase.motion_description.subject_action.push({
            subject_identifier_from_image_prompt: currentSubjectDetails[0].identifier,
            action_description: `Performs a key action relevant to ${description_narrative || 'the scene'}.`,
            emotion_shift_keywords: currentSubjectDetails[0].expression_mood || projectNarrativeTone || "Neutral"
        });
    }
    
    // --- IMAGE PROMPT (Flux Kontext) ---
    let finalImagePrompt = "";

    if (use_raw_user_prompt && raw_user_prompt_input) {
        finalImagePrompt = raw_user_prompt_input;
    } else {
        const promptParts: string[] = [];
        let openingStyle = artistic_style?.selected_style_preset || "Photorealistic";
        if (openingStyle.toLowerCase() === "default") openingStyle = "Photorealistic";
        
        let openingPhrase = `A breathtaking, ${openingStyle} cinematic still.`;
        promptParts.push(openingPhrase);
        
        let locationDesc = environment_setting?.location_type || "Small, hidden Mayan chamber";
        promptParts.push(`In ${locationDesc},`);

        if (currentSubjectDetails && currentSubjectDetails.length > 0) {
            const subjectDescriptions = currentSubjectDetails.map(subject => {
                let desc = `the subject is **${subject.identifier}**: ${getCharacterFullDescription(subject, projectCharacters)}`;
                if(subject.expression_mood) desc += ` Her face, smudged with dirt, is filled with ${subject.expression_mood}.`;
                return desc;
            });
            promptParts.push(subjectDescriptions.join(' '));
        }
        
        promptParts.push(description_narrative || "Her hand is outstretched, fingers just inches away from a beautifully carved jade jaguar head, the 'Heart of Ixchel,' which rests on a simple stone altar. The artifact itself seems to emit a soft, internal glow.");

        if (environment_setting?.lighting_description) {
            promptParts.push(`The only light source is an ${environment_setting.lighting_description}, casting soft, volumetric light and creating an atmosphere of ${environment_setting.atmosphere_keywords?.join(', ') || "ancient magic and discovery"}.`);
        }
        
        let styleDetails = `8K, hyper-detailed, sharp focus on her eyes and the artifact, with a shallow depth of field.`;
        if (artistic_style?.selected_style_preset && artistic_style.selected_style_preset !== "Photorealistic") {
             styleDetails = `${artistic_style.selected_style_preset}, ${styleDetails}`;
        }
        if(artistic_style?.user_specific_style_modifiers && artistic_style.user_specific_style_modifiers.length > 0) {
            styleDetails += `, ${artistic_style.user_specific_style_modifiers.join(', ')}`;
        }
        const baseStyleKeywords = STYLE_KEYWORD_MAPPINGS[artistic_style?.selected_style_preset || "Photorealistic"] || "";
        if (baseStyleKeywords && !styleDetails.includes(baseStyleKeywords)) styleDetails += `, ${baseStyleKeywords}`;


        promptParts.push(styleDetails);
        
        finalImagePrompt = promptParts.join(' ').replace(/\s\s+/g, ' ').trim();
    }
    
    if (character_consistency_id) finalImagePrompt += ` Character ID: ${character_consistency_id}.`;
    else if (currentSubjectDetails?.[0]?.use_character_reference_id) finalImagePrompt += ` Character Ref: ${currentSubjectDetails[0].use_character_reference_id}.`;
    
    let negativeElementsCombined: string[] = [];
    if (artistic_style?.negative_style_elements && artistic_style.negative_style_elements.length > 0) {
        negativeElementsCombined.push(...artistic_style.negative_style_elements);
    }
    const fallbackNegatives = (promptNegatifFallback || "").split(',').map(s => s.trim()).filter(s => s);
    fallbackNegatives.forEach(fn => {
        if (!negativeElementsCombined.some(ne => ne.toLowerCase().includes(fn.toLowerCase()))) {
            negativeElementsCombined.push(fn);
        }
    });
    if (parsedSpecificElements.avoid.length > 0) {
      parsedSpecificElements.avoid.forEach(item => {
        if(!negativeElementsCombined.includes(item)) negativeElementsCombined.push(item);
      });
    }
    if (negativeElementsCombined.length > 0) finalImagePrompt += ` Avoid: ${negativeElementsCombined.join(', ')}.`;

    if (aspectRatio) {
        finalImagePrompt += ` IMPORTANT: The image must be generated with a strict aspect ratio of ${aspectRatio}. Output dimensions must follow ${aspectRatio}.`;
    }
    if (seedGambar) finalImagePrompt += ` Seed: ${seedGambar}.`;
    finalImagePrompt = finalImagePrompt.replace(/\s\s+/g, ' ').trim();


    // --- IMAGE-TO-VIDEO PROMPT (Veo 2) ---
    let i2vContext = description_narrative || "Aris Thorne discovering the artifact";
    const i2vOpening = `Animate this image of ${i2vContext}.`;

    const i2vPromptParts: string[] = [i2vOpening];
    
    let i2vCameraMovement = videoPromptInputBase.motion_description?.camera_movement || "very slow, almost imperceptible push-in";
    i2vPromptParts.push(`The camera should perform a ${i2vCameraMovement} towards ${videoPromptInputBase.motion_description?.camera_movement_target || "her face and the artifact"}, enhancing the feeling of intimacy and importance.`);

    if (currentSubjectDetails && currentSubjectDetails.length > 0) {
        const firstSubject = currentSubjectDetails[0];
        const baseExpression = firstSubject.expression_mood || "awe";
        let actionDetail = videoPromptInputBase.motion_description?.subject_action?.[0]?.action_description || `Animate ${firstSubject.identifier}'s fingers to tremble ever so slightly with anticipation as they hover over the artifact. Her expression of ${baseExpression} should deepen; make her eyes widen marginally, as if she can't believe what she's seeing.`;
        i2vPromptParts.push(actionDetail);
    }
    
    if (environment_setting?.lighting_description?.toLowerCase().includes("fungi") || environment_setting?.lighting_description?.toLowerCase().includes("ethereal")) {
        i2vPromptParts.push(`The ethereal ${environment_setting.lighting_description.replace("The only light source is an ", "")} should pulse gently, as if it's breathing.`);
    }
    
    if (videoPromptInputBase.motion_description?.environmental_effects_animation?.toLowerCase().includes("dust motes")) {
        i2vPromptParts.push(`Animate dust motes to float slowly through the soft, volumetric light beams.`);
    }
    i2vPromptParts.push(`The goal is to make a silent, static moment feel alive with magic and tension.`);
    const finalImageToVideoPrompt = i2vPromptParts.join(' ').replace(/\s\s+/g, ' ').trim();


    // --- VIDEO PROMPT (Veo 3) ---
    const currentAudioSettings = baseShotData.pengaturanAudioShot || { voiceover: baseShotData.dialog || '', sfx: ["Low, soft, humming or choral drone from artifact", "Aris's single, sharp intake of breath"], music_score_description: '' };
    const finalDialog = currentAudioSettings.voiceover || '';
    
    const videoPromptSegments: string[] = [];
    
    let videoOpeningLine = `A quiet, magical, and suspenseful character moment. Video style: ${projectGenre}, ${projectNarrativeTone}.`;
    if (narrativePurpose !== "Deliver Key Information" || !description_narrative?.toLowerCase().includes("discover")) {
        videoOpeningLine = `A cinematic shot focusing on ${narrativePurpose}. Style: ${projectGenre}, ${projectNarrativeTone}.`;
    }
    videoPromptSegments.push(String(videoOpeningLine).trim());

    if (currentSubjectDetails && currentSubjectDetails.length > 0) {
        const subjectLines = currentSubjectDetails.map(subject => {
            return `*   **${subject.identifier}**: ${getCharacterFullDescription(subject, projectCharacters)}`;
        });
        videoPromptSegments.push(`**Subject:**\n${subjectLines.join('\n')}`);
    }
    
    videoPromptSegments.push(`**Location:**\n*   ${String(environment_setting?.location_type || "A small, hidden Mayan altar chamber, deep inside a silent temple.")}`);
    
    let cineAction = videoPromptInputBase.user_video_motion_prompt || `The video begins with a slow pan across the glowing ${environment_setting?.lighting_description?.includes("fungi") ? "phosphorescent fungi on the walls" : "details of the environment"}. ` +
                     `The camera then settles on ${currentSubjectDetails?.[0]?.identifier || 'Aris Thorne'} as she approaches a ${description_narrative?.includes("altar") ? "simple stone altar" : "point of interest"}. ` +
                     `The camera moves into a tight over-the-shoulder shot as her hand reaches out, fingers trembling slightly, stopping just inches from a ${description_narrative?.includes("jade jaguar head") ? "glowing jade jaguar head artifact" : "key object"}. ` +
                     `Her breath catches in her throat. The camera then cuts to a close-up of her face, capturing her expression of profound awe and reverence.`;
    if (baseShotData.catatanSutradaraKamera) cineAction += ` Director's Notes: ${baseShotData.catatanSutradaraKamera}.`;
    videoPromptSegments.push(`**Cinematography/Action:**\n*   ${String(cineAction)}`);

    let lightingDesc = environment_setting?.lighting_description || `The entire scene is illuminated by the magical, ethereal ${environment_setting?.lighting_description?.includes("fungi") ? "blue-green glow from the fungi" : "ambient light"}, creating soft shadows and beautiful, volumetric light that feels ancient and mystical.`;
    videoPromptSegments.push(`**Lighting:**\n*   ${String(lightingDesc)}`);

    let atmosphereDesc = `Awe-inspiring, magical, and filled with a quiet, sacred tension.`;
    if (environment_setting?.atmosphere_keywords && environment_setting.atmosphere_keywords.length > 0) {
        atmosphereDesc = environment_setting.atmosphere_keywords.join(', ');
    }
    videoPromptSegments.push(`**Atmosphere:**\n*   ${String(atmosphereDesc)}`);
    
    const videoStylePreset = artistic_style?.selected_style_preset || (rawProjectVisualStyle === 'Other' ? projectCustomVisualStyle : rawProjectVisualStyle) || "Cinematic";
    let videoStyleKeywords = `A cinematic 8K hyperrealistic shot with a very shallow depth of field, focusing on emotional micro-expressions and the intricate details of the artifact.`;
    if (videoStylePreset !== "Cinematic" && videoStylePreset !== "Hyperrealistic" && videoStylePreset !== "Photorealistic") {
        videoStyleKeywords = `${videoStylePreset}, ${STYLE_KEYWORD_MAPPINGS[videoStylePreset] || STYLE_KEYWORD_MAPPINGS["Default"]}. ${videoStyleKeywords}`;
    }
    videoPromptSegments.push(`**Video Style:**\n*   ${String(videoStyleKeywords)} Aspect Ratio: ${aspectRatio}.`);

    let sfxString = (currentAudioSettings.sfx || ["Low, soft, humming or choral drone from artifact", "Aris's single, sharp intake of breath"]).join(', ');
    let musicDesc = currentAudioSettings.music_score_description || "";
    let soundDesignContent = `The sound is minimalist and atmospheric. ${sfxString}`;
    if (musicDesc) soundDesignContent += (sfxString ? " Music/Score: " : "Music/Score: ") + musicDesc;
    videoPromptSegments.push(`**Sound Design:**\n*   ${String(soundDesignContent)}`);

    if (finalDialog.trim()) { 
        let speaker = currentSubjectDetails?.[0]?.identifier || "Character";
        videoPromptSegments.push(`**Dialogue:**\n*   **${speaker}:** (Voice characteristics optional) "${finalDialog.trim()}"`);
    } else {
        videoPromptSegments.push(`**Dialogue:**\n*   (Silent, her expression says everything)`);
    }
    
    const finalNegativePromptVideo = negativeElementsCombined.length > 0 ? `Avoid for video: ${negativeElementsCombined.join(', ')}.` : "";
    if (finalNegativePromptVideo) videoPromptSegments.push(String(finalNegativePromptVideo));

    const finalVideoPrompt = videoPromptSegments.map(s => String(s)).join('\n\n').trim();


    return {
      id: shotId,
      shotNumberInScene: baseShotData.shotNumberInScene === undefined ? shotIndexInScene + 1 : baseShotData.shotNumberInScene,
      fullShotIdentifier: baseShotData.fullShotIdentifier || `${isTrailerShot ? 'T' : sceneNumber}.${shotIndexInScene + 1}`,
      narrativePurpose: narrativePurpose,
      catatanSutradaraKamera: baseShotData.catatanSutradaraKamera || '',
      pengaturanAudioShot: currentAudioSettings,
      dialog: finalDialog, 
      durationSuggestion: videoPromptInputBase.shot_duration_seconds,
      cameraMovement: videoPromptInputBase.motion_description?.camera_movement, 
      deskripsiVisualShot: description_narrative, 
      gayaVisual: artistic_style?.selected_style_preset, 
      angleKamera: camera_shot_details?.angle, 
      tipeShotKamera: camera_shot_details?.framing, 
      referensiKarakter: currentSubjectDetails?.[0]?.use_character_reference_id, 
      promptNegatifGambar: negativeElementsCombined.join(', '), 
      seedGambar: seedGambar, 
      deskripsiGerakanVideo: videoPromptInputBase.user_video_motion_prompt, 
      konteksCeritaTambahan: baseShotData.konteksCeritaTambahan, 
      charactersInShot: currentSubjectDetails?.map(sd => sd.identifier) || [], 
      imagePromptInput: imagePromptInputData, 
      videoPromptInput: videoPromptInputBase, 
      imagePrompt: finalImagePrompt,
      imageToVideoPrompt: finalImageToVideoPrompt,
      videoPrompt: finalVideoPrompt,
      narrativeDescription: description_narrative.substring(0,150) + (description_narrative.length > 150 ? "..." : ""),
      imageStatus: baseShotData.imageStatus || 'idle',
      videoStatus: baseShotData.videoStatus || 'idle',
      aspectRatio: currentProjectAspectRatio,
      generatedImageUrl: baseShotData.generatedImageUrl || null,
      generatedVideoUrl: baseShotData.generatedVideoUrl || null,
    };
  };


export const generateMockStoryboard = (formData: StoryboardFormData, existingScenesInput?: SceneData[], existingTrailerInput?: TrailerData): StoryboardPreviewData => {
  let totalDurationInSeconds = parseInt(formData.totalDuration, 10);
  if (isNaN(totalDurationInSeconds) || totalDurationInSeconds <= 0) {
    totalDurationInSeconds = 60;
  }

  const {
    targetPlatform,
    sceneConfigurations,
    eraSetting, 
  } = formData;

  const projectAspectRatioFromForm = TARGET_PLATFORM_DEFAULT_RATIOS[targetPlatform] || "16:9";

  const MIN_SHOT_DURATION = 1;
  const MAX_SHOT_DURATION = 10;

  let globalShotCounterForArrayCycling = 0;
  let previousShot: ShotData | undefined = undefined;

  let trailerData: TrailerData | undefined = undefined;
  if (existingTrailerInput) {
    trailerData = {
      ...existingTrailerInput,
      id: existingTrailerInput.id || TRAILER_STATIC_ID,
      shots: existingTrailerInput.shots.map((shot, idx) => {
        const newShot = constructShotPromptsAndData(formData, shot, { sceneNumber: 0, sceneId: existingTrailerInput.id || TRAILER_STATIC_ID, sceneTitle: existingTrailerInput.title, shotIndexInScene: idx, totalShotsInScene: existingTrailerInput.shots.length, totalScenes: (sceneConfigurations || []).length, isTrailerShot: true, scenePacing: existingTrailerInput.pacing || 'M' }, globalShotCounterForArrayCycling++, projectAspectRatioFromForm, previousShot);
        previousShot = newShot;
        return newShot;
      })
    };
  } else if (totalDurationInSeconds > 60 && (!sceneConfigurations || sceneConfigurations.length > 2)) {
    const trailerTitle = `Trailer: ${formData.projectTitle || 'Mysterious Project'}`;
    const trailerDuration = Math.min(89, Math.max(30, Math.floor(totalDurationInSeconds * 0.15)));
    const trailerPacing = PACING_OPTIONS.find(p => p.value === 'F') || PACING_OPTIONS[1]; // Fast pacing for trailer
    const numTrailerShots = Math.max(3, Math.min(10, Math.floor(trailerDuration / trailerPacing.averageShotDuration)));
    const trailerShots: ShotData[] = [];
    let remainingTrailerDuration = trailerDuration;
    previousShot = undefined; 

    for (let k = 0; k < numTrailerShots; k++) {
        const shotsLeft = numTrailerShots - k;
        let shotDur = Math.round(remainingTrailerDuration / shotsLeft);
        shotDur = Math.max(trailerPacing.range[0], Math.min(trailerPacing.range[1], shotDur));
        if (k === numTrailerShots - 1) shotDur = Math.max(trailerPacing.range[0], remainingTrailerDuration);
        else shotDur = Math.min(shotDur, remainingTrailerDuration - (shotsLeft - 1) * trailerPacing.range[0]);

        remainingTrailerDuration = Math.max(0, remainingTrailerDuration - shotDur);

        const baseShotData: Partial<ShotData> = {
            id: `trailer-shot-${Date.now()}-${k + 1}`,
            durationSuggestion: shotDur,
            narrativePurpose: getRandomElement(NARRATIVE_PURPOSE_OPTIONS.filter(p => p !== "Resolution" && p !== "Establish Scene" && p !== "Introduce Character")), 
            catatanSutradaraKamera: "",
            pengaturanAudioShot: { voiceover: "", sfx: [] }
        };
        const newShot = constructShotPromptsAndData(formData, baseShotData, { sceneNumber: 0, sceneId: TRAILER_STATIC_ID, sceneTitle: trailerTitle, shotIndexInScene: k, totalShotsInScene: numTrailerShots, totalScenes: (sceneConfigurations || []).length, isTrailerShot: true, scenePacing: trailerPacing.value }, globalShotCounterForArrayCycling++, projectAspectRatioFromForm, previousShot);
        trailerShots.push(newShot);
        previousShot = newShot;
    }
    const finalTrailerDuration = trailerShots.reduce((sum, s) => sum + (s.videoPromptInput?.shot_duration_seconds || 0), 0);
    trailerData = { id: TRAILER_STATIC_ID, title: trailerTitle, shots: trailerShots, estimatedDuration: finalTrailerDuration, pacing: trailerPacing.value };
  }

  const scenesData: SceneData[] = [];
  let totalGeneratedShotsCount = 0;

  const scenesToProcess = existingScenesInput && existingScenesInput.length > 0
    ? existingScenesInput
    : (sceneConfigurations && sceneConfigurations.length > 0
        ? sceneConfigurations.map(sc => ({
            id: sc.id,
            sceneNumber: 0, 
            title: sc.title,
            estimatedDuration: sc.duration,
            shots: [], 
            pacing: sc.pacing,
            settingLokasi: eraSetting || `Location for Scene ${sc.title || ''}`, 
            settingWaktu: "Not specified", 
            deskripsiUmumScene: `General overview of Scene ${sc.title || ''}.`,
            sceneDirectorNotes: "" 
          }))
        : []);

  const totalScenesToGenerate = scenesToProcess.length;
  previousShot = undefined; 

  scenesToProcess.forEach((sceneInput, sceneIndex) => {
    const sceneId = sceneInput.id || `scene-${Date.now()}-${sceneIndex + 1}`;
    const sceneTitle = sceneInput.title || `Scene ${sceneIndex + 1}`;
    const sceneDuration = sceneInput.estimatedDuration || (totalDurationInSeconds / Math.max(1, totalScenesToGenerate));
    const scenePacingValue = sceneInput.pacing || 'M'; // Default to Medium Pacing

    const pacingInfo = PACING_OPTIONS.find(p => p.value === scenePacingValue) || PACING_OPTIONS.find(p=>p.value==='M')!;
    const numShotsInThisScene = Math.max(1, Math.round(sceneDuration / pacingInfo.averageShotDuration));

    const shotsForCurrentScene: ShotData[] = [];
    let remainingSceneDuration = sceneDuration;

    const existingShotsForThisScene = (existingScenesInput && existingScenesInput[sceneIndex]?.shots) || [];

    for (let j = 0; j < numShotsInThisScene; j++) {
      const existingShot = existingShotsForThisScene[j];
      let shotDuration: number;
      let narrativePurposeForShot: NarrativePurposeOptionValue | undefined = existingShot?.narrativePurpose;

      if (!narrativePurposeForShot) {
          if (j === 0) narrativePurposeForShot = sceneIndex === 0 ? "Establish Scene" : "Transition"; 
          else if (j === numShotsInThisScene -1 && sceneIndex === totalScenesToGenerate -1) narrativePurposeForShot = "Resolution";
          else if (j === numShotsInThisScene -1) narrativePurposeForShot = "Transition"; 
          else narrativePurposeForShot = getRandomElement(NARRATIVE_PURPOSE_OPTIONS);
      }


      if (existingShot && existingShot.videoPromptInput) {
        shotDuration = existingShot.videoPromptInput.shot_duration_seconds;
      } else if (existingShot && existingShot.durationSuggestion) {
        shotDuration = existingShot.durationSuggestion;
      } else {
        const shotsLeft = numShotsInThisScene - j;
        let idealDuration = remainingSceneDuration / shotsLeft;

        const variation = (Math.random() - 0.5) * (pacingInfo.range[1] - pacingInfo.range[0]) * 0.4;
        idealDuration += variation;

        shotDuration = Math.max(MIN_SHOT_DURATION, pacingInfo.range[0], idealDuration);
        shotDuration = Math.min(MAX_SHOT_DURATION, pacingInfo.range[1], shotDuration);
        shotDuration = Math.round(shotDuration);

        if (j === numShotsInThisScene - 1) {
            shotDuration = Math.max(MIN_SHOT_DURATION, remainingSceneDuration);
        } else {
            shotDuration = Math.min(shotDuration, remainingSceneDuration - (shotsLeft - 1) * pacingInfo.range[0]);
        }
        shotDuration = Math.max(MIN_SHOT_DURATION, shotDuration);
      }

      remainingSceneDuration = Math.max(0, remainingSceneDuration - shotDuration);

      const baseShotData: Partial<ShotData> = existingShot ? {...existingShot} : {
        id: `scene-${sceneIndex + 1}-shot-${Date.now()}-${j + 1}`,
        durationSuggestion: shotDuration,
        narrativePurpose: narrativePurposeForShot,
        catatanSutradaraKamera: "",
        pengaturanAudioShot: { voiceover: "", sfx: [] }
      };
      if(!baseShotData.narrativePurpose) baseShotData.narrativePurpose = narrativePurposeForShot;


      const newShot = constructShotPromptsAndData(formData, baseShotData, { sceneNumber: sceneIndex + 1, sceneId, sceneTitle, shotIndexInScene: j, totalShotsInScene: numShotsInThisScene, totalScenes: totalScenesToGenerate, isTrailerShot: false, scenePacing: scenePacingValue }, globalShotCounterForArrayCycling++, projectAspectRatioFromForm, previousShot);
      shotsForCurrentScene.push(newShot);
      previousShot = newShot;
    }

    let currentSceneShotDurationSum = shotsForCurrentScene.reduce((sum, s) => sum + (s.videoPromptInput?.shot_duration_seconds || 0), 0);
    let discrepancy = sceneDuration - currentSceneShotDurationSum;
    if (discrepancy !== 0 && shotsForCurrentScene.length > 0 && shotsForCurrentScene[shotsForCurrentScene.length - 1].videoPromptInput) {
        shotsForCurrentScene[shotsForCurrentScene.length - 1].videoPromptInput!.shot_duration_seconds = Math.max(MIN_SHOT_DURATION, shotsForCurrentScene[shotsForCurrentScene.length - 1].videoPromptInput!.shot_duration_seconds + discrepancy);
    }

    if (shotsForCurrentScene.length > 0) {
        scenesData.push({
          id: sceneId,
          sceneNumber: sceneIndex + 1,
          title: sceneTitle,
          estimatedDuration: shotsForCurrentScene.reduce((sum, s) => sum + (s.videoPromptInput?.shot_duration_seconds || 0), 0),
          shots: shotsForCurrentScene,
          pacing: scenePacingValue,
          settingLokasi: sceneInput.settingLokasi || formData.eraSetting || `Location for ${sceneTitle}`,
          settingWaktu: sceneInput.settingWaktu || "Not specified",
          deskripsiUmumScene: sceneInput.deskripsiUmumScene || `General overview of ${sceneTitle}.`,
          sceneDirectorNotes: sceneInput.sceneDirectorNotes || "" 
        });
        totalGeneratedShotsCount += shotsForCurrentScene.length;
    }
  });

  if (scenesData.length === 0 && DURATION_SCENE_RECOMMENDATIONS && sceneConfigurations?.length === 0) {
    const numFallbackScenes = DURATION_SCENE_RECOMMENDATIONS[formData.totalDuration]?.minScenes || 2;
    const fallbackSceneDuration = totalDurationInSeconds / numFallbackScenes;
    previousShot = undefined; 
    for (let i = 0; i < numFallbackScenes; i++) {
        const scenePacingValue = 'M' as PacingOptionValue; // Default to Medium Pacing
        const pacingInfo = PACING_OPTIONS.find(p => p.value === scenePacingValue)!;
        const numShots = Math.max(1, Math.round(fallbackSceneDuration / pacingInfo.averageShotDuration));
        const shots: ShotData[] = [];
        let remDur = fallbackSceneDuration;
        for (let j = 0; j < numShots; j++) {
            const sDur = Math.max(1, Math.round(remDur / (numShots - j)));
            remDur -= sDur;
            const newShot = constructShotPromptsAndData(formData, { durationSuggestion: sDur, narrativePurpose: getRandomElement(NARRATIVE_PURPOSE_OPTIONS), catatanSutradaraKamera: "", pengaturanAudioShot: { voiceover: "", sfx: [] } }, { sceneNumber: i + 1, sceneId: `fallback-scene-${i}`, sceneTitle: `Scene ${i + 1}`, shotIndexInScene: j, totalShotsInScene: numShots, totalScenes: numFallbackScenes, isTrailerShot: false, scenePacing: scenePacingValue }, globalShotCounterForArrayCycling++, projectAspectRatioFromForm, previousShot);
            shots.push(newShot);
            previousShot = newShot;
        }
        scenesData.push({ 
            id: `fallback-scene-${i}`, 
            sceneNumber: i+1, 
            title: `Scene ${i+1}`, 
            estimatedDuration: fallbackSceneDuration, 
            shots, 
            pacing: scenePacingValue,
            settingLokasi: formData.eraSetting || `Location for Scene ${i+1}`,
            settingWaktu: "Not specified",
            deskripsiUmumScene: `General overview of Scene ${i+1}.`,
            sceneDirectorNotes: "" 
        });
        totalGeneratedShotsCount += shots.length;
    }
  }

  return { formData, trailer: trailerData, scenes: scenesData, totalScenes: scenesData.length, totalShots: totalGeneratedShotsCount, projectAspectRatio: projectAspectRatioFromForm };
};


// Helper function for downloads
const downloadFile = (url: string, filename: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


const PreviewStoryboardPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [storyboardPreview, setStoryboardPreview] = useState<StoryboardPreviewData | null>(null);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [expandedSegments, setExpandedSegments] = useState<Record<string, boolean>>({});

  const [isShotDetailModalOpen, setIsShotDetailModalOpen] = useState(false);
  const [editingShot, setEditingShot] = useState<ShotData | null>(null);
  const [currentEditingShotData, setCurrentEditingShotData] = useState<{
      imagePromptInput?: Partial<ImagePromptInput>;
      videoPromptInput?: Partial<VideoPromptInput>;
      narrativePurpose?: NarrativePurposeOptionValue; 
      gayaVisual?: string;
      angleKamera?: string;
      tipeShotKamera?: string;
      referensiKarakter?: string;
      promptNegatifGambar?: string;
      cameraMovement?: string; 
      user_video_motion_prompt?: string; 
      camera_movement_target?: string; 
      catatanSutradaraKamera?: string;
      pengaturanAudioShot?: Partial<AudioShotSettings>; 
  }>({});

  const [editingShotSegmentId, setEditingShotSegmentId] = useState<string | null>(null);
  const [isEditingTrailerShot, setIsEditingTrailerShot] = useState<boolean>(false);

  // States for unified media preview modal
  const [isMediaPreviewModalOpen, setIsMediaPreviewModalOpen] = useState(false);
  const [previewingShot, setPreviewingShot] = useState<ShotData | null>(null);
  const [currentMediaInPreview, setCurrentMediaInPreview] = useState<'image' | 'video'>('image');


  const [operationError, setOperationError] = useState<{
    imageGenShotId: string | null;
    videoGenShotId: string | null;
    message: string | null;
  }>({ imageGenShotId: null, videoGenShotId: null, message: null });

  const [toastInfo, setToastInfo] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info', icon?: React.ReactNode }>({ show: false, message: '', type: 'success' });

  useEffect(() => {
    const locationState = location.state as { generatedData?: StoryboardPreviewData, savedProject?: SavedProject } | null | undefined;
    const { generatedData, savedProject } = locationState || {};

    let dataToUse: StoryboardPreviewData | null = null;

    if (savedProject?.projectType === 'storyboard' && savedProject.formData) {
        dataToUse = generateMockStoryboard(savedProject.formData, savedProject.scenes, savedProject.trailer);
    } else if (generatedData) {
        dataToUse = generatedData;
    }

    if (dataToUse) {
        setStoryboardPreview(dataToUse);
        const initialExpanded: Record<string, boolean> = {};
        if (dataToUse.trailer) initialExpanded[dataToUse.trailer.id] = true;
        dataToUse.scenes.forEach(scene => initialExpanded[scene.id] = true);
        setExpandedSegments(initialExpanded);

        if (location.state && (location.state.generatedData || location.state.savedProject)) {
            navigate(location.pathname, { replace: true, state: {} });
        }
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (storyboardPreview?.formData?.projectTitle) {
      document.title = `Preview: ${storyboardPreview.formData.projectTitle} - Nufa Studio`;
    } else if (!document.title.startsWith("Preview:")) {
      document.title = 'Preview Storyboard - Nufa Studio';
    }
  }, [storyboardPreview?.formData?.projectTitle]);
  
  useEffect(() => {
    let timer: number;
    if (toastInfo.show) {
      timer = window.setTimeout(() => {
        setToastInfo({ show: false, message: '', type: 'success', icon: undefined });
      }, 4000);
    }
    return () => window.clearTimeout(timer);
  }, [toastInfo.show]);

  const copyToClipboard = useCallback((text: string | undefined, shotId: string, type: 'image' | 'video' | 'i2v') => {
    if (!text) {
        setToastInfo({show: true, message: `${type === 'image' ? 'Image' : type === 'video' ? 'Video' : 'I2V'} prompt is empty.`, type: 'info', icon: <AlertIcon />});
        return;
    }
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStates(prev => ({ ...prev, [`${type}-${shotId}`]: true }));
      setToastInfo({show: true, message: `${type === 'image' ? 'Image' : type === 'video' ? 'Video' : 'I2V'} prompt copied!`, type: 'success', icon: <CheckCircleIcon />})
      setTimeout(() => setCopiedStates(prev => ({ ...prev, [`${type}-${shotId}`]: false })), 2000);
    }).catch(err => {
        console.error(`Could not copy ${type} prompt: `, err);
        setToastInfo({show: true, message: `Could not copy ${type} prompt.`, type: 'error', icon: <AlertIcon />})
    });
  }, []);

  const toggleSegmentExpansion = (segmentId: string) => {
    setExpandedSegments(prev => ({ ...prev, [segmentId]: !prev[segmentId] }));
  };

  const handleEditShot = (shot: ShotData, segmentId: string, isTrailer: boolean) => {
    setEditingShot(shot);
    const imagePromptInputForEdit = shot.imagePromptInput ? JSON.parse(JSON.stringify(shot.imagePromptInput)) : {};
    let videoPromptInputForEdit = shot.videoPromptInput ? JSON.parse(JSON.stringify(shot.videoPromptInput)) : {};
    
    if (!videoPromptInputForEdit.motion_description) {
        videoPromptInputForEdit.motion_description = {};
    }

    const audioSettingsForEdit = shot.pengaturanAudioShot ? JSON.parse(JSON.stringify(shot.pengaturanAudioShot)) : { voiceover: shot.dialog || '', sfx: [] };
    if (!audioSettingsForEdit.voiceover && shot.dialog) { 
        audioSettingsForEdit.voiceover = shot.dialog;
    }


    setCurrentEditingShotData({
        imagePromptInput: imagePromptInputForEdit,
        videoPromptInput: videoPromptInputForEdit,
        narrativePurpose: shot.narrativePurpose, 
        gayaVisual: shot.imagePromptInput?.artistic_style?.selected_style_preset ?? shot.gayaVisual,
        angleKamera: shot.imagePromptInput?.camera_shot_details?.angle ?? shot.angleKamera,
        tipeShotKamera: shot.imagePromptInput?.camera_shot_details?.framing ?? shot.tipeShotKamera,
        referensiKarakter: shot.referensiKarakter,
        promptNegatifGambar: (shot.imagePromptInput?.artistic_style?.negative_style_elements || []).join(', ') || shot.promptNegatifGambar,
        cameraMovement: shot.videoPromptInput?.motion_description?.camera_movement ?? shot.cameraMovement,
        user_video_motion_prompt: videoPromptInputForEdit.user_video_motion_prompt,
        camera_movement_target: videoPromptInputForEdit.motion_description?.camera_movement_target,
        catatanSutradaraKamera: shot.catatanSutradaraKamera,
        pengaturanAudioShot: audioSettingsForEdit,
    });
    setEditingShotSegmentId(segmentId);
    setIsEditingTrailerShot(isTrailer);
    setIsShotDetailModalOpen(true);
  };

  const handleShotDetailChange = useCallback((path: string, value: any) => {
    setCurrentEditingShotData(prev => {
        const newShotData = JSON.parse(JSON.stringify(prev)); 
        let currentLevel: any = newShotData;
        const keys = path.split('.');

        keys.forEach((key, index) => {
            const arrayMatch = key.match(/(\w+)\[(\d+)\]/);
            if (index === keys.length - 1) { 
                if (arrayMatch) {
                    const arrayKey = arrayMatch[1];
                    const arrayIndex = parseInt(arrayMatch[2], 10);
                    if (!currentLevel[arrayKey] || !Array.isArray(currentLevel[arrayKey])) {
                        currentLevel[arrayKey] = []; 
                    }
                    while (currentLevel[arrayKey].length <= arrayIndex) {
                        currentLevel[arrayKey].push(Array.isArray(value) ? {} : null); 
                    }
                    currentLevel[arrayKey][arrayIndex] = value;
                } else {
                    currentLevel[key] = value;
                }
            } else { 
                if (arrayMatch) {
                    const arrayKey = arrayMatch[1];
                    const arrayIndex = parseInt(arrayMatch[2], 10);
                    if (!currentLevel[arrayKey] || !Array.isArray(currentLevel[arrayKey])) {
                        currentLevel[arrayKey] = [];
                    }
                     while (currentLevel[arrayKey].length <= arrayIndex) {
                        currentLevel[arrayKey].push({});
                    }
                    currentLevel = currentLevel[arrayKey][arrayIndex];
                } else {
                    if (!currentLevel[key] || typeof currentLevel[key] !== 'object') {
                        currentLevel[key] = {}; 
                    }
                    currentLevel = currentLevel[key];
                }
            }
        });
        return newShotData;
    });
  }, []);


  const handleSaveShotDetails = () => {
    if (!editingShot || !storyboardPreview || !editingShotSegmentId) return;

    let updatedImagePromptInput: ImagePromptInput = editingShot.imagePromptInput
        ? JSON.parse(JSON.stringify(editingShot.imagePromptInput))
        : {} as ImagePromptInput; 

    let updatedVideoPromptInput: VideoPromptInput = editingShot.videoPromptInput
        ? JSON.parse(JSON.stringify(editingShot.videoPromptInput))
        : {} as VideoPromptInput;

    if (currentEditingShotData.imagePromptInput) {
        updatedImagePromptInput = { ...updatedImagePromptInput, ...currentEditingShotData.imagePromptInput };
    }
    if (currentEditingShotData.videoPromptInput) {
        updatedVideoPromptInput = { ...updatedVideoPromptInput, ...currentEditingShotData.videoPromptInput };
    }
    
    if (currentEditingShotData.user_video_motion_prompt !== undefined) {
        updatedVideoPromptInput.user_video_motion_prompt = currentEditingShotData.user_video_motion_prompt;
    }
    if (currentEditingShotData.camera_movement_target !== undefined) {
        if (!updatedVideoPromptInput.motion_description) updatedVideoPromptInput.motion_description = {};
        updatedVideoPromptInput.motion_description.camera_movement_target = currentEditingShotData.camera_movement_target;
    }
     if (currentEditingShotData.gayaVisual) {
        if(!updatedImagePromptInput.artistic_style) updatedImagePromptInput.artistic_style = {selected_style_preset: ''};
        updatedImagePromptInput.artistic_style.selected_style_preset = currentEditingShotData.gayaVisual;
    }
    if (currentEditingShotData.angleKamera) {
        if(!updatedImagePromptInput.camera_shot_details) updatedImagePromptInput.camera_shot_details = {framing: ''};
        updatedImagePromptInput.camera_shot_details.angle = currentEditingShotData.angleKamera;
    }
     if (currentEditingShotData.tipeShotKamera) {
        if(!updatedImagePromptInput.camera_shot_details) updatedImagePromptInput.camera_shot_details = {framing: ''};
        updatedImagePromptInput.camera_shot_details.framing = currentEditingShotData.tipeShotKamera;
    }
    if (currentEditingShotData.promptNegatifGambar) {
        if(!updatedImagePromptInput.artistic_style) updatedImagePromptInput.artistic_style = {selected_style_preset: ''};
        updatedImagePromptInput.artistic_style.negative_style_elements = currentEditingShotData.promptNegatifGambar.split(',').map(s => s.trim()).filter(s => s);
    }
     if (currentEditingShotData.cameraMovement) {
        if (!updatedVideoPromptInput.motion_description) updatedVideoPromptInput.motion_description = {};
        updatedVideoPromptInput.motion_description.camera_movement = currentEditingShotData.cameraMovement;
    }


    const updatedShotBase: ShotData = {
        ...JSON.parse(JSON.stringify(editingShot)), 
        narrativePurpose: currentEditingShotData.narrativePurpose ?? editingShot.narrativePurpose, 
        imagePromptInput: updatedImagePromptInput,
        videoPromptInput: updatedVideoPromptInput,
        catatanSutradaraKamera: currentEditingShotData.catatanSutradaraKamera ?? editingShot.catatanSutradaraKamera ?? "",
        pengaturanAudioShot: {
            voiceover: currentEditingShotData.pengaturanAudioShot?.voiceover ?? editingShot.pengaturanAudioShot?.voiceover ?? "",
            sfx: currentEditingShotData.pengaturanAudioShot?.sfx ?? editingShot.pengaturanAudioShot?.sfx ?? [],
            music_score_description: currentEditingShotData.pengaturanAudioShot?.music_score_description ?? editingShot.pengaturanAudioShot?.music_score_description ?? ""
        },
    };
        
    const sceneForContext = storyboardPreview.scenes.find(s => s.id === editingShotSegmentId && !isEditingTrailerShot);
    const trailerForContext = storyboardPreview.trailer;
    const isTrailerContext = isEditingTrailerShot && trailerForContext && trailerForContext.id === editingShotSegmentId;

    let shotContextData;
    let shotIndexInSegment = -1;
    let previousShotInSegment: ShotData | undefined = undefined;


    if (isTrailerContext && trailerForContext) {
        shotIndexInSegment = trailerForContext.shots.findIndex(s => s.id === editingShot!.id);
        if (shotIndexInSegment > 0) previousShotInSegment = trailerForContext.shots[shotIndexInSegment -1];
        shotContextData = {
            sceneNumber: 0, sceneId: trailerForContext.id, sceneTitle: trailerForContext.title, shotIndexInScene: shotIndexInSegment,
            totalShotsInScene: trailerForContext.shots.length, totalScenes: storyboardPreview.scenes.length,
            isTrailerShot: true, scenePacing: trailerForContext.pacing || 'M' // Default to Medium Pacing
        };
    } else if (sceneForContext) {
        shotIndexInSegment = sceneForContext.shots.findIndex(s => s.id === editingShot!.id);
         if (shotIndexInSegment > 0) previousShotInSegment = sceneForContext.shots[shotIndexInSegment -1];
         else if (sceneForContext.sceneNumber > 1) { 
            const prevScene = storyboardPreview.scenes.find(s => s.sceneNumber === sceneForContext.sceneNumber -1);
            if (prevScene && prevScene.shots.length > 0) previousShotInSegment = prevScene.shots[prevScene.shots.length -1];
         }

        shotContextData = {
            sceneNumber: sceneForContext.sceneNumber, sceneId: sceneForContext.id, sceneTitle: sceneForContext.title || `Scene ${sceneForContext.sceneNumber}`,
            shotIndexInScene: shotIndexInSegment, totalShotsInScene: sceneForContext.shots.length,
            totalScenes: storyboardPreview.scenes.length, isTrailerShot: false, scenePacing: sceneForContext.pacing || 'M' // Default to Medium Pacing
        };
    }

    if (!shotContextData || shotIndexInSegment === -1) {
        setToastInfo({ show: true, message: 'Error: Could not find shot context for saving.', type: 'error', icon: <AlertIcon /> });
        return;
    }

    const projectAspRatio = storyboardPreview.projectAspectRatio || "16:9";

    const finalUpdatedShot = constructShotPromptsAndData(
        storyboardPreview.formData,
        updatedShotBase, 
        shotContextData,
        shotIndexInSegment, 
        projectAspRatio,
        previousShotInSegment 
    );
    finalUpdatedShot.generatedImageUrl = editingShot.generatedImageUrl; // Preserve AI generated image
    finalUpdatedShot.generatedVideoUrl = editingShot.generatedVideoUrl;
    finalUpdatedShot.imageStatus = editingShot.imageStatus;
    finalUpdatedShot.videoStatus = editingShot.videoStatus;


    setStoryboardPreview(prev => {
        if (!prev) return null;
        let newScenes = prev.scenes.map(s => ({...s, shots: [...s.shots]})); 
        let newTrailer = prev.trailer ? { ...prev.trailer, shots: [...prev.trailer.shots] } : undefined;

        if (isEditingTrailerShot && newTrailer) {
            const shotIdx = newTrailer.shots.findIndex(s => s.id === editingShot!.id);
            if (shotIdx !== -1) newTrailer.shots[shotIdx] = finalUpdatedShot;
        } else {
            const sceneIdx = newScenes.findIndex(s => s.id === editingShotSegmentId);
            if (sceneIdx !== -1) {
                const shotIdx = newScenes[sceneIdx].shots.findIndex(s => s.id === editingShot!.id);
                if (shotIdx !== -1) {
                    newScenes[sceneIdx].shots[shotIdx] = finalUpdatedShot;
                }
            }
        }
        return { ...prev, scenes: newScenes, trailer: newTrailer };
    });

    setIsShotDetailModalOpen(false);
    setEditingShot(null);
    setEditingShotSegmentId(null);
    setToastInfo({ show: true, message: 'Shot details updated!', type: 'success', icon: <CheckCircleIcon /> });
  };

  const updateShotStatus = (shotId: string, segmentId: string, isTrailer: boolean, type: 'image' | 'video', status: GenerationStatus, url?: string | null) => {
    setStoryboardPreview(prev => {
        if (!prev) return null;
        const newStoryboardPreview = JSON.parse(JSON.stringify(prev)) as StoryboardPreviewData;

        const findAndModifyShot = (shots: ShotData[]) => {
            const shotIndex = shots.findIndex(s => s.id === shotId);
            if (shotIndex !== -1) {
                if (type === 'image') {
                    shots[shotIndex].imageStatus = status;
                    if (url !== undefined) shots[shotIndex].generatedImageUrl = url;
                } else { // video
                    shots[shotIndex].videoStatus = status;
                    if (url !== undefined) shots[shotIndex].generatedVideoUrl = url;
                }
                return true;
            }
            return false;
        };

        if (isTrailer && newStoryboardPreview.trailer && newStoryboardPreview.trailer.id === segmentId) {
            findAndModifyShot(newStoryboardPreview.trailer.shots);
        } else {
            const scene = newStoryboardPreview.scenes.find(s => s.id === segmentId);
            if (scene) {
                findAndModifyShot(scene.shots);
            }
        }
        return newStoryboardPreview;
    });
};


  const handleImageGeneration = async (shot: ShotData, segmentId: string, isTrailer: boolean) => {
    setOperationError({ imageGenShotId: null, videoGenShotId: null, message: null });
    updateShotStatus(shot.id, segmentId, isTrailer, 'image', 'generating', null); 

    try {
        console.log(`[MOCK REGEN] Generating new mock image for shot ${shot.fullShotIdentifier}.`);
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        
        const aspectRatio = shot.aspectRatio || storyboardPreview?.projectAspectRatio || "16:9";
        let width = 640;
        let height = 360;
        const ratioParts = aspectRatio.split(':');
        if (ratioParts.length === 2) {
            const wRatio = parseFloat(ratioParts[0]);
            const hRatio = parseFloat(ratioParts[1]);
            if (!isNaN(wRatio) && !isNaN(hRatio) && wRatio > 0 && hRatio > 0) {
                const baseMockWidth = 480;
                width = baseMockWidth;
                height = Math.round(baseMockWidth * (hRatio / wRatio));
            }
        }
        const mockImageUrl = `https://picsum.photos/seed/${shot.id.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now()}/${width}/${height}`;
        
        updateShotStatus(shot.id, segmentId, isTrailer, 'image', 'generated', mockImageUrl);
        setToastInfo({show: true, message: `New mock image for shot ${shot.fullShotIdentifier} loaded!`, type: 'success', icon: <CheckCircleIcon />});

    } catch (error: any) {
        console.error("Error regenerating mock image:", error);
        updateShotStatus(shot.id, segmentId, isTrailer, 'image', 'error');
        setOperationError({ imageGenShotId: shot.id, videoGenShotId: null, message: "Mock image loading failed." });
        setToastInfo({show: true, message: `Mock image loading failed for ${shot.fullShotIdentifier}.`, type: 'error', icon: <AlertIcon />});
    }
  };

  const handleVideoGeneration = async (shot: ShotData, segmentId: string, isTrailer: boolean) => {
     if (!shot.generatedImageUrl) {
        setOperationError({ imageGenShotId: null, videoGenShotId: shot.id, message: "Please generate the panel image first." });
        setToastInfo({show: true, message: "Please generate the panel image first.", type: 'info', icon: <AlertIcon />});
        return;
    }
    setOperationError({ imageGenShotId: null, videoGenShotId: null, message: null });
    updateShotStatus(shot.id, segmentId, isTrailer, 'video', 'generating');

    try {
        console.log("Simulating Video generation based on Image-to-Video Prompt for:", shot.fullShotIdentifier);
        console.log("Image-to-Video (Veo 2) prompt:", shot.imageToVideoPrompt); 
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
        
        updateShotStatus(shot.id, segmentId, isTrailer, 'video', 'generated', MOCK_VIDEO_URL);
        setToastInfo({show: true, message: `Video for shot ${shot.fullShotIdentifier} generated (Mock)!`, type: 'success', icon: <CheckCircleIcon />});

    } catch (error: any) {
        console.error("Error simulating video generation:", error);
        const errorMessage = error.message || "Unknown error during video generation.";
        updateShotStatus(shot.id, segmentId, isTrailer, 'video', 'error');
        setOperationError({ imageGenShotId: null, videoGenShotId: shot.id, message: errorMessage });
        setToastInfo({show: true, message: `Video gen failed for ${shot.fullShotIdentifier}: ${errorMessage}`, type: 'error', icon: <AlertIcon />});
    }
  };

  const handleSaveToMyProjects = () => {
    if (!storyboardPreview) {
        setToastInfo({ show: true, message: 'No storyboard data to save.', type: 'error', icon: <AlertIcon /> });
        return;
    }
    try {
        const savedProjectsString = localStorage.getItem('nufa-projects');
        let projects: SavedProject[] = savedProjectsString ? JSON.parse(savedProjectsString) : [];
        if (!Array.isArray(projects)) projects = [];

        const existingProjectIndex = projects.findIndex(p =>
            p.projectType === 'storyboard' &&
            p.formData?.projectTitle === storyboardPreview.formData.projectTitle
        );

        const projectToSave: SavedProject = {
            id: (existingProjectIndex !== -1 ? projects[existingProjectIndex].id : `storyboard-${Date.now().toString()}`),
            lastModified: new Date().toISOString(),
            projectType: 'storyboard',
            formData: storyboardPreview.formData,
            trailer: storyboardPreview.trailer,
            scenes: storyboardPreview.scenes,
            totalScenes: storyboardPreview.totalScenes,
            totalShots: storyboardPreview.totalShots,
            projectAspectRatio: storyboardPreview.projectAspectRatio,
        };

        if (existingProjectIndex !== -1) {
            projects[existingProjectIndex] = projectToSave;
        } else {
            projects.unshift(projectToSave);
        }

        projects.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
        localStorage.setItem('nufa-projects', JSON.stringify(projects));

        setToastInfo({ show: true, message: 'Storyboard saved to My Projects!', type: 'success', icon: <CheckCircleIcon /> });

    } catch (error) {
        console.error("Error saving to My Projects:", error);
        setToastInfo({ show: true, message: 'Failed to save storyboard. Please try again.', type: 'error', icon: <AlertIcon /> });
    }
  };


  const openMediaPreviewModal = (shot: ShotData, mediaType: 'image' | 'video') => {
    setPreviewingShot(shot);
    setCurrentMediaInPreview(mediaType);
    setIsMediaPreviewModalOpen(true);
  };
  
  const closeMediaPreviewModal = () => {
    setIsMediaPreviewModalOpen(false);
    setPreviewingShot(null);
  };

  const handleDownloadMedia = () => {
    if (!previewingShot) return;
    let imageDownloaded = false;
    let videoDownloaded = false;

    if (previewingShot.generatedImageUrl) {
        try {
            downloadFile(previewingShot.generatedImageUrl, `${previewingShot.fullShotIdentifier}_image.jpg`);
            imageDownloaded = true;
        } catch (e) { console.error("Error downloading image:", e); }
    }
    if (previewingShot.generatedVideoUrl) {
        try {
            downloadFile(previewingShot.generatedVideoUrl, `${previewingShot.fullShotIdentifier}_video.mp4`);
            videoDownloaded = true;
        } catch (e) { console.error("Error downloading video:", e); }
    }

    if(imageDownloaded && videoDownloaded){
        setToastInfo({ show: true, message: 'Image and Video downloaded!', type: 'success', icon: <CheckCircleIcon /> });
    } else if (imageDownloaded) {
        setToastInfo({ show: true, message: 'Image downloaded!', type: 'success', icon: <CheckCircleIcon /> });
    } else if (videoDownloaded) {
        setToastInfo({ show: true, message: 'Video downloaded!', type: 'success', icon: <CheckCircleIcon /> });
    } else {
        setToastInfo({ show: true, message: 'No media found to download for this shot.', type: 'error', icon: <AlertIcon /> });
    }
  };

  const switchPreviewMediaInModal = () => {
    if (!previewingShot) return;
    if (currentMediaInPreview === 'image' && previewingShot.generatedVideoUrl) {
        setCurrentMediaInPreview('video');
    } else if (currentMediaInPreview === 'video' && previewingShot.generatedImageUrl) {
        setCurrentMediaInPreview('image');
    }
  };

  const renderPromptDisplaySection = (shot: ShotData | null) => {
    if (!shot) return null;
    return (
      <div className="mt-3 pt-2 border-t border-neutral-300 dark:border-neutral-600 space-y-2">
        <h4 className="text-xs font-semibold text-neutral-800 dark:text-white mb-1">Generated Prompts:</h4>
        <div className="group">
          <div className="flex justify-between items-center">
            <span className="text-2xs font-medium text-neutral-600 dark:text-neutral-400">Image Prompt</span>
            <Button variant="ghost" size="sm" className="!p-0.5" onClick={() => copyToClipboard(shot.imagePrompt, shot.id, 'image')} aria-label="Copy Image Prompt">
              <ClipboardDocumentIcon className={`w-3 h-3 ${copiedStates[`image-${shot.id}`] ? 'text-green-500' : ''}`} />
            </Button>
          </div>
          <p className="text-2xs bg-neutral-100 dark:bg-neutral-700 p-1 rounded text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap max-h-20 overflow-y-auto" title={shot.imagePrompt}>{shot.imagePrompt || "Not available"}</p>
        </div>
        <div className="group">
          <div className="flex justify-between items-center">
            <span className="text-2xs font-medium text-neutral-600 dark:text-neutral-400">Image-to-Video Prompt</span>
            <Button variant="ghost" size="sm" className="!p-0.5" onClick={() => copyToClipboard(shot.imageToVideoPrompt, shot.id, 'i2v')} aria-label="Copy I2V Prompt">
              <ClipboardDocumentIcon className={`w-3 h-3 ${copiedStates[`i2v-${shot.id}`] ? 'text-green-500' : ''}`} />
            </Button>
          </div>
          <p className="text-2xs bg-neutral-100 dark:bg-neutral-700 p-1 rounded text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap max-h-20 overflow-y-auto" title={shot.imageToVideoPrompt}>{shot.imageToVideoPrompt || "Not available"}</p>
        </div>
        <div className="group">
          <div className="flex justify-between items-center">
            <span className="text-2xs font-medium text-neutral-600 dark:text-neutral-400">Video Prompt (Veo 3)</span>
            <Button variant="ghost" size="sm" className="!p-0.5" onClick={() => copyToClipboard(shot.videoPrompt, shot.id, 'video')} aria-label="Copy Video Prompt">
              <ClipboardDocumentIcon className={`w-3 h-3 ${copiedStates[`video-${shot.id}`] ? 'text-green-500' : ''}`} />
            </Button>
          </div>
          <p className="text-2xs bg-neutral-100 dark:bg-neutral-700 p-1 rounded text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap max-h-20 overflow-y-auto" title={shot.videoPrompt}>{shot.videoPrompt || "Not available"}</p>
        </div>
      </div>
    );
  };


  const renderShotCard = (shot: ShotData, segmentId: string, isTrailer: boolean) => {
    const imageGenErrorForThisShot = operationError.imageGenShotId === shot.id ? operationError.message : null;
    const videoGenErrorForThisShot = operationError.videoGenShotId === shot.id ? operationError.message : null;

    const currentShotAspectRatio = shot.aspectRatio || storyboardPreview?.projectAspectRatio || "16:9";
    const [wStr, hStr] = currentShotAspectRatio.split(':');
    const w = parseFloat(wStr);
    const h = parseFloat(hStr);

    let imageContainerStyle: React.CSSProperties = {
        width: '100%',
        maxWidth: '170px', 
    };

    if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
        imageContainerStyle.aspectRatio = `${w} / ${h}`;
    } else {
        imageContainerStyle.aspectRatio = `16 / 9`; 
    }
    
    let mediaDisplayIcon = <PhotoIcon className="w-7 h-7 text-neutral-400 dark:text-neutral-500" />; 
    let mediaStatusText = "";
    let mainPreviewActionIcon: JSX.Element;
    let mainPreviewActionHandler: () => void;


    if (shot.videoStatus === 'generated' && shot.generatedVideoUrl) {
        mediaDisplayIcon = <PlayCircleIcon className="w-7 h-7 text-brand-teal" />; 
        mainPreviewActionIcon = <PlayCircleIcon className="w-4 h-4" />; 
        mainPreviewActionHandler = () => openMediaPreviewModal(shot, 'video');
    } else if (shot.imageStatus === 'generated' && shot.generatedImageUrl) {
         mediaDisplayIcon = <img src={shot.generatedImageUrl} alt={`Panel for shot ${shot.fullShotIdentifier}`} className="w-full h-full object-contain" />;
         mainPreviewActionIcon = <EyeIcon className="w-4 h-4" />; 
         mainPreviewActionHandler = () => openMediaPreviewModal(shot, 'image');
    } else if (shot.videoStatus === 'generating') {
        mediaDisplayIcon = <ArrowPathIcon className="w-7 h-7 text-brand-teal animate-spin" />; 
        mediaStatusText = "Gen Video...";
        mainPreviewActionIcon = <PlayCircleIcon className="w-4 h-4 opacity-50" />; 
        mainPreviewActionHandler = () => {}; 
    } else if (shot.imageStatus === 'generating') {
        mediaDisplayIcon = <ArrowPathIcon className="w-7 h-7 text-brand-teal animate-spin" />; 
        mediaStatusText = "Gen Image...";
        mainPreviewActionIcon = <EyeIcon className="w-4 h-4 opacity-50" />; 
        mainPreviewActionHandler = () => {}; 
    } else if (shot.videoStatus === 'error') {
        mediaDisplayIcon = <AlertIcon className="w-7 h-7 text-red-500" />;
        mediaStatusText = "Video Err";
        mainPreviewActionIcon = <PlayCircleIcon className="w-4 h-4 text-red-500" />;
        mainPreviewActionHandler = () => setToastInfo({show:true, message:"Video generation failed previously.", type:"error"});
    } else if (shot.imageStatus === 'error') {
        mediaDisplayIcon = <AlertIcon className="w-7 h-7 text-red-500" />;
        mediaStatusText = "Image Err";
        mainPreviewActionIcon = <EyeIcon className="w-4 h-4 text-red-500" />;
        mainPreviewActionHandler = () => setToastInfo({show:true, message:"Image generation failed previously.", type:"error"});
    } else { // Idle state
        mainPreviewActionIcon = <EyeIcon className="w-4 h-4" />;
        mainPreviewActionHandler = () => openMediaPreviewModal(shot, 'image'); 
    }

    return (
      <Card key={shot.id} className="flex flex-col space-y-1 p-2 bg-white dark:bg-brand-bg-card shadow-md hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start">
          <h4 className="text-xs font-semibold text-neutral-800 dark:text-white">
            Shot {shot.fullShotIdentifier}
            <span className="text-2xs font-normal text-neutral-500 dark:text-neutral-400 ml-1">({shot.videoPromptInput?.shot_duration_seconds || 5}s)</span>
            {shot.narrativePurpose && <span className="block text-2xs text-brand-teal font-medium">{shot.narrativePurpose}</span>}
          </h4>
          <Button variant="ghost" size="sm" className="!p-0.5" onClick={() => handleEditShot(shot, segmentId, isTrailer)}>
            <PencilSquareIcon className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div style={imageContainerStyle} className="relative bg-neutral-200 dark:bg-neutral-700 rounded flex items-center justify-center overflow-hidden mx-auto group">
          {mediaDisplayIcon}
          {mediaStatusText && (shot.imageStatus !== 'generated' || shot.videoStatus !== 'generated') && (
             <p className="absolute bottom-0.5 text-2xs text-white bg-black/50 px-0.5 rounded">{mediaStatusText}</p>
          )}

          {(shot.generatedImageUrl || shot.generatedVideoUrl) && (shot.imageStatus !== 'generating' && shot.videoStatus !== 'generating') && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 !p-1 bg-black/40 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full z-10"
              onClick={mainPreviewActionHandler}
              aria-label="Preview media"
            >
              {mainPreviewActionIcon}
            </Button>
          )}
        </div>
        {imageGenErrorForThisShot && <p className="text-2xs text-red-500 dark:text-red-400 text-center">{imageGenErrorForThisShot}</p>}
        {videoGenErrorForThisShot && <p className="text-2xs text-red-500 dark:text-red-400 text-center">{videoGenErrorForThisShot}</p>}


        <div className="space-y-0.5 text-2xs">
          {shot.narrativeDescription && <p className="text-neutral-600 dark:text-neutral-400 line-clamp-2" title={shot.narrativeDescription}><strong>Narrative:</strong> {shot.narrativeDescription}</p> }
          {shot.videoPromptInput?.motion_description?.camera_movement && <p className="text-neutral-600 dark:text-neutral-400"><strong>Movement:</strong> {shot.videoPromptInput?.motion_description?.camera_movement || "Static"}</p>}
          
          {shot.imagePromptInput?.subject_details && shot.imagePromptInput.subject_details.length > 0 ? (
            <p className="text-neutral-600 dark:text-neutral-400"><strong>Chars:</strong> {shot.imagePromptInput.subject_details.map(sd => sd.identifier).join(', ')}</p>
          ) : null}
          
          {shot.dialog && (
            <p className="text-neutral-600 dark:text-neutral-400 line-clamp-1" title={shot.dialog}><strong>Dialog:</strong> {shot.dialog}</p>
          ) }
          
          {shot.catatanSutradaraKamera && (
            <p className="text-neutral-600 dark:text-neutral-400 line-clamp-1" title={shot.catatanSutradaraKamera}><strong>Notes:</strong> {shot.catatanSutradaraKamera}</p>
          ) }
        </div>
        
        <div className="flex flex-col sm:flex-row gap-1 pt-1 border-t border-neutral-200 dark:border-neutral-700">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleImageGeneration(shot, segmentId, isTrailer)}
            disabled={shot.imageStatus === 'generating' || shot.videoStatus === 'generating'}
            className="flex-1 !p-1"
            aria-label={shot.imageStatus === 'generating' ? "Generating New Mock Image" : "Generate New Mock Image"}
          >
            {shot.imageStatus === 'generating' ? 
              <ArrowPathIcon className="w-3.5 h-3.5 animate-spin"/> : 
              <PhotoIcon className="w-3.5 h-3.5"/>
            }
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleVideoGeneration(shot, segmentId, isTrailer)}
            disabled={!shot.generatedImageUrl || shot.videoStatus === 'generating' || shot.imageStatus === 'generating'}
            className="flex-1 !p-1"
            aria-label={shot.videoStatus === 'generating' ? "Generating Mock Video" : "Generate Mock Video"}
          >
            {shot.videoStatus === 'generating' ? 
              <ArrowPathIcon className="w-3.5 h-3.5 animate-spin"/> : 
              <ClapperBoardIcon className="w-3.5 h-3.5"/>
            }
          </Button>
        </div>
      </Card>
    );
  };

  const renderSegment = (title: string, shots: ShotData[], segmentId: string, isTrailer: boolean = false, segmentPacing?: PacingOptionValue, sceneInfo?: { settingLokasi?: string; settingWaktu?: string; deskripsiUmumScene?: string; sceneDirectorNotes?: string; }) => {
    const isExpanded = expandedSegments[segmentId] !== undefined ? expandedSegments[segmentId] : true;
    const segmentIcon = isTrailer 
        ? <TrailerIcon className="w-7 h-7 mr-3 text-brand-teal" /> 
        : <Squares2X2Icon className="w-7 h-7 mr-3 text-brand-teal" />;
    const segmentPacingLabel = segmentPacing ? PACING_OPTIONS.find(p => p.value === segmentPacing)?.label : '';

    return (
      <div key={segmentId} className="mb-8">
        <Card className="mb-5 p-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors" onClick={() => toggleSegmentExpansion(segmentId)}>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {segmentIcon}
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                {title}
                <span className="text-base font-normal text-neutral-500 dark:text-neutral-400 ml-3">({shots.length} shots{segmentPacingLabel && `, Pacing: ${segmentPacingLabel}`})</span>
              </h3>
            </div>
            {isExpanded ? <ChevronUpIcon className="w-7 h-7 text-neutral-500 dark:text-neutral-400" /> : <ChevronDownIcon className="w-7 h-7 text-neutral-500 dark:text-neutral-400" />}
          </div>
           {sceneInfo && isExpanded && (
                <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700 text-sm text-neutral-600 dark:text-neutral-400 space-y-1.5">
                    {sceneInfo.settingLokasi && <p><strong>Location:</strong> {sceneInfo.settingLokasi}</p>}
                    {sceneInfo.settingWaktu && <p><strong>Time:</strong> {sceneInfo.settingWaktu}</p>}
                    {sceneInfo.deskripsiUmumScene && <p><strong>Scene Overview:</strong> {sceneInfo.deskripsiUmumScene}</p>}
                    {sceneInfo.sceneDirectorNotes && <p><strong>Director Notes:</strong> {sceneInfo.sceneDirectorNotes}</p>}
                </div>
            )}
        </Card>
        {isExpanded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {shots.map(shot => renderShotCard(shot, segmentId, isTrailer))}
          </div>
        )}
      </div>
    );
  };

  if (!storyboardPreview) {
    return (
      <div className="p-6 md:p-8 text-neutral-900 dark:text-neutral-100 min-h-full bg-neutral-100 dark:bg-brand-bg-dark flex flex-col items-center justify-center">
        <ArrowPathIcon className="w-16 h-16 text-brand-teal animate-spin mb-6" />
        <p className="text-xl text-neutral-600 dark:text-neutral-400">Loading storyboard preview...</p>
      </div>
    );
  }

  const { formData, trailer, scenes, totalScenes, totalShots, projectAspectRatio } = storyboardPreview;
  
  const mediaUrlForPreviewModal = currentMediaInPreview === 'image' 
      ? previewingShot?.generatedImageUrl 
      : previewingShot?.generatedVideoUrl;

  const showPrevMediaButton = currentMediaInPreview === 'video' && previewingShot?.generatedImageUrl;
  const showNextMediaButton = currentMediaInPreview === 'image' && previewingShot?.generatedVideoUrl;


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
        
        {isMediaPreviewModalOpen && previewingShot && mediaUrlForPreviewModal && (
            <div 
                className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4" 
                onClick={closeMediaPreviewModal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="media-preview-title"
            >
                <Card className="w-full max-w-4xl max-h-[90vh] p-1 bg-brand-bg-card shadow-2xl relative flex flex-col" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between p-2 absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent rounded-t-lg">
                        <div className="flex items-center space-x-2">
                           <Button
                                variant="ghost"
                                size="sm"
                                className="!p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full"
                                onClick={handleDownloadMedia}
                                aria-label="Download media"
                            >
                                <ArrowDownTrayIcon className="w-5 h-5" />
                            </Button>
                             <Button
                                variant="ghost"
                                size="sm"
                                className="!p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full"
                                onClick={() => {
                                    if(previewingShot) {
                                        const segmentIdForEdit = storyboardPreview?.trailer?.shots.find(s=>s.id === previewingShot.id) 
                                            ? storyboardPreview.trailer.id 
                                            : storyboardPreview?.scenes.find(sc => sc.shots.some(s=>s.id === previewingShot.id))?.id;
                                        const isTrailerForEdit = storyboardPreview?.trailer?.shots.find(s=>s.id === previewingShot.id) ? true : false;
                                        
                                        if (segmentIdForEdit !== undefined) {
                                            handleEditShot(previewingShot, segmentIdForEdit, isTrailerForEdit);
                                            closeMediaPreviewModal(); 
                                        } else {
                                            setToastInfo({show: true, message:"Could not determine segment for editing.", type:"error"});
                                        }
                                    }
                                }}
                                aria-label="Edit shot"
                            >
                                <PencilSquareIcon className="w-5 h-5" />
                            </Button>
                        </div>
                        <h4 id="media-preview-title" className="text-sm text-white/90 font-semibold absolute left-1/2 transform -translate-x-1/2">
                            Shot {previewingShot.fullShotIdentifier} - {currentMediaInPreview === 'image' ? 'Image' : 'Video'} Preview
                        </h4>
                        <Button 
                            variant="ghost"
                            size="sm"
                            onClick={closeMediaPreviewModal} 
                            className="!p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full"
                            aria-label="Close media preview"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="flex-grow flex items-center justify-center relative w-full h-full min-h-[200px] mt-10 mb-10 overflow-hidden">
                        {currentMediaInPreview === 'image' && previewingShot.generatedImageUrl && (
                            <img src={previewingShot.generatedImageUrl} alt={`Preview for shot ${previewingShot.fullShotIdentifier}`} className="max-w-full max-h-[calc(90vh-100px)] object-contain rounded"/>
                        )}
                        {currentMediaInPreview === 'video' && previewingShot.generatedVideoUrl && (
                            <video src={previewingShot.generatedVideoUrl} controls autoPlay className="max-w-full max-h-[calc(90vh-100px)] object-contain rounded" onError={() => setToastInfo({show:true, message: "Error loading video.", type:"error"})}>
                                Your browser does not support the video tag.
                            </video>
                        )}
                    </div>
                     {(showPrevMediaButton || showNextMediaButton) && (
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 p-1 bg-black/40 rounded-full z-20">
                            {showPrevMediaButton && (
                                <Button variant="ghost" size="sm" onClick={switchPreviewMediaInModal} className="!p-1.5 text-white hover:bg-white/20 rounded-full" aria-label="Previous media (Image)">
                                    <ArrowLeftIcon className="w-5 h-5" />
                                </Button>
                            )}
                             <span className="text-xs text-white/80 select-none">
                                {previewingShot.generatedImageUrl && previewingShot.generatedVideoUrl 
                                    ? (currentMediaInPreview === 'image' ? '1/2' : '2/2') 
                                    : ''}
                            </span>
                            {showNextMediaButton && (
                                <Button variant="ghost" size="sm" onClick={switchPreviewMediaInModal} className="!p-1.5 text-white hover:bg-white/20 rounded-full" aria-label="Next media (Video)">
                                    <ArrowRightIcon className="w-5 h-5" />
                                </Button>
                            )}
                        </div>
                    )}
                </Card>
            </div>
        )}

        {isShotDetailModalOpen && editingShot && (
           <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
              <Card className="w-full max-w-3xl bg-white dark:bg-brand-bg-card max-h-[95vh] flex flex-col">
                  <div className="flex justify-between items-center p-5 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 bg-inherit z-10">
                      <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">Edit Shot {editingShot.fullShotIdentifier} Details</h3>
                      <button onClick={() => setIsShotDetailModalOpen(false)} className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white">
                          <XMarkIcon className="w-7 h-7" />
                      </button>
                  </div>
                  <div className="p-5 space-y-5 overflow-y-auto flex-grow">
                      <Select 
                        label="Narrative Purpose" 
                        id={`edit-narrativePurpose-${editingShot.id}`} 
                        options={NARRATIVE_PURPOSE_OPTIONS.map(opt => ({label: opt, value: opt}))}
                        value={currentEditingShotData.narrativePurpose} 
                        onChange={(e) => handleShotDetailChange('narrativePurpose', e.target.value as NarrativePurposeOptionValue)}
                        placeholder="Select Narrative Purpose"
                      />
                      <Input 
                        label="Description Narrative (Visuals)" 
                        id={`edit-descriptionNarrative-${editingShot.id}`}
                        value={currentEditingShotData.imagePromptInput?.description_narrative}
                        onChange={(e) => handleShotDetailChange('imagePromptInput.description_narrative', e.target.value)}
                        placeholder="Describe the key visual elements..."
                        className="text-sm"
                      />
                       {currentEditingShotData.imagePromptInput?.subject_details?.map((subject, index) => (
                            <div key={`subj-${index}`} className="p-3 border rounded-md bg-neutral-50 dark:bg-neutral-800 space-y-2">
                                <h5 className="text-sm font-medium">Subject {index + 1}: {subject.identifier}</h5>
                                <Input label="Expression / Mood" id={`edit-subj-expr-${index}`} value={subject.expression_mood || ''} onChange={e => handleShotDetailChange(`imagePromptInput.subject_details[${index}].expression_mood`, e.target.value)} placeholder="e.g., Surprised, calm" />
                                <Input label="Key Features Override" id={`edit-subj-kfo-${index}`} value={subject.key_features_override || ''} onChange={e => handleShotDetailChange(`imagePromptInput.subject_details[${index}].key_features_override`, e.target.value)} placeholder="e.g., Has a scar" />
                                <Input label="Clothing Override" id={`edit-subj-co-${index}`} value={subject.clothing_override || ''} onChange={e => handleShotDetailChange(`imagePromptInput.subject_details[${index}].clothing_override`, e.target.value)} placeholder="e.g., Wears a red hat" />
                            </div>
                        ))}

                      <Input 
                        label="User Video Motion Prompt (Veo 3)" 
                        id={`edit-userVideoMotionPrompt-${editingShot.id}`} 
                        value={currentEditingShotData.videoPromptInput?.user_video_motion_prompt}
                        onChange={(e) => handleShotDetailChange('videoPromptInput.user_video_motion_prompt', e.target.value)}
                        placeholder="Describe video motion, e.g., 'Slow zoom in on character's face'"
                        className="text-sm"
                      />
                      <Select 
                        label="Shot Type" 
                        id={`edit-tipeShotKamera-${editingShot.id}`} 
                        options={TIPE_SHOT_KAMERA_OPTIONS.map(opt => ({label: opt, value: opt}))} // Assuming TIPE_SHOT_KAMERA_OPTIONS is already English
                        value={currentEditingShotData.tipeShotKamera} 
                        onChange={(e) => handleShotDetailChange('tipeShotKamera', e.target.value)}
                        placeholder="Select Shot Type"
                      />
                       <Select 
                        label="Camera Angle" 
                        id={`edit-angleKamera-${editingShot.id}`} 
                        options={CAMERA_ANGLE_OPTIONS.map(opt => ({label: opt, value: opt}))}
                        value={currentEditingShotData.angleKamera} 
                        onChange={(e) => handleShotDetailChange('angleKamera', e.target.value)}
                        placeholder="Select Camera Angle"
                      />
                       <Select 
                        label="Camera Movement (Veo 3)" 
                        id={`edit-cameraMovement-${editingShot.id}`} 
                        options={CAMERA_MOVEMENT_OPTIONS.map(opt => ({label: opt, value: opt}))}
                        value={currentEditingShotData.cameraMovement} 
                        onChange={(e) => handleShotDetailChange('cameraMovement', e.target.value)}
                        placeholder="Select Camera Movement"
                      />
                       <Textarea 
                        label="Director's Notes (Camera)" 
                        id={`edit-catatanSutradaraKamera-${editingShot.id}`} 
                        value={currentEditingShotData.catatanSutradaraKamera}
                        onChange={(e) => handleShotDetailChange('catatanSutradaraKamera', e.target.value)}
                        placeholder="Specific instructions for camera or mood for this shot."
                        rows={2}
                        className="text-sm"
                      />
                      <Textarea 
                        label="Voiceover / Dialogue" 
                        id={`edit-voiceover-${editingShot.id}`} 
                        value={currentEditingShotData.pengaturanAudioShot?.voiceover}
                        onChange={(e) => handleShotDetailChange('pengaturanAudioShot.voiceover', e.target.value)}
                        placeholder="Enter dialogue or voiceover text..."
                        rows={2}
                        className="text-sm"
                      />
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-100 mb-1">Sound Effects (comma-separated)</label>
                            <Input 
                                id={`edit-sfx-${editingShot.id}`}
                                value={(currentEditingShotData.pengaturanAudioShot?.sfx || []).join(', ')}
                                onChange={(e) => handleShotDetailChange('pengaturanAudioShot.sfx', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                                placeholder="e.g., footstep, door creak"
                                className="text-sm"
                            />
                        </div>
                        <Textarea 
                            label="Music Score Description" 
                            id={`edit-musicScore-${editingShot.id}`} 
                            value={currentEditingShotData.pengaturanAudioShot?.music_score_description}
                            onChange={(e) => handleShotDetailChange('pengaturanAudioShot.music_score_description', e.target.value)}
                            placeholder="Describe the desired music (e.g., tense orchestral, gentle piano)"
                            rows={2}
                            className="text-sm"
                        />
                        {renderPromptDisplaySection(editingShot)}
                  </div>
                  <div className="p-5 border-t border-neutral-200 dark:border-neutral-700 flex justify-end space-x-3 sticky bottom-0 bg-inherit z-10">
                      <Button variant="secondary" onClick={() => setIsShotDetailModalOpen(false)} size="lg">Cancel</Button>
                      <Button variant="primary" onClick={handleSaveShotDetails} size="lg">Save Changes</Button>
                  </div>
              </Card>
            </div>
        )}

      <div className="mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white truncate max-w-xl mb-2 sm:mb-0" title={formData.projectTitle}>
                {formData.projectTitle}
            </h1>
            <div className="flex space-x-3 self-start sm:self-center">
                <Button variant="outline" size="md" onClick={() => navigate('/generate', { state: { formData: storyboardPreview.formData, source: 'previewNavigation' }})} leftIcon={<ArrowUturnLeftIcon />}>
                    Edit Form
                </Button>
                <Button variant="primary" size="md" onClick={handleSaveToMyProjects} leftIcon={<ArrowDownTrayIcon />}>
                    Save to Projects
                </Button>
            </div>
        </div>
        <p className="text-base text-neutral-600 dark:text-neutral-400 line-clamp-3"><strong>Project Storyline:</strong> {formData.description}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-neutral-500 dark:text-neutral-400">
          <span><strong>Genre:</strong> {formData.genre === 'Other' ? formData.customGenre : formData.genre}</span>
          <span><strong>Visual Style:</strong> {formData.visualStyle === 'Other' ? formData.customVisualStyle : formData.visualStyle}</span>
          <span><strong>Tone:</strong> {formData.narrativeTone}</span>
          <span><strong>Total Duration:</strong> {TOTAL_DURATION_OPTIONS.find(opt => opt.value === formData.totalDuration)?.label || `${formData.totalDuration}s`}</span>
          <span><strong>Aspect Ratio:</strong> {projectAspectRatio}</span>
        </div>
      </div>

      {trailer && renderSegment(trailer.title, trailer.shots, trailer.id, true, trailer.pacing)}
      {scenes.map((scene) => renderSegment(`Scene ${scene.sceneNumber}: ${scene.title || 'Untitled Scene'}`, scene.shots, scene.id, false, scene.pacing, scene))}
    </div>
  );
};

export default PreviewStoryboardPage;
