

import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { 
    MagnifyingGlassIcon, 
    PlayCircleIcon, 
    DocumentTextIcon, 
    ChatBubbleLeftEllipsisIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from '../components/icons';
// import { ACCENT_COLOR } from '../constants'; // No longer needed if classes are static

interface QuickLinkItem {
    icon: React.FC<{ className?: string }>;
    title: string;
    description: string;
    link: string;
}

interface TutorialItem {
    icon: React.FC<{ className?: string }>;
    title: string;
    type: 'Video' | 'Article';
    durationOrReadTime: string;
    actionText: string;
    link: string;
}

interface FaqItem {
    question: string;
    answer: string;
}

const quickLinksData: QuickLinkItem[] = [
    { icon: PlayCircleIcon, title: 'Video Tutorials', description: 'Learn with step-by-step videos', link: '#' },
    { icon: DocumentTextIcon, title: 'Documentation', description: 'Explore detailed guides', link: '#' },
    { icon: ChatBubbleLeftEllipsisIcon, title: 'Contact Support', description: 'Get help from our team', link: '#' },
];

const featuredTutorialsData: TutorialItem[] = [
    { icon: PlayCircleIcon, title: 'Getting Started with Nufa Studio', type: 'Video', durationOrReadTime: '5:30', actionText: 'Watch Now', link: '#' },
    { icon: PlayCircleIcon, title: 'Creating Effective Character Descriptions', type: 'Video', durationOrReadTime: '3:15', actionText: 'Watch Now', link: '#' },
    { icon: DocumentTextIcon, title: 'Advanced Visual Style Techniques', type: 'Article', durationOrReadTime: '8 min read', actionText: 'Read Now', link: '#' },
    { icon: PlayCircleIcon, title: 'Optimizing Your Storyboard Workflow', type: 'Video', durationOrReadTime: '7:45', actionText: 'Watch Now', link: '#' },
    { icon: DocumentTextIcon, title: 'Exporting and Sharing Your Work', type: 'Article', durationOrReadTime: '5 min read', actionText: 'Read Now', link: '#' },
];

const faqData: FaqItem[] = [
    {
        question: "How do I create my first storyboard?",
        answer: "Go to the \"Generate Storyboard\" section from the sidebar. Fill out the form with your project details including title, description, visual style preferences, and other required details. Once completed, click on \"Generate Storyboard Prompts\" to create your storyboard."
    },
    {
        question: "What visual styles are available?",
        answer: "We offer a wide range of visual styles including Cinematic, Anime, Cartoon, Comic Book, Photorealistic, and many more specialized styles like Film Noir, Cyberpunk, and Wes Anderson-inspired. You can select these when generating a new storyboard."
    },
    {
        question: "How long can my storyboard be?",
        answer: "Storyboards can be generated for videos ranging from 15 seconds to 5 minutes in length. The longer the duration, the more scenes and shots will be included in your storyboard."
    },
    {
        question: "Can I edit my storyboard after generation?",
        answer: "Yes, after generating a storyboard, you can edit individual scenes, add new scenes, or remove existing ones. You can also adjust visual styles and other parameters for specific scenes."
    },
    {
        question: "How do I export my storyboard?",
        answer: "Open your project and click on the \"Export\" button in the top right corner. You can choose to export as PDF, PNG sequence, or directly share to supported platforms."
    },
    {
        question: "What happens if I reach my plan limit?",
        answer: "If you reach your plan's limits, you'll be notified and given options to upgrade your subscription or wait until your usage resets in the next billing cycle."
    }
];


const HelpPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="p-6 md:p-8 bg-neutral-100 dark:bg-brand-dark text-neutral-700 dark:text-neutral-300 min-h-full space-y-12"> {/* Increased space-y-10 to space-y-12 */}
      <div>
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white">Help & Tutorials</h1> {/* Increased text-3xl to text-4xl */}
        <p className="text-lg text-neutral-600 dark:text-neutral-400 mt-2">Find answers to common questions and learn how to make the most of Nufa Studio.</p> {/* Increased text-base to text-lg, mt-1 to mt-2 */}
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"> {/* Increased pl-3 to pl-4 */}
          <MagnifyingGlassIcon className="w-6 h-6 text-neutral-400 dark:text-neutral-500" /> {/* Increased w-5 h-5 to w-6 h-6 */}
        </div>
        <Input 
          id="help-search-input"
          type="search"
          placeholder="Search for help topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 !py-3.5 !text-lg !bg-white dark:!bg-brand-bg-card !border-neutral-300 dark:!border-neutral-700 focus:!border-brand-teal" /* Increased pl-10, !py-3, !text-base */
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8"> {/* Increased gap-6 to gap-8 */}
        {quickLinksData.map((item) => (
          <Card key={item.title} className="bg-white dark:bg-brand-bg-card hover:!border-brand-teal border-2 border-neutral-200 dark:border-transparent transition-all duration-200 group">
            <a href={item.link} className="flex flex-col items-center text-center p-6"> {/* Increased p-4 to p-6 */}
              {/* Updated to use static class name */}
              <item.icon className={`w-12 h-12 text-brand-teal mb-4 group-hover:scale-110 transition-transform`} /> {/* Increased w-10 h-10 to w-12 h-12, mb-3 to mb-4 */}
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-1.5">{item.title}</h3> {/* Increased text-lg to text-xl, mb-1 to mb-1.5 */}
              <p className="text-base text-neutral-600 dark:text-neutral-400">{item.description}</p> {/* Increased text-sm to text-base */}
            </a>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-3xl font-semibold text-neutral-900 dark:text-white mb-8">Featured Tutorials</h2> {/* Increased text-2xl to text-3xl, mb-6 to mb-8 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Increased gap-6 to gap-8 */}
            {featuredTutorialsData.slice(0,5).map((tutorial, index) => (
                <Card key={index} className="bg-white dark:bg-brand-bg-card flex flex-col">
                    {/* Updated to use static class name */}
                    <div className={`aspect-video bg-neutral-200 dark:bg-neutral-800 rounded-t-lg flex items-center justify-center text-brand-teal`}>
                        <tutorial.icon className="w-20 h-20 opacity-80" /> {/* Increased w-16 h-16 to w-20 h-20 */}
                    </div>
                    <div className="p-5 flex flex-col flex-grow"> {/* Increased p-4 to p-5 */}
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1.5">{tutorial.title}</h3> {/* Increased text-md to text-lg, mb-1 to mb-1.5 */}
                        <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-500 mb-4"> {/* Increased text-xs to text-sm, mb-3 to mb-4 */}
                            <span>{tutorial.type}</span>
                            <span className="mx-2">•</span> {/* Increased mx-1.5 to mx-2 */}
                            <span>{tutorial.durationOrReadTime}</span>
                        </div>
                        {/* Updated to use static class name */}
                        <a href={tutorial.link} className={`mt-auto text-base font-medium text-brand-teal hover:underline self-start`}> {/* Increased text-sm to text-base */}
                            {tutorial.actionText} &rarr;
                        </a>
                    </div>
                </Card>
            ))}
        </div>
        {featuredTutorialsData.length > 5 && (
            <div className="text-center mt-10"> {/* Increased mt-8 to mt-10 */}
                <Button variant="outline" size="lg">View All Tutorials</Button>
            </div>
        )}
      </div>

      <div>
        <h2 className="text-3xl font-semibold text-neutral-900 dark:text-white mb-8">Frequently Asked Questions</h2> {/* Increased text-2xl to text-3xl, mb-6 to mb-8 */}
        <div className="space-y-4"> {/* Increased space-y-3 to space-y-4 */}
          {faqData.map((faq, index) => (
            <Card key={index} className="bg-white dark:bg-brand-bg-card overflow-hidden">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex justify-between items-center p-5 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors" /* Increased p-4 to p-5 */
                aria-expanded={openFaqIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-100">{faq.question}</h3> {/* Increased text-md to text-lg */}
                {/* Updated to use static class name */}
                {openFaqIndex === index ? 
                  <ChevronUpIcon className={`w-6 h-6 text-brand-teal`} /> :
                  <ChevronDownIcon className={`w-6 h-6 text-brand-teal`} />}
              </button>
              {openFaqIndex === index && (
                <div id={`faq-answer-${index}`} className="p-5 border-t border-neutral-200 dark:border-neutral-700"> {/* Increased p-4 to p-5 */}
                  <p className="text-base text-neutral-700 dark:text-neutral-300 whitespace-pre-line">{faq.answer}</p> {/* Increased text-sm to text-base */}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      <Card className="bg-white dark:bg-brand-bg-card p-8 md:p-10 text-center"> {/* Increased p-6 md:p-8 to p-8 md:p-10 */}
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-3">Still Need Help?</h2> {/* Increased text-xl to text-2xl, mb-2 to mb-3 */}
        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">Our support team is always ready to assist you with any questions or issues.</p> {/* Increased text-base to text-lg, mb-6 to mb-8 */}
        <div className="flex flex-col sm:flex-row justify-center gap-4"> {/* Increased gap-3 to gap-4 */}
            <Button variant="primary" size="lg">Contact Support</Button>
            <Button variant="secondary" size="lg">Schedule a Demo</Button>
        </div>
      </Card>
    </div>
  );
};

export default HelpPage;