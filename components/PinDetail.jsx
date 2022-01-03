import React, {useEffect, useState} from 'react'
import {Link, useParams} from "react-router-dom";
import Spinner from "./Spinner";
import {pinDetailMorePinQuery, pinDetailQuery} from "../utils/data";
import {client, urlFor} from "../client";
import {MdDownloadForOffline} from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';
import MasonryLayout from "./MasonryLayout";

const PinDetail=({user})=>
{
    const [pins, setPins] = useState(null)
    const [pinDetail, setPinDetail] = useState(null)
    const [comment, setComment] = useState('')
    const [addingComments, setAddingComments] = useState(false)
    const {pinId}= useParams()

    const addComment=()=>
    {
        if(comment)
        {
            setAddingComments(true)
            client
                .patch(pinId)
                .setIfMissing({comments:[]})
                .insert('after' , 'comments[-1]',
                    [
                    {
                        comment,
                        _key:uuidv4(),
                        postedBy:
                        {
                            _type:'postedBy',
                            _ref:user._id
                        }
                    }])
                .commit()
                .then(()=>
                {
                    fetchPinDetail()
                    setComment('')
                    setAddingComments(false)
                })
        }
    }
    const fetchPinDetail =()=>
    {
        let query =pinDetailQuery(pinId)
        if(query)
        {
            client.fetch(query).then((data)=>{setPinDetail(data[0])
            if(data[0])
            {
                query= pinDetailMorePinQuery(data[0])
                client.fetch(query).then((response)=>{setPins(response)})
            }
            })
        }
    }

    useEffect(()=>
    {
        fetchPinDetail()
    },[pinId])

    if(!pinDetail) return <Spinner  message="Loading Pin..."/>

    return (
        <>
        {pinDetail && (
        <div className="flex xl-flex-row flex-col m-auto bg-white " style={{maxWidth:'1500px', borderRadius:'30px'}}>
            <div className="flex justify-center items-center md:items-start flex-initial">
                <img src={pinDetail?.image && urlFor(pinDetail.image).url()} alt="image" className="rounded-t-3xl rounded-b-lg"/>
            </div>
            <div className="w-full p-5 flex-1 xl:min-w-620">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                        <a
                            href={`${pinDetail.image?.asset?.url}?dl=`}
                            download
                            onClick={(e) =>
                            {
                                e.stopPropagation();
                            }}
                            className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                        >
                            <MdDownloadForOffline />
                        </a>
                    </div>
                    <a
                        href={`${pinDetail.destination}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {pinDetail.destination}
                    </a>
                </div>
                <div>
                    <h1 className="text-3xl font-bold break-words mt-3">{pinDetail.title}</h1>
                    <p className="text-xl font-base break-words mt-3">{pinDetail.about}</p>
                </div>
                <Link to={`/user-profile/${pinDetail.postedBy?._id}`} className="flex gap-2 mt-5 bg-white rounded-lg items-center">
                    <img
                        className="w-8 h-8 rounded-full object-cover"
                        src={pinDetail.postedBy?.image}
                        alt="user"
                    />
                    <p className="font-semibold capitalize">{pinDetail.postedBy?.userName}</p>
                </Link>
                <h2 className="text-3xl font-bold break-words mt-5">Comments</h2>
                <div className="max-h-370 overflow-y-auto">
                    {pinDetail?.comments?.map((comment,i) =>(
                        <div className="flex gap-2 mt-5 items-center bg-white rounded-lg" key={i}>
                            <img src={comment.postedBy.image} className ="w-10 h-10 rounded-full cursor-pointer" alt="user-profile" />
                            <div className="flex flex-col">
                                <p className="font-bold">{comment.postedBy.userName}</p>
                                <p >{comment.comment}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap mt-6 gap-3 ">
                    <Link to={`/user-profile/${pinDetail.postedBy?._id}`} >
                        <img
                            className="w-8 h-8 rounded-full object-cover"
                            src={pinDetail.postedBy?.image}
                            alt="user"
                        />
                    </Link>
                    <input className="flex-1 border-gray-200 outline-none border-2 p-2 rounded-2xl focus:border-gray-300 cursor-pointer"
                        type="text" placeholder="Add a comment" value={comment} onChange={(e)=>setComment(e.target.value)}/>
                    <button onClick={addComment} type="button" className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none ">
                        {addingComments ? 'Posting the comment... ':'Comment'}
                    </button>
                </div>
            </div>
        </div>
    )}
        {pins ?.length > 0 &&
        (
            <>
                <h2 className="font-bold text-center text-2x mt-8 mb-4">More like this</h2>
            </>
        )}
        {pins ?
            (<MasonryLayout pins={pins}/>):
            (<Spinner message="Loading more pins..."/>)
        }
    </>
    )
}
export default PinDetail

