import React, { useState } from 'react';
import { generateBlogIdeas } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { BlogPost } from '../types';
import { useLocale } from '../contexts/LocaleContext';

interface BlogSectionProps {
    posts: BlogPost[];
    onSelectPost: (post: BlogPost) => void;
    isAdmin: boolean;
    onAddPostClick: () => void;
}

const BlogSection: React.FC<BlogSectionProps> = ({ posts, onSelectPost, isAdmin, onAddPostClick }) => {
    const { t } = useLocale();
    const [ideas, setIdeas] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPosts = posts.filter(post => {
        const query = searchQuery.toLowerCase();
        return (
            post.title.toLowerCase().includes(query) ||
            post.excerpt.toLowerCase().includes(query)
        );
    });

    return (
        <div className="max-w-4xl mx-auto animate-fadeInUp">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h2 className="text-4xl font-bold text-center text-white mb-4 md:mb-0">{t('blog.title')}</h2>
                {isAdmin && (
                    <button 
                        onClick={onAddPostClick}
                        className="bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30 flex items-center space-x-2"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span>{t('blog.addPostButton')}</span>
                    </button>
                )}
            </div>

            <div className="max-w-2xl mx-auto mb-10">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </span>
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('blog.searchPlaceholder')}
                        className="w-full pl-10 pr-4 py-3 bg-gray-900/70 backdrop-blur-sm text-white rounded-lg border-2 border-transparent focus:outline-none focus:border-purple-500 focus:ring-0 transition-colors duration-300 shadow-md"
                        aria-label={t('blog.searchPlaceholder')}
                    />
                </div>
            </div>

            <div className="space-y-8 mb-12">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post, index) => (
                        <div
                            key={index}
                            className="group bg-gray-900/60 backdrop-blur-md border border-purple-500/20 p-6 rounded-lg shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:border-purple-500/50"
                        >
                            <div className="cursor-pointer" onClick={() => onSelectPost(post)}>
                                <div className="flex flex-col md:flex-row gap-6 items-start">
                                    <img src={post.imageUrl} alt={post.title} className="w-full md:w-1/3 aspect-video object-cover rounded-md transition-transform duration-300 group-hover:scale-105 flex-shrink-0" />
                                    <div className="flex-grow">
                                        <h3 className="text-2xl font-bold text-purple-400 group-hover:text-purple-300 transition-colors">{post.title}</h3>
                                        <p className="text-sm text-gray-400 mb-2">{post.date}</p>
                                        <p className="text-gray-300">{post.excerpt}</p>
                                        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <span className="font-semibold text-purple-400 flex items-center gap-2">
                                                {t('blog.readMore')}
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 bg-gray-900/30 rounded-lg">
                        <p className="text-lg text-gray-400">{t('blog.noArticlesFound')}</p>
                        <p className="text-sm text-gray-500">{t('blog.noArticlesHint')}</p>
                    </div>
                )}
            </div>

            {/*<div className="text-center mt-16 p-8 bg-gray-900/60 backdrop-blur-md rounded-lg border border-purple-500/30">*/}
            {/*    <h3 className="text-2xl font-bold text-white mb-4">{t('blog.inspirationTitle')}</h3>*/}
            {/*    <p className="text-gray-400 mb-6">{t('blog.inspirationSubtitle')}</p>*/}
            {/*    <button*/}
            {/*        onClick={async () => {*/}
            {/*            setIsLoading(true);*/}
            {/*            setIdeas([]);*/}
            {/*            const newIdeas = await generateBlogIdeas(t('prompts.blogIdeas'));*/}
            {/*            setIdeas(newIdeas);*/}
            {/*            setIsLoading(false);*/}
            {/*        }}*/}
            {/*        disabled={isLoading}*/}
            {/*        className="bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30 flex items-center justify-center space-x-2 mx-auto disabled:opacity-50"*/}
            {/*    >*/}
            {/*        {isLoading ? <LoadingSpinner/> : t('blog.generateIdeasButton')}*/}
            {/*    </button>*/}
            {/*    */}
            {/*    {ideas.length > 0 && (*/}
            {/*         <div className="mt-8 text-left">*/}
            {/*            <ul className="list-disc list-inside space-y-2 text-gray-300">*/}
            {/*               {ideas.map((idea, index) => (*/}
            {/*                   <li key={index} className="transition-opacity duration-500" style={{ animation: `fadeIn 0.5s ease-in-out ${index * 0.1}s both` }}>*/}
            {/*                       {idea}*/}
            {/*                   </li>*/}
            {/*               ))}*/}
            {/*            </ul>*/}
            {/*         </div>*/}
            {/*    )}*/}
            {/*</div>*/}
             <style>{`
                .tabular-nums { font-variant-numeric: tabular-nums; }
            `}</style>
        </div>
    );
};

export default BlogSection;