import styles from '../styles/comment.module.css';
const Comment = ({username, content}) => {
  return (
    <div className={`${styles.commment_container}`}>
        <p>:@{username}</p>
        <p>{content}</p>
    </div>
  )
}

export default Comment