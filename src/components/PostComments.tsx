'use client';

import { useState, useEffect } from 'react';
import { Heart, MessageSquare, Reply } from 'lucide-react';
import { API_URL, Comment } from '@/lib/api';

interface PostCommentsProps {
  postId: number;
  initialLikes: number | string;
  comments: Comment[];
}

export default function PostComments({
  postId,
  initialLikes,
  comments: initialComments,
}: PostCommentsProps) {
  const [likes, setLikes] = useState(Number(initialLikes));
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [replyTo, setReplyTo] = useState<number | null>(null);

  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
    if (likedPosts.includes(postId)) {
      setHasLiked(true);
    }
  }, [postId]);

  const handleLike = async () => {
    if (isLiking || hasLiked) return;
    setIsLiking(true);
    try {
      const res = await fetch(`${API_URL}/posts/${postId}/like`, { method: 'POST' });
      const data = await res.json();
      setLikes(data.likes);

      setHasLiked(true);
      const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
      localStorage.setItem('liked_posts', JSON.stringify([...likedPosts, postId]));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLiking(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !name.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name,
          content,
          parent_id: replyTo,
        }),
      });

      if (res.ok) {
        const newComment = await res.json();
        if (replyTo) {
          // Add to replies of parent
          setComments((prev) =>
            prev.map((c) => {
              if (c.id === replyTo) {
                return { ...c, replies: [...(c.replies || []), newComment] };
              }
              return c;
            })
          );
        } else {
          // Add to top level
          setComments([newComment, ...comments]);
        }
        setName('');
        setContent('');
        setReplyTo(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12">
      {/* Interaction Bar */}
      <div className="flex items-center gap-4 mb-10 border-y-4 border-black py-4 bg-white">
        <button
          onClick={handleLike}
          disabled={isLiking || hasLiked}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold comic-shadow hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all uppercase border-[3px] border-black disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:translate-x-0 disabled:hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] disabled:cursor-not-allowed"
        >
          <Heart
            size={20}
            strokeWidth={3}
            className={isLiking ? 'animate-pulse' : hasLiked ? 'fill-current' : ''}
          />
          {hasLiked ? 'Liked' : 'Like'} ({likes})
        </button>
        <div className="flex items-center gap-2 px-4 py-2 bg-white text-black font-bold uppercase border-[3px] border-black pointer-events-none">
          <MessageSquare size={20} strokeWidth={3} />
          {comments.length + comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0)}{' '}
          Comments
        </div>
      </div>

      {/* Comment Form */}
      <div className="comic-panel bg-white p-6 sm:p-8 rotate-1 mb-12">
        <h3 className="comic-heading text-2xl text-black mb-6 uppercase tracking-wide border-b-4 border-black pb-2">
          {replyTo ? 'Reply to Comment' : 'Leave a Comment'}
        </h3>
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div>
            <label className="block comic-heading text-lg text-black mb-2 uppercase">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border-[3px] border-black bg-slate-50 focus:bg-white focus:outline-none transition-colors text-black font-bold uppercase tracking-wide placeholder-slate-400 comic-shadow"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block comic-heading text-lg text-black mb-2 uppercase">Comment</label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 border-[3px] border-black bg-slate-50 focus:bg-white focus:outline-none transition-colors text-black font-bold tracking-wide placeholder-slate-400 comic-shadow resize-none"
              placeholder="What do you think?"
            />
          </div>
          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 comic-heading text-xl text-white bg-primary border-[3px] border-black py-3 hover:bg-black transition-colors comic-shadow uppercase disabled:opacity-70"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
            {replyTo && (
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="px-6 py-3 border-[3px] border-black bg-white font-bold uppercase hover:bg-slate-100 transition-colors"
              >
                Cancel Reply
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="comic-panel bg-white p-5 sm:p-6 -rotate-1">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-black text-black uppercase text-lg">{comment.name}</h4>
              <span className="text-xs font-bold text-slate-500 uppercase">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-slate-800 font-medium leading-relaxed mb-4 whitespace-pre-wrap">
              {comment.content}
            </p>
            <button
              onClick={() => setReplyTo(comment.id)}
              className="text-sm font-bold text-primary hover:text-black uppercase flex items-center gap-1 transition-colors"
            >
              <Reply size={16} strokeWidth={3} /> Reply
            </button>

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-6 space-y-4 pl-4 sm:pl-8 border-l-4 border-black">
                {comment.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="bg-slate-50 border-[3px] border-black p-4 rotate-1"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-black text-black uppercase text-md">{reply.name}</h4>
                      <span className="text-xs font-bold text-slate-500 uppercase">
                        {new Date(reply.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-800 font-medium leading-relaxed whitespace-pre-wrap">
                      {reply.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
