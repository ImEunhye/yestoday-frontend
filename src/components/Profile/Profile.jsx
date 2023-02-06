import React from 'react'

import { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileBody from './ProfileBody';
import ProfileHeader from './ProfileHeader';
import ProfileBodyTemp from './ProfileBodyTemp';
import { useLocation, useParams } from 'react-router-dom';

const baseUrl = 'http://localhost:8080';

const Profile = props => {
    const params = useParams();
    const [user, setUser] = useState([]);
    const [userId, setUserId] = useState([]);
    const [followinginfo, setFollowingInfo] = useState([]);
    const [postInfo, setPostInfo] = useState([]);
    const [numberOfFollower, setNumberOfFollower] = useState([]);
    const userName = params.username;

    const testApiCall = async () => {
        try {
            const response = await axios.get(baseUrl + `/users/bynickname/${userName}`)
            const userId = response.data.id;
            setUser(response.data);

            const response2 = await axios.get(baseUrl + `/users/following-members/${userId}`)
            setFollowingInfo(response2.data)
            console.log(followinginfo);

            const response3 = await axios.get(baseUrl + `/users/postsinfo/${userId}`)
            setPostInfo(response3.data)
            console.log(postInfo);

            const response4 = await axios.get(baseUrl + `/follows/number-of-follower/${userId}`)
            setNumberOfFollower(response4.data)
            console.log(numberOfFollower);
        }
        catch (err) {
            console.log(err);
        }
    }

    // useEffect(() => {
    //     axios.get(baseUrl + '/feeds')
    //         .then(response => response.data)
    //         .then(data => {
    //             console.log(data)
    //             setFeeds(data)
    //         })
    // }, []);

    useEffect(() => {
        testApiCall();


        // axios.get(baseUrl + `/users/following-members/${userId}`)
        //     .then(response => response.data)
        //     .then(data => {
        //         setFollowingInfo(data)
        //     })

        // axios.get(baseUrl + `/users/postsinfo/${userId}`)
        //     .then(response => response.data)
        //     .then(data => {
        //         setPostInfo(data)
        //     })

        // axios.get(baseUrl + `/follows/number-of-follower/${userId}`)
        //     .then(response => response.data)
        //     .then(data => {
        //         setNumberOfFollower(data)
        //     })
    }, [])



    return (
        <div className='bg-white'>
            <ProfileHeader user={user} followinginfo={followinginfo} postInfo={postInfo} numberOfFollower={numberOfFollower} />
            <ProfileBodyTemp user={user} postInfo={postInfo} />
            {/* <ProfileBody feeds={feeds} /> */}
        </div>
    )
}

export default Profile