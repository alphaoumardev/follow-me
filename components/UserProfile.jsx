import React, {useEffect, useState} from 'react'
import {useNavigate, useParams} from "react-router-dom";
import Spinner from "./Spinner";
import {userCreatedPinsQuery, userQuery, userSavedPinsQuery} from "../utils/data";
import {client} from "../client";
import {GoogleLogout} from "react-google-login";
import {AiOutlineLogout} from "react-icons/all";
import MasonryLayout from "./MasonryLayout";

const UserProfile=()=>
{
    const randomImage= 'https://source.unsplash.com/1600x900/?nature,photography,technology'
    const [pins, setPins] = useState(null)
    const [user, setUser] = useState(null)
    const [text, setText] = useState('Created')
    const [activeBtn, setActiveBtn] = useState('created')
    const {userId}= useParams()
    const navigate= useNavigate()

    const isNotActiveStyle= 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none cursor-pointer'
    const isActiveStyle='bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none cursor-pointer'

    useEffect(()=>
    {
        const query = userQuery(userId)

        client
            .fetch(query)
            .then((data) =>
            {
                setUser(data[0])
            })
    },[userId])

    useEffect(()=>
    {
        if(text=== 'Created')
        {
            const createdPinsQuery= userCreatedPinsQuery(userId)
            client
                .fetch(createdPinsQuery)
                .then((data)=>
                {
                    setPins(data)
                })
        }
        else
        {
            const savedPinsQuery= userSavedPinsQuery(userId)
            client
                .fetch(savedPinsQuery)
                .then((data)=>
                {
                    setPins(data)
                })
        }
    },[text, userId])

    const logout=()=>
    {
        localStorage.clear()
        navigate('/login')
    }

    if(!user) return <Spinner message="Loading profile..."/>

    return (
        <div className="relative pb-2 justify-center items-center">
            <div className="flex flex-col pb-5">
                <div className="flex flex-col mb-7 relative">
                    <div className="flex flex-col justify-center items-center">
                        <img
                            src={randomImage}
                            className="w-full h-370 2xl:h-510 shadow-lg object-cover"
                            alt="banner"
                        />
                        <img
                            src={user?.image}
                            className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
                            alt="user"
                        />
                        <h1 className="font-bold text-3xl text-center mt-3">{user?.userName}</h1>
                        <div className="absolute top-0 z-1 p-2 right-0">
                            {userId===user?._id &&(
                                <GoogleLogout
                                    clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
                                    render={(renderProps) => (
                                        <button
                                            type="button"
                                            className="bg-white p-2 shadow-md rounded-full cursor-pointer outline-none"
                                            onClick={renderProps.onClick}
                                            disabled={renderProps.disabled}
                                        >
                                            <AiOutlineLogout color='red' title='Log out' fontSize={21}/>
                                        </button>
                                    )}
                                    onLogOutSuccess={logout}
                                    cookiePolicy="single_host_origin"
                                />

                                )}
                        </div>
                    </div>
                    <div className="text-center mb-7">
                        <button type="button"
                                onClick={(e)=>
                                {
                                    setText(e.target.textContent);
                                    setActiveBtn('created')
                                }}
                                className={`${activeBtn ==='created'? isActiveStyle :isNotActiveStyle}`}>
                            created
                        </button>
                        <button type="button"
                                onClick={(e)=>
                                {
                                    setText(e.target.textContent);
                                    setActiveBtn('saved')
                                }}
                                className={`${activeBtn ==='saved'? isActiveStyle :isNotActiveStyle}`}>
                            save
                        </button>
                    </div>
                    {pins?.length>0 ?(
                        <div className="px-2 ">
                            <MasonryLayout pins={pins}/>
                        </div>
                    ):(
                        <div className="">
                            <Spinner message="Loading more pins..."/>
                            No Pins Found!
                        </div>
                    )}

                </div>
            </div>

        </div>
    )
}
export default UserProfile

