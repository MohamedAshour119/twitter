import {HiMiniXMark} from "react-icons/hi2";
import {TbCameraPlus} from "react-icons/tb";
import {Dispatch, MouseEventHandler, SetStateAction, useContext, useEffect, useRef} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import Select from "react-select";

interface Props {
    setIsShowEditInfoModel: Dispatch<SetStateAction<boolean>>
}
function EditProfileModel(props: Props) {

    const { user, baseUrl } = useContext(AppContext)


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


    return (
        <div ref={editProfileInfoModel} className={`fixed z-[250] w-1/3 bg-black p-4 mt-20 text-neutral-200 rounded-2xl`}>
            <div className={`flex items-center justify-between`}>
                <div className={`flex items-center gap-x-6`}>
                    <div
                        onClick={() => props.setIsShowEditInfoModel(false)}
                        className="cursor-pointer bg-neutral-950 hover:bg-neutral-900 text-2xl flex justify-center items-center rounded-full h-9 w-9 transition">
                        <HiMiniXMark/>
                    </div>
                    <span className={`text-xl font-semibold`}>Edit profile</span>
                </div>
                <button className={`mx-2 bg-white hover:bg-zinc-200 transition text-black px-5 py-2 rounded-full`}>Save</button>
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
                        />
                    </label>
                </div>
            </div>
        {/*  More info  */}
            <div className={`mt-24 flex flex-col gap-y-3`}>
                <input
                    maxLength={50}
                    name={`display_name`}
                    // value={userCredentials?.username}
                    // onChange={handleInputsChange}
                    className={`h-14 w-full border border-zinc-600 focus:placeholder:text-sky-600 ring-sky-600 focus:border-sky-600 rounded bg-transparent px-3 placeholder:text-zinc-500 placeholder:absolute focus:outline-0 focus:ring-1 `}
                    type="text"
                    placeholder="Display name"
                    // disabled={isLoading}
                    autoComplete="one-time-code"
                />

                <textarea
                    maxLength={160}
                    name={`bio`}
                    // value={userCredentials?.username}
                    // onChange={handleInputsChange}
                    className={`h-14 w-full min-h-32 max-h-40 border border-zinc-600 focus:placeholder:text-sky-600 ring-sky-600 focus:border-sky-600 rounded bg-transparent px-3 placeholder:mt-4 placeholder:text-zinc-500 placeholder:absolute focus:outline-0 focus:ring-1 `}
                    placeholder="Bio"
                    // disabled={isLoading}
                    autoComplete="one-time-code"
                />

            {/*  Birth date  */}
                <div className={`text-zinc-500`}>
                    <div>
                        Birth date
                    </div>
                    <div className={`text-neutral-200 text-xl`}>September 11, 2001</div>

                    <div className={`grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr] gap-y-4 md:gap-y-0 gap-x-3 mt-3`}>
                        <Select
                            options={months}
                            isDisabled={isLoading}
                            placeholder={'Month'}
                            onChange={handleSelectedMonthChange}
                            styles={styles}
                        />
                        <Select
                            options={days}
                            isDisabled={isLoading}
                            placeholder={'Day'}
                            noOptionsMessage={() => 'Select Month'}
                            onChange={handleDaySelectedChange}
                            styles={styles}
                        />

                        <Select
                            options={years}
                            isDisabled={isLoading}
                            placeholder={'Year'}
                            onChange={handleYearSelectedChange}
                            styles={styles}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditProfileModel
