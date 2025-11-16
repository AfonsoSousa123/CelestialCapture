import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { generateChatResponse } from '../services/geminiService';
import { Content } from '@google/genai';
import LoadingSpinner from './LoadingSpinner';
import Logo from './Logo';
import { useLocale } from '../contexts/LocaleContext';

const CosmosChatbot: React.FC = () => {
    const { t } = useLocale();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    useEffect(() => {
      if(isOpen) {
        inputRef.current?.focus();
      }
    }, [isOpen]);

    const handleSend = async () => {
        const trimmedInput = input.trim();
        if (!trimmedInput || isSending) return;

        setIsSending(true);
        const newUserMessage: ChatMessage = {
            id: Date.now().toString(),
            text: trimmedInput,
            sender: 'user',
        };
        const loadingBotMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: '',
            sender: 'bot',
            isLoading: true,
        };

        setMessages(prev => [...prev, newUserMessage, loadingBotMessage]);
        setInput('');

        const history: Content[] = messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }],
        }));

        const botResponseText = await generateChatResponse(history, trimmedInput, t('prompts.chatbotSystemInstruction'));

        const newBotMessage: ChatMessage = {
            id: loadingBotMessage.id,
            text: botResponseText,
            sender: 'bot',
        };
        
        setMessages(prev => prev.map(msg => msg.id === loadingBotMessage.id ? newBotMessage : msg));
        setIsSending(false);
    };

    return (
        <>
            <div className={`fixed bottom-6 right-6 z-[100] transition-transform duration-300 ${isOpen ? 'scale-0' : 'scale-100'}`}>
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-purple-600 rounded-full text-white flex items-center justify-center shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transform hover:scale-110"
                    aria-label={t('chatbot.open')}
                >
                    <Logo className="h-8 w-8" />
                </button>
            </div>

            <div className={`fixed bottom-6 right-6 z-[100] w-full max-w-sm h-[70vh] bg-gray-800/80 backdrop-blur-md rounded-xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                <header className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h3 className="text-lg font-bold text-white">{t('chatbot.title')}</h3>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white" aria-label={t('chatbot.close')}>
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                <div 
                    className="flex-1 p-4 overflow-y-auto custom-scrollbar"
                    aria-live="polite"
                    aria-atomic="false"
                >
                    {messages.length === 0 && (
                        <div className="text-center text-gray-400 mt-8">
                            <p className="text-lg">{t('chatbot.welcome')}</p>
                            <p dangerouslySetInnerHTML={{ __html: t('chatbot.welcomePrompt') }} />
                        </div>
                    )}
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex items-end gap-2 mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-purple-500 flex-shrink-0"></div>}
                            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-purple-700 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                                {msg.isLoading ? (
                                    <div className="flex items-center justify-center p-2">
                                        <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse mx-1"></div>
                                        <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse mx-1" style={{animationDelay: '0.2s'}}></div>
                                        <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse mx-1" style={{animationDelay: '0.4s'}}></div>
                                    </div>
                                ) : (
                                    <div className="prose prose-invert prose-p:my-2" dangerouslySetInnerHTML={{ __html: msg.text }} />
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <footer className="p-4 border-t border-gray-700">
                    <div className="flex items-center gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            placeholder={t('chatbot.inputPlaceholder')}
                            className="flex-1 bg-gray-700 text-white placeholder-gray-400 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                            disabled={isSending}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isSending}
                            className="group w-10 h-10 bg-purple-600 rounded-full text-white flex-shrink-0 flex items-center justify-center hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-all duration-300 transform hover:scale-110 disabled:bg-purple-800 disabled:scale-100 disabled:cursor-not-allowed"
                        >
                            {isSending ? (
                                <LoadingSpinner />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                </svg>
                            )}
                        </button>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default CosmosChatbot;