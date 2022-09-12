
import {useState, useEffect} from 'react'




export const useWatcher = (callback: Function, deps: any[] = []) => {
    const [hasRendered, setHasRendered] = useState(false)
    useEffect(() => {
      if (hasRendered){
        callback()
      }
      setHasRendered(true)
    }, deps )
  }