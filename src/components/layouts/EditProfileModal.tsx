import {HiMiniXMark} from "react-icons/hi2";
import {TbCameraPlus} from "react-icons/tb";
import {ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import ReactSelect from "../helper/ReactSelect.tsx";
import {EditUserProfile, FormErrorsDefaultValues, UserInfo} from "../../Interfaces.tsx";
import ApiClient from "../ApiClient.tsx";
import {toast} from "react-toastify";
import {toastStyle} from "../helper/ToastifyStyle.tsx";
import {TweetContext} from "../appContext/TweetContext.tsx";

interface Props {
    setIsShowEditInfoModal: Dispatch<SetStateAction<boolean>>
    isShowEditInfoModal: boolean
    setUserInfo: Dispatch<SetStateAction<UserInfo | undefined>>
}
function EditProfileModal(props: Props) {

    const { user, setUser, formErrors, setFormErrors } = useContext(AppContext)
    const { setUserInfo } = useContext(TweetContext)

    const [editUserInfo, setEditUserInfo] = useState<EditUserProfile>({
        display_name: user?.user_info.display_name ? user.user_info.display_name : '',
        bio: user?.user_info.bio ? user.user_info.bio : '',
        password: '',
        password_confirmation: '',
        birth_date: '',
        avatar: '',
        cover: '',
    })

    const editProfileInfoModal = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!editProfileInfoModal.current?.contains(e.target as Node)) {
                addAnimation()
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, files } = e.target as HTMLInputElement & { files: FileList };
        if (name !== 'avatar' && name !== 'cover') {
            setEditUserInfo(prevUserInfo => ({
                ...prevUserInfo,
                [name]: value
            }));
        } else if (name === 'avatar') {
            if (files && files.length > 0) {
                const file = files[0];
                setEditUserInfo(prevUserInfo => ({
                    ...prevUserInfo,
                    avatar: file
                }));
            }
        } else {
            if (files && files.length > 0) {
                const file = files[0];
                setEditUserInfo(prevUserInfo => ({
                    ...prevUserInfo,
                    cover: file
                }));
            }
        }
    };

    const saveRequest = () => {

        const formData = new FormData();
        formData.append('display_name', editUserInfo.display_name);
        formData.append('bio', editUserInfo.bio);
        formData.append('password', editUserInfo.password);
        formData.append('password_confirmation', editUserInfo.password_confirmation);
        editUserInfo.birth_date === 'undefined-undefined-undefined' ? formData.append('birth_date', '') : formData.append('birth_date', editUserInfo.birth_date)
        formData.append('avatar', editUserInfo.avatar as Blob)
        formData.append('cover', editUserInfo.cover as Blob)

        ApiClient().post(`/update-user`, formData)
            .then((res) => {
                setUser(prevState => ({
                    ...prevState,
                    ...res.data.data
                }))
                setUserInfo(res.data.data)
                addAnimation()
                props.setUserInfo(res.data.data)
            })
            .catch(err => {
                setFormErrors(err.response.data.errors)
                toast.error('Invalid info entered', toastStyle)
            })
    }

    const addAnimation = () => {
        editProfileInfoModal.current?.classList.contains('animate-slide-down')
            ? editProfileInfoModal.current?.classList.add('close-slide-down')
            : editProfileInfoModal.current?.classList.add('animate-slide-down')
        setTimeout(() => {
            props.setIsShowEditInfoModal(false)
        }, 200)
    }

    // Remove uploaded image
    const removeUploadedFile = () => {
        setEditUserInfo(prevState => ({
            ...prevState,
            cover: ''
        }))
    }

    useEffect(() => {
        setFormErrors(FormErrorsDefaultValues)
    }, [props.isShowEditInfoModal]);

    const checkIfAnyChangesHappened = editUserInfo.display_name !== '' || editUserInfo.bio !== '' || editUserInfo.birth_date !== 'undefined-undefined-undefined' || editUserInfo.avatar !== '' || editUserInfo.cover !== '' || editUserInfo.password !== '' || editUserInfo.password_confirmation !== ''

    const handleSubmit = () => {
        console.log(editUserInfo)
        if (checkIfAnyChangesHappened) {
            saveRequest()
        }
        addAnimation()
    }

    return (
        <>
            <div ref={editProfileInfoModal}
                 className={`fixed z-[310] h-[37rem] overflow-y-scroll left-6 md:left-auto w-[95%] md:w-[75%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] bg-black p-4 mt-20 text-neutral-200 rounded-2xl animate-slide-down`}
            >

                <div className={`flex items-center justify-between`}>
                    <div className={`flex items-center gap-x-6`}>
                        <div
                            onClick={addAnimation}
                            className="cursor-pointer bg-neutral-950 hover:bg-neutral-900 text-2xl flex justify-center items-center rounded-full h-9 w-9 transition">
                            <HiMiniXMark/>
                        </div>
                        <span className={`text-xl font-semibold`}>Edit profile</span>
                    </div>
                    <button
                        type={'submit'}
                        onClick={handleSubmit}
                        className={`mx-2 bg-white hover:bg-zinc-200 transition text-black px-5 py-2 rounded-full`}>Save</button>
                </div>

                    {/*  Cover section  */}
                    <div className={`my-8 relative`}>
                        {formErrors?.cover &&
                            <p className={'text-red-500 font-semibold'}>{formErrors?.cover}</p>}
                        <div className={`bg-[#333639] rounded h-48 relative`}>
                            {
                                user?.user_info.cover && !editUserInfo.cover &&
                                <img
                                    src={user.user_info.cover}
                                    alt="cover"
                                    className={`w-full object-cover h-48 brightness-75`}
                                />
                            }

                            {/* Preview uploaded image */}
                            {editUserInfo?.cover &&
                                <div
                                    className={`${!editUserInfo.cover ? 'invisible' : 'visible border-b w-full pb-3 border-zinc-700/70 bg-[#333639] rounded h-48'}`}>
                                    <div onClick={removeUploadedFile}
                                         className="absolute right-2 top-2 p-1 cursor-pointer hover:bg-neutral-700 bg-neutral-600/30 flex justify-center items-center rounded-full transition">
                                        <HiMiniXMark className={`size-6`}/>
                                    </div>
                                    <img className={`w-full object-cover h-48 brightness-75`}
                                         src={editUserInfo.cover ? URL.createObjectURL(editUserInfo.cover as File) : ''}
                                         alt="cover"/>
                                </div>

                            }
                            <label htmlFor={`upload_cover`} className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-950 cursor-pointer hover:bg-neutral-900 text-2xl flex justify-center items-center rounded-full h-9 w-9 transition`}>
                                <TbCameraPlus />
                                <input
                                    id={`upload_cover`}
                                    type="file"
                                    className={`hidden`}
                                    name={'cover'}
                                    value={editUserInfo.cover ? '' : undefined}
                                    onChange={handleInputChange}
                                />
                            </label>
                        </div>
                        {/*  Avatar  */}

                        <div className={`absolute top-2/3 left-2 border-4 border-black rounded-full`}>
                            {user?.user_info.avatar && !editUserInfo.avatar &&
                                <img src={user?.user_info.avatar}
                                     alt="avatar"
                                     className={`object-cover w-32 h-32 rounded-full brightness-75 ${!user ? 'invisible' : ''}`}
                                />
                            }

                            {editUserInfo.avatar &&
                                <img className={`object-cover w-32 h-32 rounded-full brightness-75 ${!user ? 'invisible' : ''}`}
                                     src={editUserInfo.avatar ? URL.createObjectURL(editUserInfo.avatar as File) : ''}
                                     alt="cover"
                                />
                            }

                            {(!user?.user_info.avatar && !editUserInfo.avatar) &&
                                <img src={`/profile-default-svgrepo-com.svg`}
                                     alt="default-avatar"
                                     className={`object-cover w-32 h-32 rounded-full brightness-75 bg-[#121416] ${!user ? 'invisible' : ''}`}
                                />
                            }
                            <label htmlFor={`upload_avatar`}
                                   className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-950 cursor-pointer hover:bg-neutral-900 text-2xl flex justify-center items-center rounded-full h-9 w-9 transition`}>
                                <TbCameraPlus/>
                                <input
                                    id={`upload_avatar`}
                                    type="file"
                                    className={`hidden`}
                                    name={'avatar'}
                                    value={editUserInfo.avatar ? '' : undefined}
                                    onChange={handleInputChange}
                                />
                            </label>

                            {formErrors?.avatar &&
                                <p className={'text-red-500 font-semibold absolute w-[30rem]'}>{formErrors?.avatar}</p>}
                        </div>

                    </div>
                    {/*  More info  */}
                    <div className={`mt-32 flex flex-col gap-y-1`}>
                        <div className={`text-zinc-500 font-semibold`}>Display name:</div>
                        <input
                            maxLength={30}
                            name={`display_name`}
                            value={editUserInfo.display_name}
                            onChange={handleInputChange}
                            className={`${formErrors?.display_name?.length > 0 ? 'border-red-600 focus:placeholder:text-red-600 focus:border-red-600 ring-red-600' : ' border-zinc-600 focus:placeholder:text-sky-600 ring-sky-600 focus:border-sky-600'} h-14 w-full border rounded bg-transparent px-3 placeholder:text-zinc-500 placeholder:absolute focus:outline-0 focus:ring-1 `}
                            type="text"
                            placeholder="Display name"
                            autoComplete="one-time-code"
                        />
                        {formErrors?.display_name &&
                            <p className={'text-red-500 font-semibold'}>{formErrors?.display_name}</p>}
                        <div className={`text-zinc-500 font-semibold mt-5`}>Bio:</div>
                        <textarea
                            maxLength={250}
                            name={`bio`}
                            value={editUserInfo.bio}
                            onChange={handleInputChange}
                            className={`${formErrors?.bio?.length > 0 ? 'border-red-600 focus:placeholder:text-red-600 focus:border-red-600 ring-red-600' : ' border-zinc-600 focus:placeholder:text-sky-600 ring-sky-600 focus:border-sky-600'} resize-none min-h-48 w-full border rounded bg-transparent py-3 px-3 placeholder:text-zinc-500 placeholder:absolute focus:outline-0 focus:ring-1 `}
                            placeholder="Bio"
                            autoComplete="one-time-code"
                        />
                        {formErrors?.bio &&
                            <p className={'text-red-500 font-semibold'}>{formErrors?.bio}</p>}

                        {/*  Birth date  */}
                        <div className={`text-zinc-500`}>
                            <div className={`mt-5 font-semibold`}>Birth date</div>
                            <div className={`text-neutral-200 text-xl`}>{user?.user_info.birth_date}</div>

                            <ReactSelect userInfo={editUserInfo} setUserInfo={setEditUserInfo}/>
                        </div>
                        <div className={`mt-5 font-semibold text-zinc-500`}>Security</div>
                        <input
                            maxLength={30}
                            name={`password`}
                            value={editUserInfo.password}
                            onChange={handleInputChange}
                            className={`${formErrors?.password?.length > 0 ? 'border-red-600 focus:placeholder:text-red-600 focus:border-red-600 ring-red-600' : ' border-zinc-600 focus:placeholder:text-sky-600 ring-sky-600 focus:border-sky-600'} h-14 w-full border rounded bg-transparent px-3 placeholder:text-zinc-500 placeholder:absolute focus:outline-0 focus:ring-1 `}
                            type="password"
                            placeholder="Password"
                            autoComplete="one-time-code"
                        />
                        {formErrors?.password &&
                            <p className={'text-red-500 font-semibold'}>{formErrors?.password[0]}</p>}
                        <input
                            maxLength={30}
                            name={`password_confirmation`}
                            value={editUserInfo.password_confirmation}
                            onChange={handleInputChange}
                            className={`${formErrors?.password_confirmation?.length > 0 ? 'border-red-600 focus:placeholder:text-red-600 focus:border-red-600 ring-red-600' : ' border-zinc-600 focus:placeholder:text-sky-600 ring-sky-600 focus:border-sky-600'} h-14 w-full border rounded bg-transparent px-3 placeholder:text-zinc-500 placeholder:absolute focus:outline-0 focus:ring-1 `}
                            type="password"
                            placeholder="Password confirmation"
                            autoComplete="one-time-code"
                        />
                        {formErrors?.password_confirmation &&
                            <p className={'text-red-500 font-semibold'}>{formErrors?.password_confirmation}</p>}
                    </div>

            </div>
        </>

    )
}

export default EditProfileModal
