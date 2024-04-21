import {HiMiniXMark} from "react-icons/hi2";
import {TbCameraPlus} from "react-icons/tb";
import {ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import ReactSelect from "../helper/ReactSelect.tsx";
import {EditUserProfile} from "../../Interfaces.tsx";
import ApiClient from "../services/ApiClient.tsx";

interface Props {
    setIsShowEditInfoModel: Dispatch<SetStateAction<boolean>>
}
function EditProfileModel(props: Props) {

    const { user, baseUrl } = useContext(AppContext)

    const [userInfo, setUserInfo] = useState<EditUserProfile>({
        display_name: '',
        bio: '',
        password: '',
        password_confirmation: '',
        birth_date: '',
        avatar: '',
        cover: '',
    })

    const editProfileInfoModel = useRef<HTMLDivElement | null>(null); // Specify the type of the ref

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (editProfileInfoModel.current && !editProfileInfoModel.current.contains(e.target as Node)) {
                props.setIsShowEditInfoModel(false);
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
            setUserInfo(prevUserInfo => ({
                ...prevUserInfo,
                [name]: value
            }));
        } else if (name === 'avatar') {
            if (files && files.length > 0) {
                const file = files[0];
                setUserInfo(prevUserInfo => ({
                    ...prevUserInfo,
                    avatar: file
                }));
            }
        } else {
            if (files && files.length > 0) {
                const file = files[0];
                setUserInfo(prevUserInfo => ({
                    ...prevUserInfo,
                    cover: file
                }));
            }
        }
    };

    const saveRequest = () => {

        const formData = new FormData();
        formData.append('display_name', userInfo.display_name);
        formData.append('bio', userInfo.bio);
        formData.append('password', userInfo.password);
        formData.append('password_confirmation', userInfo.password_confirmation);
        formData.append('birth_date', userInfo.birth_date);

        if(userInfo.avatar instanceof File){
            formData.append('avatar', userInfo.avatar as Blob)
        }
        if(userInfo.cover instanceof File){
            formData.append('cover', userInfo.cover as Blob)
        }

        ApiClient().patch('/update-user', formData)
            .then((res) => {
                console.log(res)
            })
            .catch(err => {
                // setSuccessfulRegister(false)
                // setFormErrors(err.response.data.errors)
            })
            // .finally(() => setCreateBtnLoading(false))
    }

    return (
        <div ref={editProfileInfoModel} className={`fixed z-[250] h-[37rem] overflow-y-scroll w-1/3 bg-black p-4 mt-20 text-neutral-200 rounded-2xl`}>
            <div className={`flex items-center justify-between`}>
                <div className={`flex items-center gap-x-6`}>
                    <div
                        onClick={() => props.setIsShowEditInfoModel(false)}
                        className="cursor-pointer bg-neutral-950 hover:bg-neutral-900 text-2xl flex justify-center items-center rounded-full h-9 w-9 transition">
                        <HiMiniXMark/>
                    </div>
                    <span className={`text-xl font-semibold`}>Edit profile</span>
                </div>
                <button onClick={saveRequest} className={`mx-2 bg-white hover:bg-zinc-200 transition text-black px-5 py-2 rounded-full`}>Save</button>
            </div>
        {/*  Cover section  */}
            <div className={`my-8 relative`}>
                <div className={`bg-gray-600 rounded h-48 relative`}>
                    <label htmlFor={`upload_cover`} className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-950 cursor-pointer hover:bg-neutral-900 text-2xl flex justify-center items-center rounded-full h-9 w-9 transition`}>
                        <TbCameraPlus />
                        <input
                            id={`upload_cover`}
                            type="file"
                            className={`hidden`}
                        />
                    </label>
                </div>
            {/*  Avatar  */}
                <div className={`absolute top-2/3 left-2`}>
                    <img src={`${baseUrl}/storage/${user?.avatar}`} alt=""
                         className={`object-cover w-32 h-32 rounded-full brightness-75 ${!user ? 'invisible' : ''}`}/>
                    <label htmlFor={`upload_cover`} className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-950 cursor-pointer hover:bg-neutral-900 text-2xl flex justify-center items-center rounded-full h-9 w-9 transition`}>
                        <TbCameraPlus />
                        <input
                            id={`upload_cover`}
                            type="file"
                            className={`hidden`}
                            name={'cover'}
                            value={userInfo.cover ? '' : undefined}
                            onChange={handleInputChange}
                        />
                    </label>
                </div>
            </div>
        {/*  More info  */}
            <div className={`mt-24 flex flex-col gap-y-3`}>
                <input
                    maxLength={50}
                    name={`display_name`}
                    value={userInfo.display_name}
                    onChange={handleInputChange}
                    className={`h-14 w-full border border-zinc-600 focus:placeholder:text-sky-600 ring-sky-600 focus:border-sky-600 rounded bg-transparent px-3 placeholder:text-zinc-500 placeholder:absolute focus:outline-0 focus:ring-1 `}
                    type="text"
                    placeholder="Display name"
                    autoComplete="one-time-code"
                />

                <textarea
                    maxLength={160}
                    name={`bio`}
                    value={userInfo.bio}
                    onChange={handleInputChange}
                    className={`h-14 w-full min-h-32 max-h-40 border border-zinc-600 focus:placeholder:text-sky-600 ring-sky-600 focus:border-sky-600 rounded bg-transparent px-3 placeholder:mt-4 placeholder:text-zinc-500 placeholder:absolute focus:outline-0 focus:ring-1 `}
                    placeholder="Bio"
                    autoComplete="one-time-code"
                />

            {/*  Birth date  */}
                <div className={`text-zinc-500`}>
                    <div className={`mt-10`}>Birth date</div>
                    <div className={`text-neutral-200 text-xl`}>September 11, 2001</div>

                    <ReactSelect userInfo={userInfo} setUserInfo={setUserInfo}/>
                </div>
                <div className={`mt-10`}>Security</div>
                <input
                    maxLength={30}
                    name={`password`}
                    value={userInfo.password}
                    onChange={handleInputChange}
                    className={`h-14 w-full border border-zinc-600 focus:placeholder:text-sky-600 ring-sky-600 focus:border-sky-600 rounded bg-transparent px-3 placeholder:text-zinc-500 placeholder:absolute focus:outline-0 focus:ring-1 `}
                    type="text"
                    placeholder="Password"
                    autoComplete="one-time-code"
                />

                <input
                    maxLength={30}
                    name={`password_confirmation`}
                    value={userInfo.password_confirmation}
                    onChange={handleInputChange}
                    className={`h-14 w-full border border-zinc-600 focus:placeholder:text-sky-600 ring-sky-600 focus:border-sky-600 rounded bg-transparent px-3 placeholder:text-zinc-500 placeholder:absolute focus:outline-0 focus:ring-1 `}
                    type="text"
                    placeholder="Password confirmation"
                    autoComplete="one-time-code"
                />
            </div>
        </div>
    )
}

export default EditProfileModel
