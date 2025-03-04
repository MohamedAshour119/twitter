import  {useEffect, useState} from 'react'

function useDebounce(value: string, delay: number = 500) {

    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const timer = setTimeout( () => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(timer)
        }

    }, [value]);

    return debouncedValue;
}

export default useDebounce
