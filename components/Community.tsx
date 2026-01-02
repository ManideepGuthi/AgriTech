import React, { useState, useEffect } from 'react';
import { MessageSquare, Heart, Share2, Send, User, Loader2, MoreVertical, Edit2, Trash2, X, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../services/dbService';
import { Post } from '../types';

const Community: React.FC = () => {
  const { t } = useLanguage();
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  
  const user = db.users.getSession();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await db.posts.findAll();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!newPost.trim() || !user) return;
    
    setSubmitting(true);
    try {
      const post: Post = {
        id: Date.now().toString(),
        author: user.name || 'Anonymous Farmer',
        userId: user.id,
        content: newPost,
        likes: 0,
        comments: 0,
        timestamp: Date.now(),
        likedBy: []
      };

      await db.posts.create(post);
      setNewPost('');
      fetchPosts();
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (postId: string) => {
    if (!editContent.trim() || !user) return;
    
    try {
      await db.posts.update(postId, editContent, user.id);
      setEditingPost(null);
      fetchPosts();
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!user || !window.confirm("Are you sure you want to delete this post?")) return;
    
    try {
      await db.posts.delete(postId, user.id);
      fetchPosts();
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const startEdit = (post: Post) => {
    setEditingPost(post.id);
    setEditContent(post.content);
  };

  const cancelEdit = () => {
    setEditingPost(null);
    setEditContent('');
  };

  const toggleLike = async (post: Post) => {
    if (!user) return;
    
    // Optimistic update
    const isLiked = post.likedBy.includes(user.id);
    const updatedPosts = posts.map(p => {
      if (p.id === post.id) {
        return {
          ...p,
          likes: isLiked ? p.likes - 1 : p.likes + 1,
          likedBy: isLiked ? p.likedBy.filter(id => id !== user.id) : [...p.likedBy, user.id]
        };
      }
      return p;
    });
    setPosts(updatedPosts);

    try {
      await db.posts.toggleLike(post.id, user.id);
    } catch (error) {
      console.error("Failed to toggle like:", error);
      fetchPosts();
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return "Just now";
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Loader2 className="animate-spin text-success" size={48} />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4 animate-fade-in pb-5">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="h4 fw-bold text-dark m-0">{t('community.title')}</h2>
      </div>

      <div className="row g-4 justify-content-center">
        <div className="col-lg-8">
          
          {/* Create Post */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="d-flex gap-3">
                <div className="bg-light rounded-circle p-2 d-flex align-items-center justify-content-center" style={{width: '48px', height: '48px'}}>
                    <User size={24} className="text-secondary"/>
                </div>
                <div className="flex-grow-1">
                  <textarea 
                    className="form-control border-0 bg-light mb-3" 
                    rows={3} 
                    placeholder={t('community.share')}
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    style={{resize: 'none'}}
                  ></textarea>
                  <div className="d-flex justify-content-end">
                    <button 
                      className="btn btn-success d-flex align-items-center gap-2 px-4"
                      onClick={handlePost}
                      disabled={!newPost.trim() || submitting}
                    >
                      {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                      {t('community.post')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="d-flex flex-column gap-3">
            {posts.length > 0 ? (
              posts.map(post => {
                const isLiked = post.likedBy.includes(user?.id || '');
                const isOwner = user?.id === post.userId;

                return (
                  <div key={post.id} className="card border-0 shadow-sm">
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{width: '48px', height: '48px'}}>
                            {post.author.charAt(0)}
                          </div>
                          <div>
                            <h5 className="h6 fw-bold text-dark m-0">{post.author}</h5>
                            <small className="text-muted">{formatTimeAgo(post.timestamp)}</small>
                          </div>
                        </div>
                        {isOwner && (
                          <div className="dropdown">
                            <button className="btn btn-link text-muted p-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                              <MoreVertical size={20} />
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end border-0 shadow-sm">
                              <li>
                                <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => startEdit(post)}>
                                  <Edit2 size={16} /> Edit
                                </button>
                              </li>
                              <li>
                                <button className="dropdown-item d-flex align-items-center gap-2 text-danger" onClick={() => handleDelete(post.id)}>
                                  <Trash2 size={16} /> Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                      
                      {editingPost === post.id ? (
                        <div className="mb-3">
                          <textarea 
                            className="form-control mb-2" 
                            rows={3} 
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                          ></textarea>
                          <div className="d-flex justify-content-end gap-2">
                            <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1" onClick={cancelEdit}>
                              <X size={16} /> Cancel
                            </button>
                            <button className="btn btn-sm btn-success d-flex align-items-center gap-1" onClick={() => handleUpdate(post.id)}>
                              <Check size={16} /> Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-dark mb-4" style={{whiteSpace: 'pre-wrap'}}>{post.content}</p>
                      )}
                      
                      <div className="d-flex align-items-center gap-4 pt-3 border-top">
                        <button 
                          className={`btn btn-sm d-flex align-items-center gap-2 border-0 ${isLiked ? 'text-danger' : 'text-muted'}`}
                          onClick={() => toggleLike(post)}
                        >
                          <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                          <span className="fw-medium">{post.likes} {t('community.likes')}</span>
                        </button>
                        
                        <button className="btn btn-sm d-flex align-items-center gap-2 border-0 text-muted">
                          <MessageSquare size={20} />
                          <span className="fw-medium">{post.comments} {t('community.comments')}</span>
                        </button>
                        
                        <button className="btn btn-sm d-flex align-items-center gap-2 border-0 text-muted ms-auto">
                          <Share2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-5 text-muted">
                <MessageSquare size={48} className="mb-3 opacity-50" />
                <p>{t('community.noPosts')}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Community;
