import styles from '../styles/add_post.module.css';
import { useState } from 'react';
import axios from 'axios';
import main_url from '../config';
import { useCookies } from 'react-cookie';

const AddPost = () => {
  const [cookies] = useCookies()
  const [content, setContent] = useState({ body: '', title: '' });
  const [errors, setErrors] = useState({ body: false, title: false })
  const submithundler = () => {
    if (content.body.trim().length < 1) setErrors({ ...errors, content: true });
    if (content.title.trim().length < 1) setErrors({ ...errors, title: true })
    axios.post(`${main_url}/posts/new`, { content: content.body, title: content.title }, { headers: { Authorization: cookies.token } })
      .then(res => console.log(res.data))
      .catch(err => console.log(err.response.data))
  };

  return (
    <div className={`container ${styles.add_post}`}>
      <h3>اضافة سؤال</h3>
      <input
        className={`${styles.title} ${errors.title === true ? 'error' : ''}`}
        type='text'
        maxLength={40}
        placeholder='اضف عنوان لا يتخطى 40 حرف '
        onChange={(e) => { setContent({ ...content, title: e.target.value }); setErrors({ ...errors, title: false }) }}
      />
      <textarea
        onChange={(e) => { setContent({ ...content, body: e.target.value }); setErrors({ ...errors, body: false }) }}
        placeholder='اطرح سؤال...'
        className={`${errors.body === true ? 'error' : ''}`}
        maxLength={2500}
      >
      </textarea>
      <button onClick={submithundler}>نشر</button>
    </div>
  )
}

export default AddPost