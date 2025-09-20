import styles from "../styles/page.module.css";
import MissionSection from "./mission"
import DescriptionSection from "./description"

export default function Home() {
  return (
    <div>
        <div className={`row vh-100`}>
            <MissionSection />
        </div>
        <div className={`row vh-100`}>
            <DescriptionSection />
        </div>
    </div>

  );
}
