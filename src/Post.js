import React, {useState, useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import { IoIosHeartEmpty } from "react-icons/io";
import './Post.css';
import {db} from "./firebase";
import firebase from 'firebase';

export default function Post({ avatar, user, postId, username, caption, imageURL, id }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection('posts')
                .doc(postId)
                .collection('comments').orderBy('timestamp', 'asc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map(doc => doc.data()))
                })
            return () => {
                unsubscribe()
            }
        }
    }, [postId])

    const postComment = (event) => {
        event.preventDefault();
        db
            .collection('posts')
            .doc(postId)
            .collection('comments')
            .add({
                text: comment,
                username:user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
        setComment('');
    }
    return (
        <div className='post' id={id}>
            <div className='post-header'>
                <Avatar
                    className='post-avatar'
                    alt='thdnkns'
                    src={avatar}
                />
                <h3>{username}</h3>
            </div>
            <img
                className='post-image'
                src={imageURL}
            />
            <div className='post-likeContainer'>
                {/*<IoIosHeartEmpty size={30}/>*/}
            </div>
            <h4 className='post-text'><strong>{username + ' '}</strong>{caption}</h4>
            {
                comments.map((comment) => {
                    return(<p className='post-comment '><strong>{comment.username}</strong> {comment.text}</p>)
                })
            }
            {user && (
                <form className='post-commentBox'>
                    <input
                        className='post-input'
                        type='text'
                        placeholder='Add a comment...'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                        className='post-button'
                        disabled={!comment}
                        type='submit'
                        onClick={postComment}
                    >
                        Post
                    </button>

                </form>
            )}
        </div>
   )
}
