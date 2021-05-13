import React, {useEffect} from 'react';
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import { Link } from 'react-scroll';

export default function ListItem({imageURL, username, index}) {
    /*useEffect(() => {
        alert(imageURL)
        }, [])*/
    return(
        <div className='profile-recent'>
            <div className='profile-recentAvatar'>
                <Avatar
                    className='recent-avatar'
                    src={imageURL}
                />
                <h5>{username}</h5>
            </div>
            <Link smooth={true} to={index.toString()}>
                <a className='recent-post'>See Post</a>
            </Link>

        </div>
    )
}
