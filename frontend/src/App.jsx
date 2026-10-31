import CharacterForm from "./components/CharacterForm";

function App() {
  return (
    <main
      className="
            min-h-screen bg-[#e8dcc1]
            px-4 py-12 sm:py-20
        "
    >
      <div className="mx-auto max-w-2xl">
        {/* Cabeçalho */}
        <header className="mb-10 text-center">
          <p
            className="
                        mb-3 text-xs font-bold uppercase
                        tracking-[0.3em] text-[#8b7048]
                    "
          >
            Chronicles of Adventure
          </p>

          <h1
            className="
                        font-serif text-4xl font-bold
                        text-[#382b20] sm:text-5xl
                    "
          >
            Taverna do Aventureiro
          </h1>

          <div
            className="
                        mx-auto my-5 h-px w-32
                        bg-[#a88b5c]
                    "
          />

          <p
            className="
                        mx-auto max-w-md text-sm
                        leading-relaxed text-[#78664c]
                    "
          >
            Cada grande aventura começa com um personagem. Registre seu herói e
            prepare-se para sua jornada.
          </p>
        </header>

        {/* Formulário */}
        <CharacterForm />

        {/* Rodapé */}
        <footer className="mt-8 text-center">
          <p
            className="
                        font-serif text-sm italic
                        text-[#927e5d]
                    "
          >
            "Que os caminhos sejam favoráveis e as histórias memoráveis."
          </p>
        </footer>
      </div>
    </main>
  );
}

export default App;
