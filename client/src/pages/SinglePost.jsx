import styles from '../styles/single_post.module.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar';
import axios from 'axios';
import main_url from '../config';
import { useCookies } from 'react-cookie';
import Comment from '../components/Comment';

const SinglePost = () => {
    const { post_id } = useParams();
    const [info, setInfo] = useState(null);
    const [cookies] = useCookies()

    useEffect(()=>{
        axios.get(`${main_url}/posts/${post_id}`,{headers:{Authorization:cookies.token}})
        .then(res => setInfo(res.data))
        .catch(err => console.log(err))
    })


    return (
        info === null ? <p style={{ textAlign: 'center' }}>جاري التحميل</p> : (<>
            <Navbar />
            <div className="container">
                <div className={`${styles.post_detailes}`}>
                    <div className={`${styles.top_sect}`}>
                        <h3>{info.post.title}</h3>
                        <p>@{info.post.user.username}</p>

                    </div>
                    <div className={`${styles.med_sect}`}>
                        {info.post.content}
                    </div>
                </div>
                <hr />
                <div className={`${styles.comment_sect}`}>
                    <h3>الاجوبة</h3>
                    {info.post.comment.map(co => <Comment key={co.id} content={co.content} username={co.user.username}/>)}
                </div>
            </div>

        </>)
    )
}

export default SinglePost