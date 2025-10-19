export function ProductEnumToString(enumNumber : number) {

    if (enumNumber == 0)
        return "Disponible";
    
    if (enumNumber == 1)
        return "Indisponible";

    if (enumNumber == 2)
        return "Rupture de stock";

    if (enumNumber == 3)
        return "Bientôt Disponible";
}