import { useState } from 'react';
import './PromptForm.css';

interface Props {
  onSubmit: (userPrompt: string) => void;
  isLoading: boolean;
}

const PromptForm = ({ onSubmit, isLoading }: Props) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
      setPrompt('');
    }
  };

  return (
    <form className="prompt-form" onSubmit={handleSubmit}>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="מה תרצה ללמוד היום?"
        rows={4}
      />
      <button type="submit" disabled={isLoading || !prompt.trim()}>
        {isLoading ? 'יוצר שיעור...' : 'שלח'}
      </button>
    </form>
  );
};

export default PromptForm;
