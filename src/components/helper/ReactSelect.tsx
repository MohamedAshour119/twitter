import Select, {SingleValue} from "react-select";
import {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import {EditUserProfile, Gender, RegisterUser} from "../../Interfaces.tsx";

interface Month {
    value: string
    label: string
    days: number
}

interface Day {
    value: string;
    label: string;
}

interface Year extends Day{}

interface Props {
    isLoading?: boolean
    setUserCredentials?: Dispatch<SetStateAction<RegisterUser>>
    selectedGender?: Gender | null
    userInfo?: EditUserProfile
    setUserInfo?: Dispatch<SetStateAction<EditUserProfile>>
}
function ReactSelect(props: Props) {

    const {formErrors, styles} = useContext(AppContext)

    const months: Month[] = [
        {value: "january", label: "January", days: 31},
        {value: "february", label: "February", days: 28},
        {value: "march", label: "March", days: 31},
        {value: "april", label: "April", days: 30},
        {value: "may", label: "May", days: 31},
        {value: "june", label: "June", days: 30},
        {value: "july", label: "July", days: 31},
        {value: "august", label: "August", days: 31},
        {value: "september", label: "September", days: 30},
        {value: "october", label: "October", days: 31},
        {value: "november", label: "November", days: 30},
        {value: "december", label: "December", days: 31},
    ]

    const [selectedDay, setSelectedDay] = useState<Day | null>(null)
    const [selectedMonth, setSelectedMonth] = useState<Month | null>(null)
    const [selectedYear, setSelectedYear] = useState<Year | null>(null)

    // Handle number of days based on the selected month
    const days: Day[] = [];

    if (selectedMonth?.days) {
        for (let i: number = 1; i <= selectedMonth.days; i++) {
            days.push({
                value: `${i}`,
                label: `${i}`,
            })
        }
    }

    // Handle years (last 120 year)
    const startYear: number = new Date().getFullYear() - 120;
    const currentYear: number = new Date().getFullYear();

    const years: Year[] = []

    for (let i: number = currentYear; i >= startYear; i--) {
        years.push({
            value: `${i}`,
            label: `${i}`,
        })
    }

    // Set the three selected values to 'birth_date' in the userCredentials state
    useEffect(() => {
        props.setUserCredentials && props.setUserCredentials(prevUserCredentials => ({
            ...prevUserCredentials,
            gender: `${props.selectedGender?.value}`,
            date_birth: `${selectedYear?.value}-${selectedMonth?.label}-${selectedDay?.value}`
        }))
    }, [selectedDay, selectedMonth, selectedYear, props.selectedGender])

    // Handle selected options
    type OptionType = Gender | Month;
    const handleSelectedMonthChange = (selectedOption: SingleValue<OptionType>): void => {
        if (selectedOption) {
            setSelectedMonth(selectedOption as Month);
        } else {
            setSelectedMonth(null);
        }
    }

    const handleDaySelectedChange = (selectedOption: SingleValue<OptionType>): void => {
        if (selectedOption) {
            setSelectedDay(selectedOption as Day);
        } else {
            setSelectedDay(null);
        }
    }

    const handleYearSelectedChange = (selectedOption: SingleValue<OptionType>): void => {
        if (selectedOption) {
            setSelectedYear(selectedOption as Year);
        } else {
            setSelectedYear(null);
        }
    }


    return (
        <>
            <div className={`grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr] gap-y-4 md:gap-y-0 gap-x-3 mt-3 text-neutral-200`}>
                <Select
                    options={months}
                    isDisabled={props.isLoading}
                    placeholder={'Month'}
                    onChange={handleSelectedMonthChange}
                    styles={styles}
                />
                <Select
                    options={days}
                    isDisabled={props.isLoading}
                    placeholder={'Day'}
                    noOptionsMessage={() => 'Select Month'}
                    onChange={handleDaySelectedChange}
                    styles={styles}
                />

                <Select
                    options={years}
                    isDisabled={props.isLoading}
                    placeholder={'Year'}
                    onChange={handleYearSelectedChange}
                    styles={styles}
                />
            </div>
            {
                formErrors?.birth_date &&
                <p className={'text-red-500 font-semibold'}>{formErrors?.birth_date}</p>
            }
        </>

    )
}

export default ReactSelect
