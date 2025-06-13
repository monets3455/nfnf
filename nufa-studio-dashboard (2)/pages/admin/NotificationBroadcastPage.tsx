
import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';

const NotificationBroadcastPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-6">Notification & Broadcast</h1>
      <Card className="bg-neutral-800 border-neutral-700">
        <form className="space-y-6">
          <Select
            id="broadcast-type"
            label="Broadcast Type"
            options={[{label: "Email Blast", value: "email"}, {label: "In-App Popup", value: "popup"}, {label: "Push Notification", value: "push"}]}
            className="!bg-neutral-700 !border-neutral-600"
          />
          <Select
            id="target-audience"
            label="Target Audience"
            options={[{label: "All Users", value: "all"}, {label: "Pro Plan Users", value: "pro"}, {label: "Free Plan Users", value: "free"}, {label: "Specific User Segment", value: "segment"}]}
            className="!bg-neutral-700 !border-neutral-600"
          />
          <Input id="broadcast-subject" label="Subject / Title" placeholder="E.g., New Feature Announcement!" className="!bg-neutral-700 !border-neutral-600" />
          <Textarea id="broadcast-message" label="Message Content" rows={5} placeholder="Craft your message here..." className="!bg-neutral-700 !border-neutral-600" />
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" type="button">Preview</Button>
            <Button variant="primary" type="submit">Send Broadcast</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
NotificationBroadcastPage.displayName = "NotificationBroadcastPage";
export default NotificationBroadcastPage;
