
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import {
    PlayCircleIcon, VideoCameraIcon, CogIcon, UserCircleIcon, MagnifyingGlassIcon,
    PencilSquareIcon, Squares2X2Icon, LightBulbIcon, ArrowDownTrayIcon, TagIcon,
    ChatBubbleLeftEllipsisIcon, CheckCircleIcon, FolderIcon,
    AdjustmentsHorizontalIcon, CpuChipIcon, FilmIcon, RocketLaunchIcon, PaintBrushIcon, SparklesIcon, UsersIcon, BriefcaseIcon, AcademicCapIcon, ShoppingBagIcon, StarIcon, ShieldCheckIcon
} from '../components/icons'; // Added more icons

// Simple SVG Icon components (can be moved to icons/index.tsx later if reused)
const TextIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
    </svg>
);

const AiMagicIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 2.47a.75.75 0 010 1.06L7.352 5.708l2.178-2.178a.75.75 0 011.06 0L12.75 5.707l2.178-2.178a.75.75 0 111.06 1.06L13.812 7.35l2.178 2.178a.75.75 0 010 1.06L13.812 12.75l2.178 2.178a.75.75 0 11-1.06 1.06L12.75 13.812l-2.178 2.178a.75.75 0 01-1.06 0L7.352 13.812l-2.178 2.178a.75.75 0 01-1.06-1.06L6.292 10.58l-2.178-2.178a.75.75 0 010-1.06L6.292 5.172 4.114 2.994a.75.75 0 011.06-1.06L7.352 4.112l2.178-2.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a8.966 8.966 0 006.188-2.612M12 21a8.966 8.966 0 01-6.188-2.612M12 3a8.966 8.966 0 00-6.188 2.612M12 3a8.966 8.966 0 016.188 2.612" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.375c0 .964-.208 1.896-.583 2.731M6.75 9.375c0 .964.208 1.896.583 2.731" />
    </svg>
);


