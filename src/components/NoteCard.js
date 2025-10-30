'use client';

import { useState } from 'react';
import styles from './NoteCard.module.css';
import Modal from './Modal';

export default function NoteCard({ note, onEdit, onDelete, onPublish }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this note?')) {
            onDelete(note.id);
        }
    };

    const handlePublish = () => {
        if (confirm('Are you sure you want to publish this draft?')) {
            onPublish(note.id);
        }
    };

    const handleCardClick = (e) => {
        // Don't open modal if clicking on buttons
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            return;
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
        <div 
            className={`${styles.noteCard} ${note.is_draft ? styles.draftCard : ''}`}
            onClick={handleCardClick}
        >
            {/* Status Badges */}
            <div className={styles.statusBadges}>
                {note.is_draft && (
                    <span className={styles.draftBadge}>Draft</span>
                )}
                {note.is_public && (
                    <span className={styles.publicBadge}>Public</span>
                )}
                {note.is_encrypted && (
                    <span className={styles.encryptedBadge}>🔒</span>
                )}
            </div>

            {/* Category Badge */}
            {note.category && (
                <div 
                    className={styles.categoryBadge}
                    style={{ backgroundColor: note.category.color }}
                >
                    <span className={styles.categoryIcon}>{note.category.icon}</span>
                    <span className={styles.categoryName}>{note.category.name}</span>
                </div>
            )}
            
            <h3 className={styles.noteTitle}>
                {note.title || 'Untitled'}
            </h3>
            <p className={styles.noteContent}>
                {note.is_encrypted ? '🔒 Encrypted content' : (note.content || 'No content')}
            </p>
            
            {/* Labels */}
            {note.labels && note.labels.length > 0 && (
                <div className={styles.labelsContainer}>
                    {note.labels.map(label => (
                        <span 
                            key={label.id}
                            className={styles.labelTag}
                            style={{ 
                                backgroundColor: label.color + '20',
                                borderColor: label.color,
                                color: label.color
                            }}
                        >
                            {label.name}
                        </span>
                    ))}
                </div>
            )}
            
            <div className={styles.noteActions}>
                <button onClick={() => onEdit(note)} className={styles.editBtn}>
                    Edit
                </button>
                {note.is_draft && (
                    <button onClick={handlePublish} className={styles.publishBtn}>
                        Publish
                    </button>
                )}
                <button onClick={handleDelete} className={styles.deleteBtn}>
                    Delete
                </button>
                {note.is_public && note.public_share_token && (
                    <button 
                        onClick={() => navigator.clipboard.writeText(`${window.location.origin}/public/${note.public_share_token}`)}
                        className={styles.shareBtn}
                        title="Copy public link"
                    >
                        Share
                    </button>
                )}
            </div>
            <small className={styles.noteDate}>
                {note.date_type === 'updated' ? 'Updated' : 'Created'}: {formatDate(note.display_date || note.created_at)}
                <br />
                <span className={styles.noteId}>ID: {note.id}</span>
            </small>
        </div>

        {/* Full Note Modal */}
        <Modal 
            isOpen={isModalOpen} 
            onClose={handleCloseModal}
            title={note.title || 'Untitled'}
        >
            <div className={styles.modalNoteContent}>
                {/* Status Badges */}
                <div className={styles.modalStatusBadges}>
                    {note.is_draft && (
                        <span className={styles.draftBadge}>Draft</span>
                    )}
                    {note.is_public && (
                        <span className={styles.publicBadge}>Public</span>
                    )}
                    {note.is_encrypted && (
                        <span className={styles.encryptedBadge}>🔒</span>
                    )}
                </div>

                {/* Category Badge */}
                {note.category && (
                    <div 
                        className={styles.modalCategoryBadge}
                        style={{ backgroundColor: note.category.color }}
                    >
                        <span className={styles.categoryIcon}>{note.category.icon}</span>
                        <span className={styles.categoryName}>{note.category.name}</span>
                    </div>
                )}

                {/* Labels */}
                {note.labels && note.labels.length > 0 && (
                    <div className={styles.modalLabelsContainer}>
                        {note.labels.map(label => (
                            <span 
                                key={label.id}
                                className={styles.labelTag}
                                style={{ 
                                    backgroundColor: label.color + '20',
                                    borderColor: label.color,
                                    color: label.color
                                }}
                            >
                                {label.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Full Content */}
                <div className={styles.modalFullContent}>
                    {note.is_encrypted ? '🔒 Encrypted content' : (note.content || 'No content')}
                </div>

                {/* Date Info */}
                <div className={styles.modalDateInfo}>
                    <small className={styles.modalDate}>
                        {note.date_type === 'updated' ? 'Updated' : 'Created'}: {formatDate(note.display_date || note.created_at)}
                        <br />
                        <span className={styles.modalNoteId}>ID: {note.id}</span>
                    </small>
                </div>

                {/* Actions */}
                <div className={styles.modalActions}>
                    <button onClick={() => { onEdit(note); handleCloseModal(); }} className={styles.editBtn}>
                        Edit
                    </button>
                    {note.is_draft && (
                        <button onClick={() => { handlePublish(); handleCloseModal(); }} className={styles.publishBtn}>
                            Publish
                        </button>
                    )}
                    <button onClick={() => { handleDelete(); handleCloseModal(); }} className={styles.deleteBtn}>
                        Delete
                    </button>
                    {note.is_public && note.public_share_token && (
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/public/${note.public_share_token}`);
                                handleCloseModal();
                            }}
                            className={styles.shareBtn}
                            title="Copy public link"
                        >
                            Share
                        </button>
                    )}
                </div>
            </div>
        </Modal>
        </>
    );
}