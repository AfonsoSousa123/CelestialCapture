import React, { useMemo } from 'react';
import { BlogPost } from '../types';
import { useLocale } from '../contexts/LocaleContext';

interface RelatedPostsProps {
  currentPost: BlogPost;
  allPosts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
}

const RelatedPostCard: React.FC<{ post: BlogPost; onClick: () => void }> = ({ post, onClick }) => (
    <div 
        onClick={onClick}
        className="group cursor-pointer bg-gray-800/50 rounded-lg overflow-hidden transition-all duration-300 hover:bg-gray-800/80 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/30 border border-transparent"
    >
        <img src={post.imageUrl} alt={post.title} className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="p-4">
            <h4 className="font-bold text-md text-purple-300 group-hover:text-purple-200 transition-colors truncate">{post.title}</h4>
            <p className="text-xs text-gray-400">{post.date}</p>
        </div>
    </div>
);

const RelatedPosts: React.FC<RelatedPostsProps> = ({ currentPost, allPosts, onSelectPost }) => {
  const { t } = useLocale();
  const relatedPosts = useMemo(() => {
    const otherPosts = allPosts.filter(p => p.slug !== currentPost.slug);

    if (!currentPost.tags || currentPost.tags.length === 0) {
        return otherPosts.slice(0, 3);
    }

    const candidates = otherPosts
        .map(post => {
            const commonTags = post.tags?.filter(tag => currentPost.tags?.includes(tag)) || [];
            return { ...post, score: commonTags.length };
        })
        .filter(post => post.score > 0)
        .sort((a, b) => b.score - a.score);

    if (candidates.length > 0) {
        return candidates.slice(0, 3);
    } 
    
    return otherPosts.slice(0, 3);

  }, [currentPost, allPosts]);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="my-12 py-8 border-t border-b border-gray-700">
      <h3 className="text-3xl font-bold text-white mb-6">{t('relatedPosts.title')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map(post => (
          <RelatedPostCard key={post.slug} post={post} onClick={() => onSelectPost(post)} />
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
