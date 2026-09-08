'use client';
import { Component, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Group, MathUtils } from 'three';
import type { MotionValue } from 'framer-motion';
/** Abstract 3D lighting only. Car imagery is photographic, not a 3D model. */
function Ribbons({progress}:{progress:MotionValue<number>}){
 const group=useRef<Group>(null);
 useFrame(({pointer,clock})=>{if(!group.current)return;const p=progress.get();group.current.rotation.y=MathUtils.lerp(group.current.rotation.y,pointer.x*.08+p*.24,.05);group.current.rotation.z=-.2+p*.3;group.current.position.x=Math.sin(clock.elapsedTime*.12)*.12;group.current.position.z=p*1.2});
 return <group ref={group}>{Array.from({length:7},(_,i)=><mesh key={i} position={[(i-3)*1.4,-2.8+(i%2)*.2,-i*.65]} rotation={[Math.PI/2,0,.3]}><torusGeometry args={[4+i*.35,.006,4,100,Math.PI*1.3]}/><meshBasicMaterial color={i===6?'#c32536':'#08bcec'} transparent opacity={.08+(i%3)*.025} depthWrite={false}/></mesh>)}</group>
}
class WebGLBoundary extends Component<{children:React.ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true}};render(){return this.state.failed?null:this.props.children}}
export default function LightField({progress}:{progress:MotionValue<number>}){
 const container=useRef<HTMLDivElement>(null);const [visible,setVisible]=useState(false);const [supported,setSupported]=useState(false);
 useEffect(()=>{const canvas=document.createElement('canvas');const gl=canvas.getContext('webgl2');setSupported(!!gl);gl?.getExtension('WEBGL_lose_context')?.loseContext();const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting));if(container.current)observer.observe(container.current);return()=>observer.disconnect()},[]);
 return <div ref={container} className="light-field" aria-hidden="true">{supported&&<WebGLBoundary><Canvas dpr={[1,1.5]} frameloop={visible?'always':'never'} camera={{position:[0,0,7],fov:45}} gl={{alpha:true,antialias:false,powerPreference:'low-power'}} fallback={null}><Ribbons progress={progress}/></Canvas></WebGLBoundary>}</div>
}
