import { useState } from "react";

function CharacterForm() {
  const [character, setCharacter] = useState({
    name: "",
    race: "",
    character_class: "",
    level: 1,
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCharacter({
      ...character,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Personagem criado:", character);

    alert("Personagem criado com sucesso!");

    setCharacter({
      name: "",
      race: "",
      character_class: "",
      level: 1,
    });
  };

  const inputStyle = `
        w-full rounded-lg border border-[#c4b18c]
        bg-[#f8f1df] px-4 py-3 text-[#382b20]
        outline-none transition
        focus:border-[#8b6b3f]
        focus:ring-2 focus:ring-[#8b6b3f]/20
    `;

  const labelStyle = `
        mb-2 block text-sm font-semibold
        text-[#e5d4b0]
    `;

  return (
    <div className="rounded-xl border border-[#806442] bg-[#493726] p-6 shadow-xl sm:p-8">
      <div className="mb-7 border-b border-[#806442] pb-5">
        <h2 className="font-serif text-2xl font-bold text-[#e8d5ad]">
          Criar Personagem
        </h2>

        <p className="mt-2 text-sm text-[#bba98a]">
          Registre um novo aventureiro em sua jornada.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nome */}
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

        {/* Raça */}
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

        {/* Classe */}
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

        {/* Nível inicial */}
        <div className="rounded-lg border border-[#806442] bg-[#382b20] px-4 py-3">
          <p className="text-sm text-[#bba98a]">Nível inicial</p>

          <p className="mt-1 font-serif text-xl font-bold text-[#e8d5ad]">1</p>
        </div>

        {/* Botão */}
        <div className="border-t border-[#806442] pt-5">
          <button
            type="submit"
            className="
                            w-full rounded-lg border border-[#8b8051]
                            bg-[#596342] px-5 py-3
                            font-semibold text-[#f4e9d0]
                            shadow-md transition duration-200
                            hover:bg-[#68764c]
                            active:scale-[0.98]
                        "
          >
            Criar Personagem
          </button>
        </div>
      </form>
    </div>
  );
}

export default CharacterForm;
