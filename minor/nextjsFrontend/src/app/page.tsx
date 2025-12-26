import Image from "next/image";
import { motion } from 'framer-motion';
import Navbar from "@/components/ui/mainComponents/NavBar";
import Front from "@/components/ui/mainComponents/Front";
import ResultsShowcase from "@/components/ui/mainComponents/ResultsShowcase";
import FeatureShowcase from "@/components/ui/mainComponents/FeaturesShowcase";
export default function Home() {
  return (
    <div>
      <Navbar/>
      <Front/>
      <FeatureShowcase/>
      <ResultsShowcase/>
    </div>
    // <motion.div initial={{ opacity: 0, y: 50 }}  
    // animate={{ opacity: 1, y: 0 }}
    // transition={{ duration: 0.6, ease: 'easeOut' }} className="dark flex flex-col">
    //   <Navbar/>
    // </motion.div>
  );
}
