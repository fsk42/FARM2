import HeaderBox from "@/components/HeaderBox"; // Importiert Header-Komponente

import { getLoggedInUser } from "@/lib/actions/user.actions"; // Holt Daten des angemeldeten Benutzers
import React from "react"; // Importiert React für JSX

const Home = async () => {
  const loggedIn = await getLoggedInUser(); // Abrufen des aktuell angemeldeten Benutzers

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Hallo"
            user={loggedIn?.firstName + " " + loggedIn?.lastName || "Gast"}
            subtext="Erstelle ein neuen Upload."
          />

          <p></p>
        </header>
      </div>
    </section>
  );
};

export default Home; // Exportiert die Komponente
