import Navbar from "../components/Navbar"
import styles from "../styles/profile.module.css"
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import main_url from "../config";
import { useNavigate } from "react-router-dom";
import Post from "../components/Post";
const Profile = () => {
    const nav = useNavigate()
    const [info, setInfo] = useState(null)
    const [isShow, setShow] = useState(false)
    const [cookies,setCookie,removeCookie] = useCookies();
    useEffect(() => {
        axios.get(`${main_url}/profile`, { headers: { Authorization: cookies.token } })
            .then(res => { setInfo(res.data) })
            .catch(err => { if (err.response.status === 401) nav('/login') })
    }, [info])
    return (
        <>
            {info !== null ? (
                <>
                    <Navbar />
                    <div className="container">
                        <div className={`${styles.profile_section}`}>
                            <div className={`${styles.top}`}>
                                <p>المعلومات الشخصية</p>
                                <button onClick={() => setShow(!isShow)}>اظهار</button>
                            </div>
                            <div className={`${styles.profile_info} ${isShow !== true ? 'hide' : 'show'}`}>
                                <p><span>البريد الالكتروني: </span>{info.email}</p>
                                <hr />
                                <p><span>اسم المستخدم: </span>{info.username}</p>
                                <hr />
                                <p><span>المنشورات: </span>{info.posts.length}</p>
                                <hr/>
                                <button className={`${styles.logout_btn}`} onClick={()=> removeCookie('token')}>تسجيل الخروج</button>
                            </div>
                        </div>
                        <hr />
                        <div className={`${styles.posts_section}`}>
                            <h3 style={{textAlign:'center', margin:'10px'}}>المنشورات:</h3>
                            <div>
                                <div className={`${styles.options}`}>
                                    
                                </div>
                                {info.posts.map(post => <Post key={post.id} id={post.id} title={post.title} username={post.user.username} content={post.content} />)}
                            </div>
                        </div>
                    </div>
                </>
            ) : <p style={{ textAlign: 'center' }}>جاري التحميل...</p>}
        </>
    )
}

export default Profile;