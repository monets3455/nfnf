
import React from 'react';
import Card from '../components/ui/Card';
import { LightBulbIcon } from '../components/icons';
import { ACCENT_COLOR } from '../constants';

// This is a placeholder component for the old AnalystPage.
// The primary functionality has been moved to StorylineIdeaPage.tsx.

const AnalystPagePlaceholder: React.FC = () => {
    return (
        <div className="p-6 md:p-8 text-neutral-900 dark:text-neutral-100 min-h-full bg-neutral-100 dark:bg-brand-bg-dark">
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-3">Analyst Page (Archived)</h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
                This page is currently a placeholder. The functionality previously associated with "Analyst" features
                has been integrated into the "Storyline Idea Generator".
            </p>

            <Card className="text-center py-16 bg-white dark:bg-brand-bg-card">
                <LightBulbIcon className={`w-20 h-20 text-${ACCENT_COLOR} opacity-50 mb-6 mx-auto`} />
                <h3 className="text-2xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Looking for Storyline Ideas?</h3>
                <p className="text-base text-neutral-500 dark:text-neutral-400">
                    Please navigate to the "Storyline Idea Generator" page from the sidebar.
                </p>
            </Card>
        </div>
    );
};

AnalystPagePlaceholder.displayName = "AnalystPagePlaceholder";
export default AnalystPagePlaceholder;
