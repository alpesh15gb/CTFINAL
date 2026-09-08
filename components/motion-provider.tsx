'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { MotionConfig, useReducedMotion } from 'framer-motion';
const MotionContext = createContext(false);
export const useCinematicMotion = () => useContext(MotionContext);
export function MotionProvider({children}:{children:React.ReactNode}) {
 const reduce=useReducedMotion();
 const [tall,setTall]=useState(false);
 useEffect(()=>{const query=matchMedia('(min-height: 651px)');const sync=()=>setTall(query.matches);sync();query.addEventListener('change',sync);return()=>query.removeEventListener('change',sync)},[]);
 const enabled=tall&&!reduce;
 useEffect(()=>{document.body.classList.toggle('scroll-mode',enabled);return()=>document.body.classList.remove('scroll-mode')},[enabled]);
 return <MotionConfig reducedMotion="user"><MotionContext.Provider value={enabled}>{children}</MotionContext.Provider></MotionConfig>;
}
