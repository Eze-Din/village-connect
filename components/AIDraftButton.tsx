
import React, { useState } from 'react';
import { Sparkles, Loader } from 'lucide-react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';
import { draftContent } from '../services/geminiService';

interface AIDraftButtonProps {
  onGeneratedText: (text: string) => void;
  promptLabel?: string;
  className?: string;
}

const AIDraftButton: React.FC<AIDraftButtonProps> = ({
  onGeneratedText,
  promptLabel = "What should the AI draft?",
  className
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    try {
      const generatedText = await draftContent(prompt);
      onGeneratedText(generatedText);
      setModalOpen(false);
      setPrompt('');
    } catch (error) {
      console.error("Failed to generate AI content", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setModalOpen(true)}
        className={`flex items-center gap-1 ${className}`}
        title="Draft with AI"
      >
        <Sparkles className="w-4 h-4 text-yellow-500" />
        <span>Draft with AI</span>
      </Button>
      <Modal title="AI Content Assistant" isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <div className="space-y-4">
          <Input
            id="ai-prompt"
            label={promptLabel}
            placeholder="e.g., 'A friendly announcement about the annual village fair'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleGenerate} disabled={!prompt || isLoading}>
              {isLoading ? (
                <>
                  <Loader className="animate-spin w-4 h-4 mr-2" />
                  Generating...
                </>
              ) : (
                'Generate'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AIDraftButton;
