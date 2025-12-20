export default function ErrorPage() {

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#f5f5f5",
            textAlign: "center",
            padding: "0 20px",
            fontFamily: "Arial, sans-serif"
        }}>
            <h1 style={{ fontSize: "6rem", margin: 0, color: "#333" }}>Oops!
                <p style={{ fontSize: "1.5rem", margin: "20px 0", color: "#666" }}>
                    Une erreur est survenue.
                </p>
            </h1>
                <button><a  href="/home">Retour a la page d'accueil</a></button>
        </div>
    );
}