import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import AddPost from '../components/AddPost'
import Post from '../components/Post'
import axios from 'axios'
import main_url from '../config'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'

export default function Home() {
  const nav = useNavigate()
  const [cookies] = useCookies()
  const [data, setData] = useState(null);
  useEffect(() => {
    axios.get(`${main_url}/posts`, { headers: { Authorization: cookies.token } }).then(res =>{
     setData(res.data.posts)
    }).catch(err => {
      if (err.response.status === 401) nav("/login")
    })
  })

  return (
    <>
      <Navbar />
      <AddPost/>
      <h3 style={{ color: 'var(--primary)', margin: "10px auto", width: "100%", textAlign: 'center' }}>الاسئلة</h3>
      {data === null ? <p style={{ textAlign: "center" }}>جاري التحميل...</p> : data.length === 0 ? <p style={{ textAlign: "center", color:"rgba(0,0,0,.3" }}>لايوجد عناصر</p> : data.map(post => <Post key={post.id} id={post.id} title={post.title} content={post.content} username={post.user.username} />)}
    </>
  )
}
