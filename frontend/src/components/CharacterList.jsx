import { useCallback, useEffect, useState } from "react";

import { getCharacters } from "../api";

function CharacterList() {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCharacters = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await getCharacters();
      setCharacters(data);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível carregar os personagens.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCharacters();
  }, [loadCharacters]);

  return (
    <section className="rounded-xl border border-[#806442] bg-[#493726] p-6 shadow-xl sm:p-8">
      <div className="mb-7 flex items-center justify-between gap-4 border-b border-[#806442] pb-5">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#e8d5ad]">
            Personagens cadastrados
          </h2>

          <p className="mt-2 text-sm text-[#bba98a]">
            Os aventureiros registrados nesta campanha.
          </p>
        </div>

        <button
          type="button"
          onClick={loadCharacters}
          disabled={isLoading}
          aria-label="Atualizar lista"
          className="rounded-lg border border-[#a88b5c] px-3 py-2 text-sm text-[#e8d5ad] transition hover:bg-[#5a4531] disabled:opacity-50"
        >
          Atualizar
        </button>
      </div>

      {isLoading && (
        <p role="status" className="py-8 text-center text-[#e8d5ad]">
          Carregando personagens...
        </p>
      )}

      {error && (
        <div className="rounded-lg border border-red-400/40 bg-red-950/30 p-4 text-sm text-red-200">
          <p role="alert">{error}</p>

          <button
            type="button"
            onClick={loadCharacters}
            disabled={isLoading}
            className="mt-3 underline underline-offset-2 disabled:opacity-50"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!isLoading && !error && characters.length === 0 && (
        <p className="py-8 text-center text-[#d2c09f]">
          Nenhum personagem cadastrado ainda.
        </p>
      )}

      {!isLoading && !error && characters.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {characters.map((character) => (
            <li
              key={character.id}
              className="rounded-lg border border-[#806442] bg-[#382b20] p-4"
            >
              <h3 className="font-serif text-xl font-bold text-[#e8d5ad]">
                {character.name}
              </h3>

              <p className="mt-2 text-sm text-[#d2c09f]">
                {character.race} · {character.character_class}
              </p>

              <p className="mt-1 text-xs text-[#bba98a]">
                Nível {character.level}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default CharacterList;
