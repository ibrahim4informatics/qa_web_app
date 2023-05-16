import { Link } from 'react-router-dom';
import styles from '../styles/login.module.css';
import { useState } from 'react';
import axios from 'axios';
import main_url from '../config';
import { useCookies } from 'react-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [errors, setErrors] = useState({ email: false, password: false })
    const [cookies,setCookie] = useCookies();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const nav = useNavigate()
    const submitHundler = () => {
        axios.post(`${main_url}/auth/login`, credentials)
            .then((res) => {
                const token =  res.data.token
                setCookie('token', token, { sameSite: true, maxAge: 1000 * 3600 * 24 });
                nav("/")

            })
            .catch(err => {
                if (err !== undefined) {
                    cookies.token = null
                    const error_message = err.response.data.err;
                    toast.error(error_message);
                    if (error_message === "fill all fields") setErrors({ email: true, password: true });
                    if (error_message === "user doesn't exist") setErrors({ ...errors, email: true });
                    if (error_message === "invalid password") setErrors({ ...errors, password: true });

                }

            })
    }
    return (
        <>
            <ToastContainer position='top-center' />
            <div className={`${styles.container}`}>
                <h1>تسجيل الدخول</h1>
                <div>
                    <p>البريد الالكتروني:</p>
                    <input className={`${errors.email === true ? 'error' : ''}`} placeholder='email' type='email' onChange={(e) => { setCredentials({ ...credentials, email: e.target.value }); setErrors({ ...errors, email: false }) }} />
                    <p>كلمة المرور:</p>
                    <input className={`${errors.password === true ? 'error' : ''}`} placeholder='password' type='password' onChange={(e) => { setCredentials({ ...credentials, password: e.target.value }); setErrors({ ...errors, password: false }) }} />
                    <input onClick={submitHundler} type='submit' value="تسجيل الدخول" />
                    <Link className={`${styles.register_link}`} to='/register'>انشئ حساب من هنا</Link>
                </div>
            </div>
        </>
    )
}

export default Login;