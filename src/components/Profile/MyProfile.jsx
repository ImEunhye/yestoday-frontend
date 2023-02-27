import React from 'react'

import { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileHeader from './ProfileHeader';
import ProfileBodyTemp from './ProfileBodyTemp';
import MyProfileHeader from './MyprofileHeader';

const MyProfile = () => {
    const [user, setUser] = useState([]);
    const [userId, setUserId] = useState([]);
    const [followinginfo, setFollowingInfo] = useState([]);
    const [postInfo, setPostInfo] = useState([]);
    const [numberOfFollower, setNumberOfFollower] = useState([]);

    const baseUrl = 'http://54.248.66.164:8080';

    const testApiCall = async () => {

        try {
            const response = await axios.get(baseUrl + "/users/bynickname/Jeong1")
            const userId = response.data.id;
            console.log(userId);
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
            <MyProfileHeader user={user} followinginfo={followinginfo} postInfo={postInfo} numberOfFollower={numberOfFollower} />
            <ProfileBodyTemp user={user} postInfo={postInfo} />
            {/* <ProfileBody feeds={feeds} /> */}
        </div>
    )
}

export default MyProfile