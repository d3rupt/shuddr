import React from 'react';
import { auth } from '../firebase';
import Avatar from '@material-ui/core/Avatar';
import ImageUpload from "../ImageUpload";
import ListItem from "./ListItem";

import './Profile.css';

export default function Profile({posts}) {
    console.log(posts)
    return(
        <div className='profile'>
            <div className='profile-recentContainer'>
                <h5 className='profile-recentHeader'>
                    Recently posted
                </h5>
                {posts.slice(0,5).map((post, index) => {
                    return (<ListItem
                            index={index}
                            imageURL={post.post.userAvatar}
                            username={post.post.username}
                        />)
                    }
                )}
            </div>
        </div>
    )
}
