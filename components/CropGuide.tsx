
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Sprout, Loader2, Mic, MicOff, Landmark } from 'lucide-react';
import { getFarmingAdvice, findGovernmentSchemes } from '../services/geminiService';
import { ChatMessage, GovtScheme, NavigationContext } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import ReactMarkdown from 'react-markdown';

interface CropGuideProps {
  initialData?: NavigationContext | null;
}

const CropGuide: React.FC<CropGuideProps> = ({ initialData }) => {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Namaste! I am your Millet Expert. Ask me about Jowar, Bajra, Ragi, or farming methods.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showSchemes, setShowSchemes] = useState(false);
  const [schemes, setSchemes] = useState<GovtScheme[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (initialData?.initialQuery) {
      handleSend(initialData.initialQuery);
    }
  }, [initialData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, schemes]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowSchemes(false);

    try {
      const response = await getFarmingAdvice(userMessage.text);
      const botMessage: ChatMessage = { role: 'model', text: response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Connection Error.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice input not supported in this browser.");
      return;
    }
    // ... (Voice logic remains similar but simplified for brevity)
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.onresult = (event: any) => {
      setInput(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.start();
    setIsListening(true);
  };

  const loadSchemes = async () => {
    setIsLoading(true);
    try {
      const result = await findGovernmentSchemes();
      setSchemes(result);
      setShowSchemes(true);
      setMessages(prev => [...prev, { role: 'model', text: 'Here are the latest government schemes:' }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm h-100 d-flex flex-column overflow-hidden" style={{ height: 'calc(100vh - 100px)' }}>
      <div className="card-header bg-light border-bottom p-3 d-flex justify-content-between align-items-center">
         <h2 className="h5 fw-bold text-dark m-0 d-flex align-items-center gap-2">
           <Sprout className="text-success" /> {t('nav.guide')}
         </h2>
         <button onClick={loadSchemes} className="btn btn-sm btn-outline-success d-flex align-items-center gap-2 fw-bold">
           <Landmark size={14} /> Govt Schemes
         </button>
      </div>

      <div className="card-body p-3 overflow-y-auto flex-grow-1 d-flex flex-column gap-3" style={{ height: '500px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`d-flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${msg.role === 'user' ? 'bg-secondary text-white' : 'bg-success-subtle text-success'}`} style={{ width: '32px', height: '32px' }}>
              {msg.role === 'user' ? <User size={16} /> : <Sprout size={16} />}
            </div>
            <div className={`p-3 rounded-4 shadow-sm text-sm ${msg.role === 'user' ? 'bg-dark text-white rounded-tr-none' : 'bg-white border text-dark rounded-tl-none'}`} style={{ maxWidth: '85%' }}>
              <ReactMarkdown>{String(msg.text)}</ReactMarkdown>
            </div>
          </div>
        ))}
        {showSchemes && schemes.map((s, i) => (
           <div key={i} className="card bg-warning-subtle border-warning-subtle p-3 mx-4" style={{maxWidth: '85%'}}>
             <h6 className="fw-bold text-dark">{s.name}</h6>
             <p className="small mb-1">{s.benefits}</p>
           </div>
        ))}
        {isLoading && <Loader2 className="animate-spin ms-4" />}
        <div ref={messagesEndRef} />
      </div>

      <div className="card-footer bg-white border-top p-3">
        <div className="input-group">
          <button onClick={toggleListening} className={`btn ${isListening ? 'btn-danger' : 'btn-light'} border`}><Mic size={20} /></button>
          <input type="text" className="form-control" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyPress} placeholder="Ask about farming..." />
          <button onClick={() => handleSend()} className="btn btn-success"><Send size={20} /></button>
        </div>
      </div>
    </div>
  );
};

export default CropGuide;
