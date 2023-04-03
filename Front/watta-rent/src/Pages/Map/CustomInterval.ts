import {useRef, useEffect} from "react"

export default function useInterval(callback:()=>void, delay:number | null) {
    const savedCallback = useRef<typeof callback>(callback);
    
    useEffect(()=>{
      savedCallback.current = callback;
    },[callback]);
    
    useEffect(()=>{
      const tick = () => {
        savedCallback.current();
      }
  
      if(delay !== null){
        let interval = setInterval(tick, delay);
        return () => clearInterval(interval);
      }
    },[delay])
  }