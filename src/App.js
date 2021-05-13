import React, {useState, useEffect} from "react";
import { FiAperture } from "react-icons/fi";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import Post from "./Post";
import Profile from "./Components/Profile";
import ImageUpload from "./ImageUpload";
import { db, auth } from './firebase';

import './App.css';
import firebase from "firebase";
import Avatar from "@material-ui/core/Avatar";


function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

function App() {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle)
    const [openSignIn, setOpenSignIn] = useState(false)
    const [posts, setPosts] = useState([]);
    const [openSignUp, setOpenSignUp] = useState(false);
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [avatarURL, setAvatarURL] = useState('');
    const [openPost, setOpenPost] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        //alert(JSON.stringify(user))
    }, [])
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                setUser(authUser);
            } else {
                setUser(null);
            }
        })
        return () => {
            unsubscribe();
        }
    }, [user, username])

    useEffect(() => {
        db
            .collection('posts').orderBy('timestamp','desc' )
            .onSnapshot(snapshot => {
                setPosts(snapshot.docs.map(doc => ({
                        id: doc.id,
                        post: doc.data(),
                })))
            })
    }, [posts])

    const handleUploadModal = () => {
        setOpenPost(false)
    }
    const signUp = (event) => {
        event.preventDefault();
        auth
            .createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                return authUser.user.updateProfile({
                    displayName: username,
                    photoURL: avatarURL,
                })
            })
            .catch(error => alert(error.message))
        setOpenSignUp(false)
        setUsername('');
        setEmail('');
        setPassword('');
    }

    const signIn = (event) => {
        event.preventDefault();
        auth
        .signInWithEmailAndPassword(email, password)
            .catch(error => alert(error.message))
        setOpenSignIn(false)

    }

  return (
    <div className="App">
        <Modal
            open={openPost}
            onClose={() => setOpenPost(false)}
        >
            <div style={modalStyle} className={classes.paper}>
                <ImageUpload handleModal={handleUploadModal}/>
            </div>
        </Modal>

        <Modal
            open={openSignUp}
            onClose={() => setOpenSignUp(false)}
        >
            <div style={modalStyle} className={classes.paper}>

               <form className='app-signup'>
                   <FiAperture className='modal-logo' size={50} />
                   <Input
                       placeholder='username'
                       type='text'
                       value={username}
                       onChange={(e) => setUsername(e.target.value)}
                   />
                   <Input
                       placeholder='email'
                       type='text'
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                   />
                   <Input
                       placeholder='password'
                       type='password'
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                   />
                   <Input
                       placeholder='avatar image URL'
                       type='text'
                       value={avatarURL}
                       onChange={(e) => setAvatarURL(e.target.value)}
                   />
                   <Button onClick={signUp}>Sign up</Button>
               </form>

            </div>
        </Modal>

        <Modal
            open={openSignIn}
            onClose={() => setOpenSignIn(false)}
        >
            <div style={modalStyle} className={classes.paper}>
                <form className='app-signup'>
                    <FiAperture className='modal-logo' size={50} />

                    <Input
                        placeholder='email'
                        type='text'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        placeholder='password'
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button onClick={signIn}>Sign in</Button>
                </form>

            </div>
        </Modal>

        <div className="app-header">
            <FiAperture className='app-logo'/>
            {user ? (
                <div className='profile-info'>
                    <Avatar
                        className='post-avatar'
                        alt='thdnkns'
                        src={auth.currentUser.photoURL}
                    />
                    <input className='profile-input' onClick={() => setOpenPost(true )} type='text' placeholder={`What's on your mind?`} />
                </div>
            ) : <h3>Shuddr</h3>}
            <div className='app-loginContainer'>
            {user ? (
                <Button color='primary' variant='outlined' className='app-acctButton' onClick={() => {
                    setUser(false)
                    auth.signOut()
                }}>Logout</Button>
            ): (
                <>
                    <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
                    <Button onClick={() => setOpenSignUp(true)}>Sign Up</Button>
                </>
            )}
            </div>
        </div>

        <div className='app-postsContainer'>
            <div className='app-posts'>
                {posts.map(({post, id}, index) => {
                    return(
                        <Post
                            id={index.toString()}
                            index={index}
                            user={user}
                            key={id}
                            postId={id}
                            avatar={post.userAvatar}
                            username={post.username}
                            caption={post.caption}
                            imageURL={post.imageUrl}
                        />
                    )
                })}
            </div>
            <div className='app-profileContainer'>
                <Profile posts={posts}/>
            </div>
        </div>

    </div>
  );
}

export default App;
