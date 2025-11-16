import React, { useState, useMemo } from 'react';
import { Comment as CommentType } from '../types';
import { useLocale } from '../contexts/LocaleContext';

// --- Comment Form Component ---
interface CommentFormProps {
    onSubmit: (comment: { author: string, email: string, content: string }) => void;
    onCancel?: () => void;
    isReply?: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit, onCancel, isReply = false }) => {
    const { t } = useLocale();
    const [author, setAuthor] = useState('');
    const [email, setEmail] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!author.trim() || !content.trim() || (!isReply && !email.trim())) {
            setError(t('comments.errorRequired'));
            return;
        }
        if (!isReply && !/\S+@\S+\.\S+/.test(email)) {
            setError(t('comments.errorEmail'));
            return;
        }

        setError('');
        setIsSubmitting(true);

        setTimeout(() => {
            onSubmit({ author, email: isReply ? 'reply@example.com' : email, content });
            setAuthor('');
            setEmail('');
            setContent('');
            setIsSubmitting(false);
            onCancel?.();
        }, 500);
    };

    return (
        <form onSubmit={handleSubmit} className={`space-y-4 ${isReply ? 'p-4 bg-gray-800/50 rounded-lg mt-2' : ''}`}>
            {!isReply && <h3 className="text-xl font-bold text-white mb-4">{t('comments.leaveComment')}</h3>}
            {error && <p className="bg-red-900/50 text-red-300 p-3 rounded-md text-sm">{error}</p>}
            <div className={`grid grid-cols-1 ${!isReply && 'md:grid-cols-2'} gap-4`}>
                <div>
                    <label htmlFor={`author-${isReply}`} className="block text-sm font-medium text-gray-400">{t('comments.nameLabel')}</label>
                    <input type="text" id={`author-${isReply}`} value={author} onChange={(e) => setAuthor(e.target.value)} required className="mt-1 block w-full bg-gray-700 text-gray-200 border-transparent rounded-md focus:border-purple-500 focus:ring-purple-500 transition" />
                </div>
                {!isReply && (
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400">{t('comments.emailLabel')}</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full bg-gray-700 text-gray-200 border-transparent rounded-md focus:border-purple-500 focus:ring-purple-500 transition" />
                    </div>
                )}
            </div>
            <div>
                <label htmlFor={`content-${isReply}`} className="block text-sm font-medium text-gray-400">{isReply ? t('comments.replyLabel') : t('comments.commentLabel')}</label>
                <textarea id={`content-${isReply}`} rows={isReply ? 3 : 4} value={content} onChange={(e) => setContent(e.target.value)} required className="mt-1 block w-full bg-gray-700 text-gray-200 border-transparent rounded-md focus:border-purple-500 focus:ring-purple-500 transition" />
            </div>
            <div className="flex items-center gap-4">
                <button type="submit" disabled={isSubmitting} className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition">
                    {isSubmitting ? t('comments.posting') : (isReply ? t('comments.postReplyButton') : t('comments.postCommentButton'))}
                </button>
                {onCancel && <button type="button" onClick={onCancel} className="text-gray-400 hover:text-white">{t('comments.cancel')}</button>}
            </div>
        </form>
    );
};

// --- Single Comment Thread Component ---
interface CommentThreadProps {
    comment: CommentType;
    allComments: CommentType[];
    onAddComment: (comment: { author: string, email: string, content: string, parentId?: string }) => void;
    level: number;
}
const CommentThread: React.FC<CommentThreadProps> = ({ comment, allComments, onAddComment, level }) => {
    const { t, locale } = useLocale();
    const [isReplying, setIsReplying] = useState(false);
    
    const replies = useMemo(() => 
        allComments.filter(c => c.parentId === comment.id)
                   .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        [allComments, comment.id]
    );

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
    
    return (
        <div className="py-4">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-800 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">{comment.author.charAt(0)}</span>
                </div>
                <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                        <p className="font-bold text-purple-300">{comment.author}</p>
                        <p className="text-xs text-gray-500">{formatDate(comment.date)}</p>
                    </div>
                    <p className="mt-1 text-gray-300">{comment.content}</p>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                        {level < 3 && (
                            <button onClick={() => setIsReplying(!isReplying)} className="text-gray-400 hover:text-white transition-colors font-semibold">{t('comments.reply')}</button>
                        )}
                    </div>
                </div>
            </div>
            {isReplying && (
                <div className="ml-14 mt-2">
                    <CommentForm
                        isReply
                        onSubmit={(replyData) => onAddComment({ ...replyData, parentId: comment.id })}
                        onCancel={() => setIsReplying(false)}
                    />
                </div>
            )}
            {replies.length > 0 && (
                <div className="ml-8 mt-2 pl-6 border-l-2 border-gray-800">
                    {replies.map(reply => (
                        <CommentThread key={reply.id} comment={reply} allComments={allComments} onAddComment={onAddComment} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};


// --- Main Comment Section Component ---
interface CommentSectionProps {
    comments: CommentType[];
    onAddComment: (comment: { author: string, email: string, content: string, parentId?: string }) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, onAddComment }) => {
    const { t } = useLocale();
    const topLevelComments = useMemo(() =>
        comments.filter(c => !c.parentId)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        [comments]
    );

    const commentCountText = comments.length === 1 ? t('comments.oneComment') : t('comments.multipleComments', { count: comments.length });

    return (
        <div className="mt-12 pt-8 border-t border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-6">
                {commentCountText}
            </h2>
            <div className="space-y-4 divide-y divide-gray-800">
                {topLevelComments.length > 0 ? (
                    topLevelComments.map(comment => 
                      <CommentThread 
                        key={comment.id} 
                        comment={comment} 
                        allComments={comments} 
                        onAddComment={onAddComment}
                        level={1}
                      />)
                ) : (
                    <p className="text-gray-400 py-4">{t('comments.beFirst')}</p>
                )}
            </div>

            <div className="mt-10">
                <CommentForm onSubmit={onAddComment} />
            </div>
        </div>
    );
};

export default CommentSection;
