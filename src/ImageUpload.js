import React, {useState} from 'react';
import { Button } from '@material-ui/core';
import firebase from 'firebase';
import { storage, db, auth } from './firebase';
import './ImageUpload.css';

export default function ImageUpload({username, handleModal}) {
    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState('');


    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress)
            },
            (error) => {
                console.log(error)
                alert(error.message)
            },
            () => {
                storage
                    .ref('images')
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection('posts').add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: auth.currentUser.displayName,
                            userAvatar: auth.currentUser.photoURL,
                        });
                        setProgress(0);
                        setCaption('');
                        setImage(null);
                        handleModal();
                    })
            }
        )
    };

    return(
        <div className='imageUpload'>
            <progress className='imageUpload-progress' value={progress} max='100' />
            <input
                className='image-input'
                type='text'
                placeholder='Enter a caption'
                value={caption}
                onChange={event => setCaption(event.target.value)}
            />
            <input type='file' onChange={handleChange} />
            <Button onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}
