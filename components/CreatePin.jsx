import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {client} from '../client'
import Spinner from './Spinner'
import {categories} from "../utils/data";
import {AiOutlineCloudUpload, MdDelete} from "react-icons/all";
const CreatePin=({user})=>
{
    const [title, setTitle]= useState('')
    const [about, setAbout]= useState('')
    const [destination, setDestination]= useState('')
    const [loading, setLoading]= useState(false)
    const [fields, setFields]= useState(false)
    const [category, setCategory]= useState(null)
    const [imageAsset, setImageAsset]= useState(null)
    const [wrongImageType, setWrongImageType]= useState(null)

    const navigate=useNavigate()

    const uploadImage=(e)=>
    {
        const {type,name} = e.target.files[0]
        if(type ==='image/png'|type ==='image/svg'|type ==='image/jpg'||type ==='image/gif'||type ==='image/jpeg')
        {
            setLoading(true)
            setWrongImageType(false)
            client.assets
                .upload('image', e.target.files[0], {contentType: type, filename: name})
                    .then((document) =>
                    {
                        setImageAsset(document);
                        setLoading(false)
                     })
                    .catch((error) =>
                    {
                        console.log(error)
                    })
        }
        else setWrongImageType(true)
    }
    const savedPin=()=>
    {
        if(title &&about && destination && imageAsset?._id && category)
        {
            const doc =
                {
                    _type: 'pin',
                    title,
                    about,
                    destination,
                    category,
                    userId:user._id,
                    image:
                    {
                        _type: 'image',
                        asset:{_type:'reference', _ref: imageAsset?._id}
                    },
                    postedBy:{_type:'postedBy', _ref: imageAsset?._id},

                }
            client.create(doc).then(()=>{navigate('/')})
        }
        else
        {
            setFields(true)
            setTimeout(()=>setFields(false),2000)
        }
    }
    return (
        <div className="flex flex-col justify-center items-center">
            {fields && (<p className="text-red-500 text-xl transition-all duration-150 ease-in-out">Please fill all the fields</p>)}
            <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 lg:w-4/5 w-full">
                <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
                    <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
                        {loading && (<Spinner/>)}
                        {wrongImageType &&( <p>Wrong image type</p>)}
                        {!imageAsset ?
                            (<label>
                                <div className="flex justify-center items-center flex-col h-full">
                                    <div className="flex flex-col justify-center items-center">
                                        <p className="text-bold text-2xl">
                                            <AiOutlineCloudUpload/>
                                        </p>
                                        <p className="text-bold text-2xl">Click to upload</p>
                                    </div>
                                    <p className="mt-32 text-gray-400">
                                        Recommendation: Use high quality JPG, SVG, PNG or GIF less 20MB
                                    </p>
                                </div>
                                <input type="file" name="upload-image" onChange={uploadImage} className="w-0 h-0"/>
                            </label>):
                            (<div className="relative h-full">
                                <img src={imageAsset?.url} alt="Uploaded image" className="w-full h-full"/>
                                <button type="button" className="absolute bottom-3 right-3 padding-3">
                                    <MdDelete/>
                                </button>
                            </div>)
                          }
                    </div>
                </div>


                <div className="flex flex-1 flex-col ga-6 lg:pl-5 mt-5 w-full">
                    <input
                        type="text"
                        value={title}
                        onChange={(e)=>setTitle(e.target.value)}
                        placeholder="Add your Title here"
                        className="outline-one text-2xl font-bold border-b-2 border-gray-200 p-2"
                    />
                    {user &&(
                        <div className="flex gap-2 my-2 items-center bg-white rounded-lg">
                            <img src={user?.image} className="w-10 h-10 rounded-full" alt="user"/>
                            <p className="font-bold ">{user?.userName}</p>
                        </div>
                    )}
                    <input
                        type="text"
                        value={about}
                        onChange={(e)=>setAbout(e.target.value)}
                        placeholder="What's the post for?"
                        className="outline-one text-base sm:text-lg border-b-2 border-gray-200 p-2"
                    />
                    <input
                        type="text"
                        value={destination}
                        onChange={(e)=>setDestination(e.target.value)}
                        placeholder="Add a destination link"
                        className="outline-one text-base sm:text-lg border-b-2 border-gray-200 p-2"
                    />
                    <div className="flex flex-col">
                        <div>
                            <p className="mb-2 font-semibold text-lg sm:text-xl">Choose the pin category</p>
                            <select
                                onChange={(e)=>setCategory(e.target.value)}
                                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
                            >
                                <option value="other" className="bg-white">Select Category</option>
                                {categories.map((category )=>(
                                    <option key={category._id} value={category.name} className="text-base outline-none border-0 capitalize bg-white text-black ">{category.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end items-end mt-5 ">
                            <button
                                type="button"
                                onClick={savedPin}
                                className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
                            >
                                Save pin
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CreatePin
