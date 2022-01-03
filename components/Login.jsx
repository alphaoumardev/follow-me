import React from 'react'
import {useNavigate} from "react-router-dom";
import GoogleLogin from "react-google-login";
import {FcGoogle} from 'react-icons/fc'
import shareVideo from '../assets/share.mp4'
import logo from '../assets/logowhite.png'
import {client} from '../client'

const Login =()=>
{
    const navigate = useNavigate()
    const responseGoogle= (response)=>
    {
        localStorage.setItem('user',JSON.stringify(response.profileObj))
        // const { googleId,imageUrl,name}= response.profileObj
        const name= response.profileObj.name
        const googleId= response.profileObj.googleId
        const imageUrl= response.profileObj.imageUrl


        const doc=
            {
                _id: googleId,
                _type: 'user',
                userName: name,
                image: imageUrl
            }
            client.createIfNotExists(doc).then(()=> navigate('/',{replace:true}))
    }
    return(
        <div className="flex justify-start items-center flex-col h-screen">
            <div className="relative w-full h-full">
                <video src={shareVideo} typeof="video/mp4" loop muted autoPlay className="w-full object-cover h-full"  controls={false} />
                <div className="absolute flex flex-col top-0 justify-center items-center right-0 left-0 bottom-0 bg-blackOverlay"  >
                    <div className="p-5">
                        <img alt="Logo" src={logo} width="130px"/>
                    </div>
                    <div className="shadow-2xl">
                        <GoogleLogin
                            clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
                            render={(renderProps) =>
                            (
                                <button type='button' className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
                                        onClick={renderProps.onClick}
                                        disabled={renderProps.disabled}>
                                    <FcGoogle className='mr-4 ' />Sign in with google
                                </button>
                            )}
                            onSuccess={responseGoogle}
                            onFailure={responseGoogle}
                            cookiePolicy="single_host_origin"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Login
