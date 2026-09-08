import { MotionProvider } from '@/components/motion-provider';
import { Header,Contact,Footer } from '@/components/site-content';
import { Hero } from '@/components/hero';
import { Intro } from '@/components/intro';
import { Journey } from '@/components/journey';
import { Upgrades } from '@/components/upgrades';
import { Navigation } from '@/components/navigation';
export default function Home(){return <MotionProvider><a className="skip-link" href="#upgrades">Skip to upgrades</a><Header/><main><Hero/><Intro/><Journey/><Upgrades/><Contact/></main><Navigation/><Footer/></MotionProvider>}
