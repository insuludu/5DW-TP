import Image, { StaticImageData } from "next/image";
import styles from "../styles/page.module.css";

import Alexis from "../images/Alexis.jpg";
import Justin from "../images/Justin.jpg";
import Jacob from "../images/Jacob.jpg";
import Simon from "../images/Simon.jpg";
import Alexandre from "../images/template-image.png";
import Stephane from "../images/Stephane.jpg";

class Person {
    name: string;
    image: StaticImageData;
    titre: string;
    text: string;

    constructor(name: string, image: StaticImageData, titre: string, text: string) {
        this.name = name;
        this.image = image;
        this.titre = titre;
        this.text = text;
    }
}

const teams: Person[] = [
    new Person("Alexis Bergeron", Alexis, "Artisant", "J'ai rejoint cette entreprise pour mettre mes compétences artistiques au service de l'originalité dévouée de cette entreprise."),
    new Person("Justin Dubois", Justin, "Visionnaire", "Tout a commencé lorsqu'une figurine de Dr. Strange est tombée dans le fourneau et en est ressortie sous la forme de Jabba le Hutt. C'est à ce moment-là que m'est venue l'idée de créer moi-même cette figurine"),
    new Person("Jacob Manseau", Jacob, "Responsable marketing", "Je travaille pour que nos jouets soient connus partout, et pour voler discrètement la place des géants du secteur."),
    new Person("Simon Déry", Simon, "Ingénieur web", "En tant qu'ingénieur web, je souhaite contribuer à créer des expériences numériques innovantes qui reflètent l'esprit ludique et original de cette entreprise."),
    new Person("Alexandre Chagnon", Alexandre, "Comptable", "Mon travail consiste à jongler avec les chiffres pour que l'entreprise prospère… et que nos méthodes d'optimisation fiscale restent invisibles."),
    new Person("Stéphane Lalondre", Stephane, "PDG", "Pendant qu'ils s'occupent des détails, je m'occupe de ce qui compte vraiment : mes loisirs et mes comptes en banque."),
];

export default function Team() {
    return (
        <div>
            <div className={` text-light row`}>
                {
                    teams.map((element, index) => (
                        <div key={`${index}`} className={` col-lg-4 col-md-6 col-sm-12 mt-5 `}>
                            <div className={`rounded-5 overflow-hidden`}>
                                <div style={{ height: "600px", position: "relative" }} >
                                    <Image
                                        src={element.image}
                                        alt={"Picture of the author"}
                                        fill
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>
                                <div className={`p-3 ${styles.backgroundPrimary}`} style={{ height: "300px" }}>
                                    <h4 className={` text-center`}> {element.titre} </h4>
                                    <p>{element.text}</p>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}

