import { Link } from 'react-router-dom';
import styles from '../styles/login.module.css';
import { useState } from 'react';
import axios from 'axios'
import main_url from '../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const [errors, setErrors] = useState({ all: false, email: false, username: false, password: false })
    const [credentials, setCredentials] = useState({ email: '', password: '', username: '', confirm: '' });
    const submitHundler = () => {
        axios.post(`${main_url}/auth/register`, credentials)
            .then(res => console.log(res.data))
            .catch(err => {
                toast.error(err.response.data.err);
                if (err.response.data.err === "fill all fields") setErrors({ email: true, password: true, username: true })
                if (err.response.data.err === "password doen't match" || err.response.data.err === "password must be more than 6 characters") setErrors({ ...errors, password: true })
                if (err.response.data.err === "email is used") setErrors({ ...errors, email: true });
                if (err.response.data.err === "username is used") setErrors({ ...errors, username: true });

            });
    }
    return (
        <>
            <ToastContainer position='top-center' />
            <div className={`${styles.container}`}>
                <h1> انشاء حساب</h1>
                <div >
                    <p>البريد الالكتروني:</p>
                    <input
                        className={` ${errors.email === true ? 'error' : ''}`}
                        placeholder='email' type='email'
                        onChange={(e) => { setCredentials({ ...credentials, email: e.target.value }); setErrors({ ...errors, email: false }) }} />
                    <p> اسم المستخدم:</p>
                    <input
                        placeholder='username' type='text'
                        onChange={(e) => { setCredentials({ ...credentials, username: e.target.value }); setErrors({ ...errors, username: false }) }}
                        className={` ${errors.username === true ? 'error' : ''}`}
                    />
                    <p>كلمة المرور:</p>
                    <input
                        placeholder='password' type='password'
                        onChange={(e) => { setCredentials({ ...credentials, password: e.target.value }); setErrors({ ...errors, password: false }) }}
                        className={` ${errors.password === true ? 'error' : ''}`}
                    />
                    <p>تاكيد كلمة المرور:</p>
                    <input
                        placeholder='password' type='password'
                        onChange={(e) => { setCredentials({ ...credentials, confirm: e.target.value }); setErrors({ ...errors, password: false }) }}
                        className={` ${errors.password === true ? 'error' : ''}`}
                    />
                    <input onClick={submitHundler} type='submit' value="انشاء حساب" />
                    <Link className={`${styles.register_link}`} to='/register'>تسجيل الدخول من هنا</Link>
                </div>
            </div>
        </>
    )
}

export default Register;