import { useState } from "react";

import CharacterForm from "./components/CharacterForm";
import CharacterList from "./components/CharacterList";

function App() {
  const [activeTab, setActiveTab] = useState("create");
  const [listVersion, setListVersion] = useState(0);

  const handleCharacterCreated = () => {
    setListVersion((current) => current + 1);
    setActiveTab("list");
  };

  const tabStyle = (tab) =>
    `rounded-lg px-4 py-3 text-sm font-semibold transition ${
      activeTab === tab
        ? "border border-[#806442] bg-[#493726] text-[#e8d5ad] shadow"
        : "border border-transparent text-[#78664c] hover:bg-[#d9c9a8]"
    }`;

  return (
    <main className="min-h-screen bg-[#e8dcc1] px-4 py-12 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#8b7048]">
            Chronicles of Adventure
          </p>
          <h1 className="font-serif text-4xl font-bold text-[#382b20] sm:text-5xl">
            Taverna do Aventureiro
          </h1>
          <div className="mx-auto my-5 h-px w-32 bg-[#a88b5c]" />
          <p className="mx-auto max-w-md text-sm leading-relaxed text-[#78664c]">
            Cada grande aventura começa com um personagem. Registre seu herói e
            prepare-se para sua jornada.
          </p>
        </header>

        <nav
          aria-label="Navegação de personagens"
          className="mb-5 grid grid-cols-2 gap-2 rounded-xl border border-[#c4b18c] bg-[#ded0b2] p-2"
        >
          <button
            type="button"
            className={tabStyle("create")}
            aria-current={activeTab === "create" ? "page" : undefined}
            onClick={() => setActiveTab("create")}
          >
            Criar personagem
          </button>
          <button
            type="button"
            className={tabStyle("list")}
            aria-current={activeTab === "list" ? "page" : undefined}
            onClick={() => setActiveTab("list")}
          >
            Personagens
          </button>
        </nav>

        {activeTab === "create" ? (
          <CharacterForm onCreated={handleCharacterCreated} />
        ) : (
          <CharacterList key={listVersion} />
        )}

        <footer className="mt-8 text-center">
          <p className="font-serif text-sm italic text-[#927e5d]">
            "Que os caminhos sejam favoráveis e as histórias memoráveis."
          </p>
        </footer>
      </div>
    </main>
  );
}

export default App;