const HeroImageMock: React.FC = () => (
    <div className="mt-16 lg:mt-0 lg:ml-12 w-full max-w-2xl mx-auto lg:mx-0 lg:max-w-[700px] flex-shrink-0 relative">
        <div className="w-full bg-neutral-800/70 backdrop-blur-md rounded-xl shadow-2xl p-3 sm:p-4 border border-neutral-700/50 flex flex-col aspect-[16/10] overflow-hidden">
            {/* Top bar */}
            <div className="flex justify-between items-center mb-2 sm:mb-3 px-1 sm:px-2">
                <div className="flex space-x-1.5 sm:space-x-2">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></span>
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-400 rounded-full"></span>
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full"></span>
                </div>
                <div className="text-2xs sm:text-xs text-neutral-400 bg-neutral-700/50 px-2 py-0.5 rounded-sm">Project: Galactic Odyssey</div>
                 <Button variant="primary" size="sm" className="!text-xs !py-1 !px-2.5 hidden sm:flex">
                    Generate
                </Button>
            </div>
            {/* Main content area */}
            <div className="flex-grow bg-neutral-900/80 rounded-md p-2 sm:p-3 flex space-x-2 sm:space-x-3">
                {/* Sidebar Mock */}
                <div className="w-1/4 bg-neutral-800/60 rounded-md p-1.5 sm:p-2 space-y-1.5 sm:space-y-2">
                    {(['Scene 1', 'Characters', 'Visual Style', 'Music', 'Export'] as const).map((item, index) => (
                         <div key={item} className={`h-4 sm:h-5 w-full rounded-sm ${index === 0 ? 'bg-brand-teal/70' : 'bg-neutral-700/70'}`}>
                            <p className="text-2xs sm:text-xs text-neutral-300/80 pl-1 truncate hidden sm:block">{item}</p>
                         </div>
                    ))}
                     <div className="h-4 sm:h-5 w-full rounded-sm bg-neutral-700/70 mt-auto opacity-50"></div>
                     <div className="h-4 sm:h-5 w-full rounded-sm bg-neutral-700/70 opacity-50"></div>
                </div>
                {/* Panel Area Mock */}
                <div className="w-3/4 bg-neutral-800/60 rounded-md p-1.5 sm:p-2 flex flex-col">
                     <div className="h-5 sm:h-6 w-2/3 rounded-sm bg-neutral-700/70 mb-1.5 sm:mb-2"></div>
                     <div className="grid grid-cols-2 grid-rows-2 gap-1.5 sm:gap-2 flex-grow">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="bg-neutral-700/70 rounded-sm flex items-center justify-center">
                               <FilmIcon className="w-4 h-4 sm:w-6 sm:h-6 text-neutral-600/80"/>
                            </div>
                        ))}
                     </div>
                </div>
            </div>

            {/* Floating elements from reference image */}
            <div className="absolute -top-10 -left-12 w-32 h-32 bg-brand-teal/10 rounded-full blur-2xl animate-pulse-slow z-0"></div>
            <div className="absolute -bottom-12 -right-16 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl animate-pulse-slower z-0"></div>
            
            <Card className="absolute -bottom-5 -left-8 sm:-bottom-8 sm:-left-16 w-36 sm:w-48 bg-neutral-700/80 backdrop-blur-sm p-2 sm:p-3 shadow-xl border border-neutral-600/70 z-20 transform -rotate-3">
                <div className="flex items-center mb-1">
                    <PencilSquareIcon className="w-3 h-3 sm:w-4 sm:h-4 text-brand-teal mr-1.5 sm:mr-2"/>
                    <p className="text-2xs sm:text-xs font-semibold text-white">Shot Details</p>
                </div>
                <p className="text-[0.6rem] sm:text-2xs text-neutral-300">ECU on pilot's eyes. Intense focus. Ship rattles.</p>
            </Card>
            <Card className="absolute -top-8 -right-5 sm:-top-12 sm:-right-10 w-32 sm:w-40 bg-neutral-700/80 backdrop-blur-sm p-2 sm:p-3 shadow-xl border border-neutral-600/70 z-20 transform rotate-2">
                 <div className="flex items-center mb-1">
                    <LightBulbIcon className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mr-1.5 sm:mr-2"/>
                    <p className="text-2xs sm:text-xs font-semibold text-white">AI Assist</p>
                </div>
                <p className="text-[0.6rem] sm:text-2xs text-neutral-300">"Add lens flare for dramatic effect?"</p>
            </Card>
        </div>
    </div>
);

interface FeatureHighlightCardProps {
  icon: React.ReactElement<{ className?: string }>;
  title: string;
  description: string;
}
const FeatureHighlightCard: React.FC<FeatureHighlightCardProps> = ({ icon, title, description }) => (
    <Card className="bg-brand-bg-card border-neutral-700/50 p-6 text-center hover:shadow-brand-teal/20 hover:shadow-lg transition-shadow duration-300">
        {React.cloneElement(icon, { className: "w-10 h-10 text-brand-teal mx-auto mb-5" })}
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-neutral-400 text-sm leading-relaxed">{description}</p>
    </Card>
);

interface CinematicStyleCardProps {
    imageSrc: string; // Placeholder for now
    title: string;
    description: string;
}
const CinematicStyleCard: React.FC<CinematicStyleCardProps> = ({ imageSrc, title, description }) => (
    <div className="group relative rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-brand-teal/30">
        <div className={`aspect-[4/3] bg-neutral-700 flex items-center justify-center text-brand-teal`}>
            { /* Replace with actual image later if needed */ }
            { title === "Cinematic Stockholm" && <FilmIcon className="w-20 h-20 opacity-50"/> }
            { title === "Sci-Fi" && <RocketLaunchIcon className="w-20 h-20 opacity-50"/> }
            { title === "Romantic" && <PaintBrushIcon className="w-20 h-20 opacity-50"/> }
            { title === "Documentary Style" && <Squares2X2Icon className="w-20 h-20 opacity-50"/> }
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <h3 className="text-xl font-semibold mb-1">{title}</h3>
            <p className="text-sm text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-h-0 group-hover:max-h-20 overflow-hidden">{description}</p>
        </div>
    </div>
);


