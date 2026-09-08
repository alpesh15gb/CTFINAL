'use client';
import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, useScroll, useSpring, useTransform, useMotionTemplate, useMotionValueEvent } from 'framer-motion';
import { useCinematicMotion } from './motion-provider';
const LightField=dynamic(()=>import('./light-field'),{ssr:false});
export function Hero(){
 const ref=useRef<HTMLElement>(null);const enabled=useCinematicMotion();
 const {scrollYProgress}=useScroll({target:ref,offset:['start start','end end']});
 const progress=useSpring(scrollYProgress,{stiffness:130,damping:32,restDelta:.001});
 const scale=useTransform(progress,[0,1],[1,1.65]);const x=useTransform(progress,[0,1],['0%','-7%']);
 const titleLeft=useTransform(progress,[0,.4],['0%','-30%']);const titleRight=useTransform(progress,[0,.4],['0%','30%']);
 const titleOpacity=useTransform(progress,[0,.05,.33],[1,1,0]);const copyOpacity=useTransform(progress,[0,.22],[1,0]);
 const outroOpacity=useTransform(progress,[.42,.82],[0,1]);const outroScale=useTransform(progress,[.42,.82],[.78,1.07]);
 const sweep=useTransform(progress,[.04,.66],[100,0]);const clipPath=useMotionTemplate`inset(0 ${sweep}% 0 0)`;
 const edge=useTransform(progress,[.04,.66],['0%','100%']);const edgeOpacity=useTransform(progress,[.04,.3,.66],[0,.7,0]);
 const [hidden,setHidden]=useState(false);useMotionValueEvent(progress,'change',v=>setHidden(v>.15));
 return <section className="hero-scroll" id="top" ref={ref}><div className="hero">
  <motion.div className="hero-image" role="img" aria-label="Concept of a performance coupe in a cyan-lit studio" style={enabled?{scale,x,filter:'grayscale(1) brightness(.65)'}:undefined}/>
  <motion.div className="hero-color" aria-hidden="true" style={enabled?{scale,x,clipPath}:{clipPath:'none'}}/>
  <motion.div className="reveal-edge" aria-hidden="true" style={enabled?{left:edge,opacity:edgeOpacity}:undefined}><span>MAKE IT YOURS</span></motion.div>
  <div className="hero-shade"/>{enabled&&<LightField progress={progress}/>}
  <div className="hero-content"><motion.p className="eyebrow" style={enabled?{opacity:titleOpacity}:undefined}><span/> AUTOMOTIVE CUSTOMIZATION · HYDERABAD</motion.p>
  <h1><motion.span className="hero-title-line" style={enabled?{x:titleLeft,opacity:titleOpacity}:undefined}>NOT FOR</motion.span><motion.span className="hero-title-line" style={enabled?{x:titleRight,opacity:titleOpacity}:undefined}>EVERYONE<span className="cyan">.</span></motion.span></h1>
  <motion.div className="hero-bottom" inert={enabled&&hidden} style={enabled?{opacity:copyOpacity}:undefined}><p>For the ones who feel the difference.<br/>Automotive customization. Unmistakably yours.</p><motion.a href="#upgrades" className="button" whileHover={{y:-3}} whileTap={{scale:.97}}>Explore the upgrades <span>↗</span></motion.a></motion.div></div>
  <div className="hero-footer"><a href="#experience" className="scroll-hint"><span className="scroll-line"/> SCROLL TO SHIFT GEARS</a><span>STYLE. SOUND. PERFORMANCE.</span><span className="hero-index">01 <i>/</i> 04</span></div>
  <motion.div className="hero-outro" aria-hidden="true" style={enabled?{opacity:outroOpacity,scale:outroScale}:undefined}><span>BUILT AROUND</span><strong>YOU.</strong></motion.div>
  <motion.div className="hero-rail" aria-hidden="true" style={enabled?{opacity:outroOpacity}:undefined}><span>YOUR VISION</span><i><motion.b style={{scaleX:progress}}/></i><span>YOUR SIGNATURE</span></motion.div><div className="vertical-label">GET YOUR CAR ROLLING IN STYLE</div>
 </div></section>
}
