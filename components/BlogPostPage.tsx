import React, { useState, useEffect } from 'react';
import { BlogPost, Comment } from '../types';
import BlogPostEditor from './BlogPostEditor';
import CommentSection from './CommentSection';
import RelatedPosts from './RelatedPosts';
import { useLocale } from '../contexts/LocaleContext';

// Helper to set or create a meta tag by its 'name' or 'property' attribute
const setMetaTag = (attr: 'name' | 'property', value: string, content: string) => {
    const selector = `meta[${attr}="${value}"]`;
    let element = document.querySelector(selector);
    if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, value);
        document.head.appendChild(element);
    }
    element.setAttribute('content', content);
    return element;
};

interface BlogPostPageProps {
    post: BlogPost;
    allComments: Comment[];
    allPosts: BlogPost[];
    onBack: () => void;
    isAdmin: boolean;
    onUpdatePost: (post: BlogPost) => void;
    onAddComment: (comment: { author: string, email: string, content: string, parentId?: string }) => void;
    onSelectPost: (post: BlogPost) => void;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ post, allComments, allPosts, onBack, isAdmin, onUpdatePost, onAddComment, onSelectPost }) => {
    const { t } = useLocale();
    const [isEditing, setIsEditing] = useState(false);
    const [shareFeedback, setShareFeedback] = useState(t('blogPost.share'));

    const postComments = allComments.filter(c => c.postId === post.slug);

    useEffect(() => {
        setIsEditing(false);
        setShareFeedback(t('blogPost.share'));
        
        const originalTitle = document.title;
        const originalDescriptionMeta = document.querySelector('meta[name="description"]');
        const originalDescription = originalDescriptionMeta ? originalDescriptionMeta.getAttribute('content') : '';

        document.title = `${post.title} | ${t('header.title')} ${t('header.titleHighlight')}`;
        setMetaTag('name', 'description', post.excerpt);
        
        const postUrl = `${window.location.origin}#post/${post.slug}`;
        const ogTags: { property: string, content: string }[] = [
            { property: 'og:title', content: post.title },
            { property: 'og:description', content: post.excerpt },
            { property: 'og:image', content: post.imageUrl },
            { property: 'og:url', content: postUrl },
            { property: 'og:type', content: 'article' },
            { property: 'article:published_time', content: new Date(post.date).toISOString() },
        ];
        ogTags.forEach(tag => setMetaTag('property', tag.property, tag.content));

        const scriptId = 'blog-post-ld-json';
        let script = document.getElementById(scriptId) as HTMLScriptElement | null;
        if (!script) {
            script = document.createElement('script');
            script.id = scriptId;
            script.type = 'application/ld+json';
            document.head.appendChild(script);
        }
        const structuredData = {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            'headline': post.title,
            'description': post.excerpt,
            'image': post.imageUrl,
            'datePublished': new Date(post.date).toISOString(),
            'author': { '@type': 'Person', 'name': 'Celestial Capture' },
            'publisher': { '@type': 'Organization', 'name': 'Celestial Capture' }
        };
        script.textContent = JSON.stringify(structuredData, null, 2);
        
        return () => {
            document.title = originalTitle;
            if (originalDescription) {
                setMetaTag('name', 'description', originalDescription);
            } else if (originalDescriptionMeta) {
                originalDescriptionMeta.remove();
            }
            document.querySelectorAll('meta[property^="og:"], meta[property^="article:"]').forEach(tag => tag.remove());
            const scriptToRemove = document.getElementById(scriptId);
            if (scriptToRemove) {
                scriptToRemove.remove();
            }
        };
    }, [post, t]);

    const handleSave = (updates: { content: string, imageUrl: string }) => {
        onUpdatePost({ ...post, ...updates });
        setIsEditing(false);
    };

    const handleShare = async () => {
        const postUrl = `${window.location.origin}#post/${post.slug}`;
        const shareData = {
            title: post.title,
            text: post.excerpt,
            url: postUrl,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    console.error('Error sharing:', err);
                    setShareFeedback(t('blogPost.shareError'));
                    setTimeout(() => setShareFeedback(t('blogPost.share')), 2000);
                }
            }
        } else {
            navigator.clipboard.writeText(postUrl).then(() => {
                setShareFeedback(t('blogPost.shareCopied'));
                setTimeout(() => setShareFeedback(t('blogPost.share')), 2000);
            }).catch(err => {
                console.error('Failed to copy link: ', err);
                setShareFeedback(t('blogPost.shareError'));
                setTimeout(() => setShareFeedback(t('blogPost.share')), 2000);
            });
        }
    };

    return (
        <div className="bg-gray-900/50 backdrop-blur-sm animate-fadeInUp">
            <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16">
                 <div className="mb-8 flex justify-between items-center">
                    <button 
                        onClick={onBack} 
                        className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors font-semibold"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        {t('blogPost.backToBlog')}
                    </button>
                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                                onClick={handleShare}
                                className="flex items-center gap-2 text-gray-300 hover:text-white bg-gray-700/50 hover:bg-gray-700/80 font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.186 2.25 2.25 0 00-3.933 2.186z" />
                                </svg>
                                <span className="hidden md:inline">{shareFeedback}</span>
                        </button>
                        {isAdmin && !isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                                <span className="hidden md:inline">{t('blogPost.editPost')}</span>
                            </button>
                        )}
                    </div>
                </div>
                <article className="grid grid-cols-1 lg:grid-cols-5 lg:gap-12">
                    <div className="lg:col-span-2 mb-8 lg:mb-0">
                        <div className="lg:sticky lg:top-24">
                            <img src={post.imageUrl} alt={post.title} className="w-full h-auto max-h-[300px] sm:max-h-[500px] lg:max-h-none object-cover rounded-lg shadow-lg shadow-purple-900/20"/>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">{post.title}</h1>
                        <p className="text-md text-gray-400 mb-6">{t('blogPost.publishedOn', { date: post.date })}</p>
                        
                        <hr className="border-gray-700 my-8" />

                        {isEditing ? (
                            <BlogPostEditor
                                initialContent={post.content}
                                initialImageUrl={post.imageUrl}
                                onSave={handleSave}
                                onCancel={() => setIsEditing(false)}
                            />
                        ) : (
                             <div 
                                className="prose prose-invert max-w-none prose-p:text-base prose-li:text-base md:prose-p:text-lg md:prose-li:text-lg prose-p:text-gray-300 prose-li:text-gray-300 prose-h3:text-purple-400 prose-h3:border-b prose-h3:border-gray-700 prose-strong:text-gray-50 prose-ul:list-disc prose-ol:list-decimal"
                                dangerouslySetInnerHTML={{ __html: post.content }} 
                            />
                        )}
                        
                        {!isEditing && (
                            <>
                                <RelatedPosts
                                    currentPost={post}
                                    allPosts={allPosts}
                                    onSelectPost={onSelectPost}
                                />
                                <CommentSection 
                                    comments={postComments} 
                                    onAddComment={onAddComment}
                                />
                            </>
                        )}
                    </div>
                </article>
            </div>
            <style>{`
                .tabular-nums { font-variant-numeric: tabular-nums; }
            `}</style>
        </div>
    );
};

export default BlogPostPage;