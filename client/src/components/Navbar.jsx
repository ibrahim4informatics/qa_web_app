import React from 'react'
import styles from '../styles/navbar.module.css'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className={`${styles.navbar}`}>
        <div className={`${styles.container}`}>
            <Link to='/'><h1>IQeu<span>sion</span></h1></Link>
            <p><Link className={`${styles.p_link}`} to="/profile">حسابك</Link></p>
        </div>
    </nav>
  )
}