interface HowItWorksStepProps {
    icon: React.ReactElement<{ className?: string }>;
    stepNumber: string;
    title: string;
    description: string;
}
const HowItWorksStep: React.FC<HowItWorksStepProps> = ({ icon, stepNumber, title, description }) => (
    <div className="relative pl-12">
        <div className="absolute left-0 top-0 flex items-center justify-center w-10 h-10 rounded-full bg-brand-teal text-black font-bold text-lg">
            {stepNumber}
        </div>
        {React.cloneElement(icon, { className: "absolute left-2.5 top-11 w-5 h-5 text-brand-teal opacity-50" })}
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-neutral-400 leading-relaxed">{description}</p>
    </div>
);

const TimelineEditorMock: React.FC = () => (
    <div className="relative mt-12 w-full max-w-4xl mx-auto">
        <Card className="bg-neutral-800/70 backdrop-blur-md p-3 sm:p-4 border border-neutral-700/50 shadow-2xl aspect-[16/9]">
            <div className="flex justify-between items-center mb-2 px-1">
                <div className="flex space-x-1.5">
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                    <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></span>
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                </div>
                <p className="text-xs text-neutral-400">Timeline Editor: The Final Battle</p>
                <div className="space-x-1">
                    <Button variant="secondary" size="sm" className="!text-2xs !px-1.5 !py-0.5 opacity-80">Zoom In</Button>
                    <Button variant="secondary" size="sm" className="!text-2xs !px-1.5 !py-0.5 opacity-80">Zoom Out</Button>
                </div>
            </div>
            <div className="bg-neutral-900/80 rounded-md p-2 flex-grow h-[calc(100%-2rem)]">
                {/* Tracks */}
                {[...Array(3)].map((_, trackIndex) => (
                    <div key={trackIndex} className={`flex items-center space-x-1 h-1/3 ${trackIndex < 2 ? 'mb-1' : ''}`}>
                        <div className="w-16 text-2xs text-neutral-500 pr-1 text-right truncate">Track {trackIndex+1}</div>
                        {[...Array(5)].map((_, clipIndex) => (
                            <div key={clipIndex}
                                className={`h-full rounded-sm flex-grow 
                                ${ (trackIndex === 0 && (clipIndex === 0 || clipIndex === 1)) ? 'bg-brand-teal/60' 
                                : (trackIndex === 1 && (clipIndex === 1 || clipIndex === 2 || clipIndex === 3)) ? 'bg-purple-500/60' 
                                : (trackIndex === 2 && (clipIndex === 3 || clipIndex === 4)) ? 'bg-sky-500/60' 
                                : 'bg-neutral-700/60' } `}
                                style={{flexBasis: `${Math.random()*20 + 10}%`}} // Random widths
                            ></div>
                        ))}
                    </div>
                ))}
            </div>
        </Card>
         <div className="absolute -bottom-8 -left-10 w-24 h-24 bg-brand-teal/5 rounded-full blur-xl animate-pulse-slowest"></div>
         <div className="absolute -top-10 -right-12 w-28 h-28 bg-rose-500/5 rounded-full blur-2xl animate-pulse-slow"></div>
    </div>
);

