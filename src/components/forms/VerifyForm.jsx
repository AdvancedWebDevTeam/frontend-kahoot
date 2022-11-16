import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import successImage from './success.png'
import errorImage from './error404.png'

import './verify.css'
export default function VerifyForm() {
    const params = useParams();
    const [validUrl, setValidUrl] = useState(false);

    const verify = async () => {
        await axios.get(`${process.env.REACT_APP_API_URL}/users/${params.id}/verify/${params.token}`)
            .then(res => {
                console.log(res)
                setValidUrl(true)
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        verify()
    })

    return (
        <div>
            {validUrl === true? (
                <div className='box-verify' style={{marginTop: '10%'}}>
                    <img src={successImage} alt="success_img" style={{margin: '0px auto', display: 'block'}}/>
                    <h1 style={{textAlign: 'center'}}>Email verified successfully</h1>
                    <Link to="/login">
                        <button className='green_btn' style={{margin: '0px auto', display: 'block' }}>Login</button>
                    </Link>
                </div>
            ) : (
                <div className='box-verify' style={{marginTop: '10%'}}>
                    <img src={errorImage} style={{height: '200px', width: '200px', margin: '0px auto', display: 'block'}} alt="error404_img"/>
                    <h1 style={{textAlign: 'center'}}>404 Not Found</h1>
                    <Link to="/">
                        <button className='red_btn' style={{margin: '0px auto', display: 'block'}}>Back to menu</button>
                    </Link>
                </div>
            )}
        </div>
    );
}