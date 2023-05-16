import styles from '../styles/post.module.css'
import { useState } from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import main_url from '../config'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
const Post = ({ content, title, username, id }) => {
  const nav = useNavigate()
  const [cookies] = useCookies()
  const [comment, setComment] = useState({ content: '' })
  const [errors, setErrors] = useState({ commment: false })
  const submitHundler = () => {
    if (comment.content.trim().length < 1) return setErrors({ commment: true });
    axios.post(`${main_url}/posts/${id}/comments/add`, comment, { headers: { Authorization: cookies.token } })
      .then(res => { toast.success('تم اضافة اجابة'); setComment({ ...comment, content: '' }) })
      .catch(err => console.log(err.response.data))
  }
  return (
    <>
      <ToastContainer position='top-center' />
      <div className={`container ${styles.post_container}`}>
        <p className={`${styles.author}`}>@{username}</p>
        <p className={`${styles.title}`}>{title}</p>
        <p className={`${styles.content}`}>{content}</p>
        <div className={`${styles.options}`}>
          <div className={`${styles.comment}`}>
            <input className={`${errors.commment === true ? 'error' : ''}`} onChange={(e) => { setComment({ content: e.target.value }); setErrors({ ...errors, commment: false }) }} placeholder='اكتب اجابة...' />
            <button value={comment.content} onClick={submitHundler} className={`${styles.comment_publish}`}>نشر</button>
          </div>
          <button onClick={() => { nav(`/post/${id}`) }}>الاجوبة</button>
        </div>
      </div>
    </>
  )
}
export default Post