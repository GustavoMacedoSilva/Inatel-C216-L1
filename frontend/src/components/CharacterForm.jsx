import { useState } from "react";

import { createCharacter } from "../api";

const races = [
  "Humano",
  "Elfo",
  "Anão",
  "Orc",
  "Halfling",
  "Tiefling",
  "Draconato",
  "Meio-Elfo",
  "Gnomo",
];

const classes = [
  "Guerreiro",
  "Mago",
  "Ladino",
  "Clérigo",
  "Paladino",
  "Bárbaro",
  "Bardo",
  "Druida",
  "Monge",
  "Patrulheiro",
  "Bruxo",
  "Feiticeiro",
];

const emptyCharacter = {
  name: "",
  race: "",
  character_class: "",
  level: 1,
};

function CharacterForm({ onCreated }) {
  const [character, setCharacter] = useState(emptyCharacter);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCharacter((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      await createCharacter(character);
      setCharacter(emptyCharacter);
      setSuccess("Personagem criado com sucesso!");
      onCreated?.();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = `
    w-full rounded-lg border border-[#c4b18c]
    bg-[#f8f1df] px-4 py-3 text-[#382b20]
    outline-none transition focus:border-[#8b6b3f]
    focus:ring-2 focus:ring-[#8b6b3f]/20
  `;

  const labelStyle = "mb-2 block text-sm font-semibold text-[#e5d4b0]";

  return (
    <section className="rounded-xl border border-[#806442] bg-[#493726] p-6 shadow-xl sm:p-8">
      <div className="mb-7 border-b border-[#806442] pb-5">
        <h2 className="font-serif text-2xl font-bold text-[#e8d5ad]">
          Criar Personagem
        </h2>
        <p className="mt-2 text-sm text-[#bba98a]">
          Registre um novo aventureiro em sua jornada.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className={labelStyle}>
            Nome do personagem
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Ex: Arthas"
            value={character.name}
            onChange={handleChange}
            maxLength={100}
            required
            className={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="race" className={labelStyle}>
            Raça
          </label>
          <select
            id="race"
            name="race"
            value={character.race}
            onChange={handleChange}
            required
            className={inputStyle}
          >
            <option value="" disabled>
              Selecione uma raça
            </option>
            {races.map((race) => (
              <option key={race} value={race}>
                {race}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="character_class" className={labelStyle}>
            Classe
          </label>
          <select
            id="character_class"
            name="character_class"
            value={character.character_class}
            onChange={handleChange}
            required
            className={inputStyle}
          >
            <option value="" disabled>
              Selecione uma classe
            </option>
            {classes.map((characterClass) => (
              <option key={characterClass} value={characterClass}>
                {characterClass}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-lg border border-[#806442] bg-[#382b20] px-4 py-3">
          <p className="text-sm text-[#bba98a]">Nível inicial</p>
          <p className="mt-1 font-serif text-xl font-bold text-[#e8d5ad]">1</p>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-400/40 bg-red-950/30 px-4 py-3 text-sm text-red-200"
          >
            {error}
          </p>
        )}

        {success && (
          <p
            role="status"
            className="rounded-lg border border-green-400/40 bg-green-950/20 px-4 py-3 text-sm text-green-200"
          >
            {success}
          </p>
        )}

        <div className="border-t border-[#806442] pt-5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg border border-[#8b8051] bg-[#596342] px-5 py-3 font-semibold text-[#f4e9d0] shadow-md transition duration-200 hover:bg-[#68764c] active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting ? "Criando..." : "Criar Personagem"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default CharacterForm;
