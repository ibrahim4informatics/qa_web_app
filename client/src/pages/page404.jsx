import styles from "../styles/page404.module.css"
import { Link } from "react-router-dom"
const Page404 = () => {
  return (
    <div className={`${styles.full} ${styles.container}`}>
      <h1 className={`${styles.header}`}>للأسف لم يتم العثور على العنصر</h1>
      <p>العودة الى الصفحة الرئيسية <Link className={`${styles.link}`} to='/'>من هنا</Link></p>
    </div>
  )
}

export default Page404