interface PricingPlanCardProps {
    planName: string;
    price: string;
    priceDetails?: string;
    features: string[];
    isPopular?: boolean;
    buttonText: string;
    onButtonClick: () => void;
    contactSales?: boolean;
}
const PricingPlanCard: React.FC<PricingPlanCardProps> = ({ planName, price, priceDetails, features, isPopular, buttonText, onButtonClick, contactSales }) => (
    <Card className={`flex flex-col p-8 rounded-xl border-2 transition-all duration-300
        ${isPopular ? 'bg-brand-teal/5 border-brand-teal shadow-2xl shadow-brand-teal/20' : 'bg-brand-bg-card border-neutral-700/80 hover:border-brand-teal/50'}`}>
        {isPopular && (
            <div className="absolute top-0 right-8 -mt-3 bg-brand-teal text-black text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                POPULAR
            </div>
        )}
        <h3 className={`text-2xl font-semibold mb-2 ${isPopular ? 'text-brand-teal' : 'text-white'}`}>{planName}</h3>
        <p className="text-4xl font-bold text-white mb-1">{price}</p>
        <p className="text-sm text-neutral-400 mb-6 h-5">{priceDetails || ""}</p>
        
        <ul className="space-y-3 mb-8 text-neutral-300 flex-grow">
            {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                    <CheckCircleIcon className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${isPopular ? 'text-brand-teal' : 'text-green-500'}`} />
                    <span>{feature}</span>
                </li>
            ))}
        </ul>
        
        <Button 
            variant={isPopular ? 'primary' : 'outline'} 
            size="lg" 
            className="w-full !py-3"
            onClick={onButtonClick}
        >
            {buttonText}
        </Button>
        {contactSales && (
            <p className="text-center mt-3">
                 <a href="#" className="text-sm text-brand-teal hover:underline">Contact Sales</a>
            </p>
        )}
    </Card>
);

interface CreatorTypeCardProps {
    icon: React.ReactElement<{ className?: string }>;
    title: string;
    description: string;
}
const CreatorTypeCard: React.FC<CreatorTypeCardProps> = ({ icon, title, description }) => (
    <div className="bg-neutral-800/50 p-6 rounded-lg text-center backdrop-blur-sm border border-neutral-700/60 hover:border-brand-teal/40 transition-colors duration-300">
        {React.cloneElement(icon, { className: "w-10 h-10 text-brand-teal mx-auto mb-4" })}
        <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
        <p className="text-sm text-neutral-400">{description}</p>
    </div>
);


const LandingPage: React.FC = () => {
    return (
        <div className="bg-brand-dark text-neutral-200 antialiased overflow-x-hidden">
            {/* Header */}
            <header className="py-6 px-4 sm:px-8 md:px-12 sticky top-0 z-50 bg-brand-dark/80 backdrop-blur-lg border-b border-neutral-800/50">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="bg-brand-teal text-black font-bold text-2xl px-2.5 py-1 rounded">N</span>
                        <span className="text-2xl font-semibold text-white">nufa.studio</span>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-8">
                        {['Features', 'Pricing', 'How It Works'].map(item => (
                            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-neutral-300 hover:text-brand-teal transition-colors">
                                {item}
                            </a>
                        ))}
                    </nav>
                    <div className="flex items-center space-x-3">
                        <Link to="/signin">
                            <Button variant="ghost" size="md">Log In</Button>
                        </Link>
                        <Link to="/signup">
                            <Button variant="primary" size="md">Sign Up</Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-20 md:py-32 px-4 sm:px-8 relative overflow-hidden">
                <div className="container mx-auto flex flex-col lg:flex-row items-center">
                    <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0 z-10">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                            AI-Powered Storyboarding. <span className="text-brand-teal">Visualize Your Vision.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-neutral-300 mb-10 max-w-2xl mx-auto lg:mx-0">
                            Nufa Studio empowers creators to transform ideas into stunning cinematic storyboards and video concepts with intuitive AI tools, seamless workflow, and unparalleled creative control.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                            <Link to="/signup">
                                <Button variant="primary" size="lg" className="w-full sm:w-auto !text-lg !py-3.5">Start Creating Now</Button>
                            </Link>
                            <a href="#features">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto !text-lg !py-3.5">Explore Features</Button>
                            </a>
                        </div>
                    </div>
                    <HeroImageMock />
                </div>
                {/* Background decorative elements */}
                <div className="absolute -top-20 -right-40 w-96 h-96 bg-brand-teal/5 rounded-full blur-3xl opacity-70 animate-pulse-slow"></div>
                <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl opacity-60 animate-pulse-slower"></div>
            </section>

             {/* Features Section */}
            <section id="features" className="py-16 md:py-24 px-4 sm:px-8 bg-brand-bg-dark">
                <div className="container mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Powerful AI Video Creation Tools</h2>
                    <p className="text-lg text-neutral-400 mb-16 max-w-3xl mx-auto">
                        From initial concept to final storyboard, Nufa Studio provides everything you need to bring your creative vision to life with unprecedented speed and precision.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: <ChatBubbleLeftEllipsisIcon />, title: "AI Storyline Generation", description: "Kickstart your project with AI-generated storylines, loglines, and synopses based on your genre and keywords." },
                            { icon: <PencilSquareIcon />, title: "Intelligent Prompt Crafting", description: "Our AI helps you refine descriptions and prompts for characters, scenes, and shots, ensuring optimal visual output." },
                            { icon: <Squares2X2Icon />, title: "Dynamic Storyboard Management", description: "Easily organize scenes, shots, and iterations. Adjust pacing, duration, and visual details on the fly." },
                            { icon: <UsersIcon />, title: "Character & Asset Consistency", description: "Maintain visual consistency for characters and key elements across your entire storyboard." },
                            { icon: <ArrowDownTrayIcon />, title: "Multi-Format Export", description: "Export your storyboards as PDF, image sequences, or video animatics ready for presentations or pre-production." },
                            { icon: <AdjustmentsHorizontalIcon />, title: "Customizable Workflows", description: "Tailor the platform to your needs, from detailed shot-by-shot control to rapid ideation modes." }
                        ].map((feature, index) => (
                            <FeatureHighlightCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Cinematic Styles Showcase */}
            <section id="cinematic-styles" className="py-16 md:py-24 px-4 sm:px-8">
                <div className="container mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Choose Your Cinematic Style</h2>
                    <p className="text-lg text-neutral-400 mb-16 max-w-3xl mx-auto">
                        Select from a vast library of visual styles or define your own unique aesthetic. Nufa Studio adapts to your creative direction.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { imageSrc: "placeholder_stockholm.jpg", title: "Cinematic Stockholm", description: "Moody, atmospheric, inspired by Nordic noir." },
                            { imageSrc: "placeholder_scifi.jpg", title: "Sci-Fi", description: "Futuristic landscapes, sleek designs, and otherworldly visuals." },
                            { imageSrc: "placeholder_romantic.jpg", title: "Romantic", description: "Soft lighting, emotional depth, and picturesque settings." },
                            { imageSrc: "placeholder_documentary.jpg", title: "Documentary Style", description: "Realistic, grounded, and focused on authentic storytelling." },
                        ].map((style, index) => (
                           <CinematicStyleCard key={index} imageSrc={style.imageSrc} title={style.title} description={style.description}/>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* How It Works Section */}
            <section id="how-it-works" className="py-16 md:py-24 px-4 sm:px-8 bg-brand-bg-dark">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How Nufa Studio Works</h2>
                        <p className="text-lg text-neutral-400 max-w-3xl mx-auto">
                            A streamlined process designed for speed and creativity, from your first spark of an idea to a fully visualized concept.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {[
                            { icon: <TextIcon />, stepNumber: "1", title: "Input Your Idea", description: "Start with a simple text prompt, a detailed script, or even just a genre and some keywords." },
                            { icon: <AiMagicIcon />, stepNumber: "2", title: "AI-Assisted Generation", description: "Our AI generates storylines, character concepts, scene breakdowns, and initial shot visuals based on your input." },
                            { icon: <PencilSquareIcon />, stepNumber: "3", title: "Refine & Visualize", description: "Iterate on AI suggestions. Customize every detail, from camera angles and lighting to character expressions and scene pacing." },
                            { icon: <ArrowDownTrayIcon />, stepNumber: "4", title: "Export & Share", description: "Generate polished storyboards, animatics, or presentations to share with your team or clients." }
                        ].map((step, index) => (
                             <HowItWorksStep key={index} icon={React.cloneElement(step.icon, {className: "w-6 h-6 text-brand-teal"})} stepNumber={step.stepNumber} title={step.title} description={step.description}/>
                        ))}
                    </div>
                </div>
            </section>

            {/* Powerful Timeline Editor Section */}
            <section className="py-16 md:py-24 px-4 sm:px-8">
                <div className="container mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Powerful Timeline Editor</h2>
                    <p className="text-lg text-neutral-400 mb-8 max-w-3xl mx-auto">
                        Gain granular control over your project with an intuitive timeline. Adjust shot durations, reorder scenes, manage audio tracks, and preview your animatic in real-time.
                    </p>
                    <TimelineEditorMock />
                </div>
            </section>


             {/* Pricing Section */}
            <section id="pricing" className="py-16 md:py-24 px-4 sm:px-8 bg-brand-bg-dark">
                <div className="container mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Choose Your Perfect Plan</h2>
                    <p className="text-lg text-neutral-400 mb-16 max-w-3xl mx-auto">
                        Flexible plans designed for every creator, from hobbyists to professional studios. Start for free and scale as you grow.
                    </p>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <PricingPlanCard
                            planName="Free"
                            price="$0"
                            priceDetails="per month"
                            features={["Up to 3 projects", "Basic AI generation tools", "Limited visual styles", "Community support"]}
                            buttonText="Get Started for Free"
                            onButtonClick={() => { /* Navigate to signup */ }}
                        />
                        <PricingPlanCard
                            planName="Pro"
                            price="$29"
                            priceDetails="per month"
                            features={["Unlimited projects", "Advanced AI tools & controls", "Full visual style library", "Higher resolution exports", "Priority email support"]}
                            isPopular={true}
                            buttonText="Choose Pro Plan"
                            onButtonClick={() => { /* Navigate to signup/pro */ }}
                        />
                        <PricingPlanCard
                            planName="Custom / Enterprise"
                            price="Let's Talk"
                            features={["Tailored solutions for teams", "Custom integrations & API access", "Dedicated account manager", "Volume discounts", "Enterprise-grade security"]}
                            buttonText="Contact Sales"
                            onButtonClick={() => { /* Navigate to contact */ }}
                            contactSales={true}
                        />
                    </div>
                    <p className="text-sm text-neutral-500 mt-12">
                        All plans include a risk-free trial period. Prices are subject to change.
                        <Link to="/terms" className="text-brand-teal hover:underline ml-1">Terms apply</Link>.
                    </p>
                </div>
            </section>
            
            {/* Perfect for Every Creator Section */}
            <section className="py-16 md:py-24 px-4 sm:px-8">
                <div className="container mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-16">Perfect for <span className="text-brand-teal">Every</span> Creator</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: <VideoCameraIcon />, title: "Content Creators", description: "Rapidly visualize YouTube videos, TikToks, and social media content before filming." },
                            { icon: <BriefcaseIcon />, title: "Marketing Agencies", description: "Create compelling ad concepts and campaign storyboards for clients with speed and polish." },
                            { icon: <FilmIcon />, title: "Indie Filmmakers", description: "Develop short films, features, and series concepts with professional-grade storyboarding tools." },
                            { icon: <AcademicCapIcon />, title: "Students & Educators", description: "Learn and teach filmmaking principles with an intuitive and accessible storyboarding platform." },
                        ].map((creator, index) => (
                            <CreatorTypeCard key={index} icon={creator.icon} title={creator.title} description={creator.description} />
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Testimonials Section */}
            <section className="py-16 md:py-24 px-4 sm:px-8 bg-brand-bg-dark">
                <div className="container mx-auto text-center max-w-4xl">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-10">What Our Users Say</h2>
                    <Card className="bg-brand-bg-card border-neutral-700/60 p-8 md:p-12 relative">
                        <UserCircleIcon className="w-16 h-16 text-brand-teal mx-auto mb-6 opacity-80" />
                        <p className="text-xl md:text-2xl italic text-neutral-200 leading-relaxed mb-6">
                            "Nufa Studio has revolutionized our pre-production workflow. The AI's ability to quickly generate diverse visual concepts is a game-changer, saving us countless hours."
                        </p>
                        <p className="text-lg font-semibold text-white">- Alex Chen, Director at Nova Spark Pictures</p>
                        <div className="absolute top-4 left-4 text-6xl text-brand-teal/20 opacity-50 font-serif">“</div>
                        <div className="absolute bottom-4 right-4 text-6xl text-brand-teal/20 opacity-50 font-serif">”</div>
                    </Card>
                </div>
            </section>
            
            {/* Final CTA Section */}
            <section className="py-20 md:py-32 px-4 sm:px-8 text-center bg-gradient-to-br from-brand-teal/10 via-brand-dark to-purple-600/10">
                <div className="container mx-auto">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Ready to Create Cinematic Videos With AI?</h2>
                    <p className="text-lg md:text-xl text-neutral-300 mb-10 max-w-2xl mx-auto">
                        Join thousands of creators who are already transforming their ideas into reality. Start your free trial today and experience the future of video creation.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-6 sm:space-y-0 sm:space-x-8 mb-12">
                        <div className="text-center">
                            <p className="text-4xl font-bold text-brand-teal">11M+</p>
                            <p className="text-neutral-400">Visuals Generated</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold text-brand-teal">25K+</p>
                            <p className="text-neutral-400">Active Creators</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold text-brand-teal">4.9/5</p>
                            <p className="text-neutral-400">User Rating</p>
                        </div>
                    </div>
                    <Link to="/signup">
                         <Button variant="primary" size="lg" className="!text-xl !py-4 px-10 shadow-lg shadow-brand-teal/30 transform hover:scale-105 transition-transform">
                            Start Your Free Trial
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 px-4 sm:px-8 bg-black border-t border-neutral-800">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                        <div>
                            <Link to="/" className="flex items-center space-x-2 mb-4">
                                <span className="bg-brand-teal text-black font-bold text-xl px-2 py-0.5 rounded">N</span>
                                <span className="text-xl font-semibold text-white">nufa.studio</span>
                            </Link>
                            <p className="text-sm text-neutral-400">AI-powered storyboarding and video creation for the modern creator.</p>
                        </div>
                        <div>
                            <h5 className="text-lg font-semibold text-white mb-4">Product</h5>
                            <ul className="space-y-2">
                                {['Features', 'Pricing', 'Updates', 'API'].map(item => (
                                    <li key={item}><a href="#" className="text-sm text-neutral-400 hover:text-brand-teal">{item}</a></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h5 className="text-lg font-semibold text-white mb-4">Resources</h5>
                            <ul className="space-y-2">
                                {['Documentation', 'Tutorials', 'Blog', 'Community'].map(item => (
                                    <li key={item}><a href="#" className="text-sm text-neutral-400 hover:text-brand-teal">{item}</a></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h5 className="text-lg font-semibold text-white mb-4">Company</h5>
                            <ul className="space-y-2">
                                {['About Us', 'Careers', 'Contact', 'Press'].map(item => (
                                    <li key={item}><a href="#" className="text-sm text-neutral-400 hover:text-brand-teal">{item}</a></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-neutral-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-neutral-500">
                        <p>&copy; {new Date().getFullYear()} Nufa Studio. All rights reserved.</p>
                        <div className="flex space-x-4 mt-4 sm:mt-0">
                            <a href="#" className="hover:text-brand-teal">Privacy Policy</a>
                            <a href="#" className="hover:text-brand-teal">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
