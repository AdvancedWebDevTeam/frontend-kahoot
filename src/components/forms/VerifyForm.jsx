import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";

export default function VerifyForm() {
    const params = useParams();
    const [isValid, setIsValid] = useState(false);
    
    const verify  = async () => {
        await axios.get(`${process.env.REACT_APP_API_URL}/users/${params.id}/verify/${params.token}`)
        .then(res => {
            console.log(res)
            setIsValid(true)
        })
        .catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        verify()
    }, [])

    return (
        <div>
            {isValid === true ?
                <div>
                    your email successfully verify
                </div>
                :
                <div>
                    404 not found
                </div>
            }
        </div>
    );
}